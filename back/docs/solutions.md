# Solucionario: ejercicios sobre funciones externas

Este documento contiene soluciones detalladas y explicadas para los ejercicios de `docs/exercises.md`.

---

## Ejercicio 1 — Crear cliente Supabase

Archivo ejemplo: `scripts/test_supabase_client.py`

```python
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_ANON_KEY = os.environ['SUPABASE_ANON_KEY']

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
res = client.table('tasks').select('*').limit(1).execute()
print('status:', res.status_code)
print('data:', res.data)
print('error:', res.error)
```

Explicación y salida esperada:
- `res.data` será `None` o una lista con hasta 1 objeto.
- `res.status_code` normalmente 200 si la petición fue correcta.
- Si `res.error` no es `None`, revisa la URL, la key o la disponibilidad del proyecto Supabase.

---

## Ejercicio 2 — Insert y select en Supabase

Archivo ejemplo: `scripts/insert_and_select.py`

```python
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_ANON_KEY = os.environ['SUPABASE_ANON_KEY']

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
# Insertar
new = {'titulo': 'Tarea de prueba', 'descripcion': 'Insert desde script', 'completada': False}
res = client.table('tasks').insert(new).execute()
print('insert status', res.status_code)
print('insert data', res.data)

# Obtener id insertado
if res.data:
    new_id = res.data[0]['id']
    sel = client.table('tasks').select('*').eq('id', new_id).single().execute()
    print('select data', sel.data)
```

Notas:
- Si la tabla tiene triggers o columnas `created_at` auto, la respuesta incluirá esos campos.
- Si RLS bloquea la inserción, prueba con el cliente sin autenticar o ajusta la política temporalmente.

---

## Ejercicio 3 — Autenticar cliente con token (postgrest.auth)

Script ejemplo:

```python
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_ANON_KEY = os.environ['SUPABASE_ANON_KEY']
TOKEN = '<TOKEN_DE_EJEMPLO>'

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
client.postgrest.auth(TOKEN)
res = client.table('tasks').select('*').execute()
print('data with auth:', res.data)
```

Qué observar:
- Si RLS está habilitado para la tabla, `res.data` ahora será filtrado por `auth.uid()` (JWT debe contener `sub` igual al id del usuario en la DB).
- Con el cliente base (sin `postgrest.auth`) verás otras filas (o más/menos) según políticas.

---

## Ejercicio 4 — Decodificar JWT con `python-jose`

Archivo: `scripts/decode_jwt.py`

```python
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

load_dotenv()
secret = os.environ['SUPABASE_JWT_SECRET']

token = '<TOKEN_DE_EJEMPLO>'
try:
    payload = jwt.decode(token, secret, algorithms=['HS256'], options={'verify_aud': False})
    print('payload:', payload)
except JWTError as e:
    print('Token inválido:', e)
```

Salida esperada:
- `payload` es un `dict` que contiene claims como `sub` (user id), `exp`, `iat`, y posiblemente `role`.
- Si el token es inválido o la firma no coincide, obtendrás `JWTError`.

---

## Ejercicio 5 — Dependencias en FastAPI: `Depends` + `HTTPBearer`

Añadir en `main.py` o en un router:

```python
from fastapi import APIRouter, Depends
from app.core.security import verify_supabase_token

router = APIRouter()

@router.get('/test-dep')
async def test_dep(usuario = Depends(verify_supabase_token)):
    return usuario
```

Prueba con `curl` (token válido):

```bash
curl -H "Authorization: Bearer <TOKEN>" http://127.0.0.1:8000/test-dep
```

Respuesta esperada:
- JSON con `id` y `_access_token` (y claims si los incluyes).
- Si no envías token, 401 Unauthorized con detalle.

Explicación:
- `Depends` ejecuta `verify_supabase_token` antes de la ruta; si la dependencia levanta `HTTPException` la ruta no se ejecuta.

---

## Ejercicio 6 — Pydantic: `model_dump()` y `exclude_unset`

Código en REPL:

```python
from app.schemas.task_schema import TaskCreate, TaskUpdate

c = TaskCreate(titulo='Prueba', descripcion='xyz')
print(c.model_dump())

u = TaskUpdate(titulo='Nuevo')
print(u.model_dump())
print(u.model_dump(exclude_unset=True))
```

Salida esperada y explicación:
- `c.model_dump()` -> `{'titulo': 'Prueba', 'descripcion': 'xyz', 'completada': False}` (valores por defecto incluidos).
- `u.model_dump()` -> `{'titulo': 'Nuevo', 'descripcion': None, 'completada': None}` si usas model_dump sin `exclude_unset`.
- `u.model_dump(exclude_unset=True)` -> `{'titulo': 'Nuevo'}` (solo campos enviados), ideal para `update()`.

---

## Ejercicio 7 — Simulación para tests (mockear `get_supabase`)

Ejemplo con `pytest` y `monkeypatch`:

```python
# tests/test_tasks_service.py
from app.services import tasks_service
from app.schemas.task_schema import TaskOut

class DummyTable:
    def select(self, *args, **kwargs):
        return self
    def order(self, *a, **k):
        return self
    def execute(self):
        class R: pass
        r = R()
        r.data = [{'id': 1, 'titulo': 'Mock', 'descripcion': None, 'completada': False, 'created_at': '2024-01-01T00:00:00', 'updated_at': '2024-01-01T00:00:00'}]
        r.status_code = 200
        r.error = None
        return r

class DummyClient:
    def table(self, name):
        return DummyTable()

def test_listar_tareas(monkeypatch):
    monkeypatch.setattr('app.core.database.get_supabase', lambda token=None: DummyClient())
    res = tasks_service.listar_tareas('fake-token')
    assert isinstance(res, list)
    assert isinstance(res[0], TaskOut)
    assert res[0].titulo == 'Mock'
```

Explicación:
- Reemplazamos `get_supabase` para devolver un cliente dummy que imita la API de `supabase-py`.
- Así probamos `listar_tareas` sin tocar servicios externos.

---

## Notas finales

- Siempre captura `res.error` en scripts reales para entender fallos.
- Para pruebas avanzadas, considera usar fixtures que creen y destruyan datos en una instancia de test de Supabase.
- En el caso de tokens, puedes generar JWTs de prueba usando `python-jose` con el `SUPABASE_JWT_SECRET`.
