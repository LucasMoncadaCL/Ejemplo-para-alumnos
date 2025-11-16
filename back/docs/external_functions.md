# Funciones externas explicadas (Supabase, FastAPI, Pydantic, jose)

Este documento detalla funciones y métodos específicos de librerías usadas en el backend. Sirve para que los alumnos entiendan qué llamadas externas se hacen y por qué.

---

## Supabase (`supabase-py`)

- `create_client(url: str, key: str)`
  - Crea un cliente `Client` para interactuar con Supabase.
  - Uso: `create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)`.
  - Devuelve un objeto con atributos `table`, `auth`, `postgrest`, `storage`, etc.

- `client.table(table_name)`
  - Devuelve un proxy para ejecutar queries sobre la tabla `table_name`.
  - Ejemplos:
    - `client.table('tasks').select('*').execute()` — retorna filas.
    - `client.table('tasks').insert({...}).execute()` — inserta y retorna filas insertadas.
  - Importante: `client.table()` es un builder que soporta métodos encadenados (select, insert, update, delete, eq, order, single, etc.).

- `postgrest.auth(access_token)`
  - Autentica el cliente ante PostgREST con el JWT de Supabase del usuario.
  - Útil para RLS (Row Level Security) — hace que `auth.uid()` en la DB identifique al usuario.
  - Ejemplo: `client = create_client(...); client.postgrest.auth(access_token)`.

- `select`, `insert`, `update`, `delete`, `eq`, `order`, `single` (métodos encadenados en `table`)
  - `select("*")` — selecciona columnas (puedes indicar columnas específicas).
  - `insert({...})` — inserta una fila o lista de filas.
  - `update({...})` — actualiza filas filtradas previamente.
  - `delete()` — elimina filas filtradas.
  - `eq('col', value)` — filtra por igualdad.
  - `order('created_at', desc=False)` — ordena la consulta.
  - `single()` — especifica que esperas una sola fila; puede fallar si vienen varias o ninguna.
  - Todos terminan con `.execute()` para ejecutar la petición y obtener el `Response`.

- `Response` (objeto devuelto por execute)
  - Propiedades claves: `data` (lista/dict), `status_code`, `error`.
  - `data` puede ser `None` o una lista/objeto según el tipo de query.

---

## jsonwebtoken (`python-jose`)

- `jwt.decode(token, secret, algorithms=[...], options={})`
  - Decodifica y verifica la firma JWT.
  - Parámetros:
    - `token`: cadena JWT del header Authorization.
    - `secret`: la key (`SUPABASE_JWT_SECRET`) usada para verificar la firma (HS256 en Supabase por defecto).
    - `algorithms`: lista de algoritmos esperados (p. ej. `['HS256']`).
    - `options`: diccionario para habilitar/deshabilitar verificaciones (ej.: `verify_aud`).
  - Retorna: `payload` (un dict con claims: `sub`, `exp`, `iat`, etc.).
  - `JWTError` se lanza si el token es inválido o la firma no coincide.

---

## FastAPI (funciones y utilidades relevantes)

- `FastAPI()`
  - Crea la instancia principal de la aplicación web. Maneja rutas, middleware y documentación automática.

- `APIRouter()`
  - Permite agrupar rutas por módulos. Luego se monta en la app con `include_router`.

- `Depends()`
  - Permite inyectar dependencias en endpoints. Si pasas `Depends(verify_supabase_token)`, FastAPI ejecuta esa función antes de la ruta y pasa su retorno.

- `HTTPBearer()` y `HTTPAuthorizationCredentials`
  - `HTTPBearer` busca `Authorization: Bearer <token>` y devuelve `HTTPAuthorizationCredentials(credentials='<token>')`.
  - `auto_error=False` evita que FastAPI devuelva 401 automáticamente; así puedes lanzar la excepción personalizada.

- `HTTPException(status_code, detail)`
  - Método para retornar errores HTTP desde endpoints.

- `status.HTTP_201_CREATED`, `status.HTTP_401_UNAUTHORIZED`, `status.HTTP_204_NO_CONTENT`
  - Constantes para códigos HTTP legibles.

- `CORSMiddleware` (from `fastapi.middleware.cors`)
  - Middleware que controla qué orígenes (frontends) pueden hacer solicitudes al backend.

---

## Pydantic (modelos y utilidades)

- `BaseModel` (clase padre)
  - Sirve para validar y serializar datos de entrada/salida.
  - Declaras campos con tipos Python y valores por defecto.

- `model_dump()`
  - Serializa la instancia a `dict`.
  - `model_dump(exclude_unset=True)` — útil para updates: excluye campos no seteados (solo actualiza lo enviado).

- `TaskOut(**row)`
  - Crea instancia Pydantic a partir de un dict, valida tipos y formatea `datetime` automáticamente.

---

## python-dotenv / BaseSettings

- En `config.py` usamos `pydantic.BaseSettings` que carga variables del entorno (si existe `.env` pydantic las carga si `env_file` está configurado).
- Alternativamente puedes usar `python-dotenv` para cargar variables al entorno manualmente.

---

## Recomendaciones sobre librerías y pruebas

- Para pruebas unitarias, mockear `get_supabase` permite aislar los servicios sin hacer llamadas reales a la nube.
- Para tests de integración, usar un proyecto Supabase de prueba o una instancia local de Postgres con la misma tabla y reglas.
- `postgrest.auth(token)` debe usarse con cuidado: en producción, asegúrate de que los tokens no se filtren a logs.
