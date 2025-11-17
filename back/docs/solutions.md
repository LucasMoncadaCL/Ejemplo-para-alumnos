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
print('count:', res.count)
print('data:', res.data)
print('error:', res.error if hasattr(res, 'error') else 'No error')
```

Explicación y salida esperada:
- `res.data` será `None` o una lista con hasta 1 objeto.
- `res.count` te muestra cuántas filas se devolvieron (puede ser `None` si no usas `.count()`).
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

# Autenticarse con email/contraseña
try:
    auth_response = client.auth.sign_in_with_password({
        'email': 'tu.email@ejemplo.com',
        'password': 'tu_contraseña'
    })
    print('Autenticado:', auth_response.user.id)
except Exception as e:
    print('Error de autenticación:', e)
    exit(1)

# Ahora insertar
new = {'titulo': 'Tarea de prueba', 'descripcion': 'Insert desde script', 'completada': False}
try:
    res = client.table('tasks').insert(new).execute()
    print('insert error:', res.error if hasattr(res, 'error') else 'No error')
    print('insert data', res.data)
except Exception as e:
    print('Error al insertar:', e)
```

Notas:
- Si la tabla tiene triggers o columnas `created_at` auto, la respuesta incluirá esos campos.
- Si RLS bloquea la inserción, prueba con el cliente sin autenticar o ajusta la política temporalmente.
- En Supabase v2, no existe `res.status_code`; usa `res.error` para detectar problemas.

---

## Ejercicio 3 — Autenticar con email/contraseña, obtener token y usarlo (postgrest.auth)

Objetivo: pedir credenciales (email/password), obtener un token de sesión y usar ese token para autenticar las llamadas PostgREST (útil cuando RLS está habilitado). También mostramos cómo validar/decodificar el token en el backend.

Script interactivo de ejemplo (`scripts/auth_and_use_token.py`):

```python
from supabase import create_client
from dotenv import load_dotenv
import os
import getpass

load_dotenv()
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_ANON_KEY = os.environ['SUPABASE_ANON_KEY']

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Pedir credenciales al usuario (no dejar en claro-text en archivos)
email = input('Email: ').strip()
password = getpass.getpass('Password: ')

# Intentar autenticar y extraer token de acceso
auth_resp = client.auth.sign_in_with_password({'email': email, 'password': password})

# Extraer el access token de la respuesta (manejamos formas comunes según versión)
token = None
if isinstance(auth_resp, dict):
    token = (
        auth_resp.get('access_token')
        or (auth_resp.get('data') or {}).get('access_token')
        or (auth_resp.get('data') or {}).get('session') and (auth_resp['data']['session'].get('access_token'))
    )
else:
    token = getattr(auth_resp, 'access_token', None) or getattr(auth_resp, 'accessToken', None)

if not token:
    print('No se pudo obtener access token. Revisa credenciales y la respuesta de autenticación:')
    print(auth_resp)
    raise SystemExit(1)

print('Access token obtenido (trimmed):', token[:40] + '...' if len(token) > 40 else token)

# Asociar el token al cliente PostgREST para que las consultas respeten RLS
client.postgrest.auth(token)

# Ahora hacemos una consulta que será ejecutada con el contexto del usuario autenticado
res = client.table('tasks').select('*').execute()
print('data with auth:', res.data)
print('error:', res.error if hasattr(res, 'error') else 'No error')
```

Ocupar ahora el token

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

Notas importantes:
- Si RLS está habilitado en `tasks`, las consultas hechas con `client.postgrest.auth(token)` respetarán las políticas y devolverán solo filas permitidas para el `auth.uid()` del token.
- En entornos de producción **no** pidas credenciales por `input()` en scripts; usa flujos seguros (formularios, OAuth, sesiones HTTPS, etc.).
- Asegúrate de que `SUPABASE_JWT_SECRET` esté disponible en el backend para validar JWTs si quieres verificar firma y claims.

Ejemplo rápido de flujo para alumnos:
1. Ejecutar `python scripts/auth_and_use_token.py` y autenticarse.
2. Ver la salida de `data with auth:` que muestra solo las tareas del usuario autenticado (si las políticas están configuradas).
3. Si la inserción falla por RLS, usar el token antes de insertar o ajustar la política para pruebas.

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
        r.count = 1
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
