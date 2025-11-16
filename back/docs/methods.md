# Documentación de métodos (backend)

Este documento lista y explica las funciones y métodos más relevantes del backend.
Los métodos se agrupan por archivo/área: `core`, `services`.

---

## app/core/config.py

- `class Settings(BaseSettings)`
  - Objetivo: definir y validar variables de entorno necesarias: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, `ENVIRONMENT`.
  - Uso: Pydantic carga automáticamente `env_file` `.env`.
  - Importancia: centraliza configuración y evita hardcodear valores sensibles.

- `get_settings()`
  - Retorna: instancia `Settings` (cached por `lru_cache`).
  - Nota: `lru_cache()` asegura que solo hay una instancia por proceso, evitando relecturas continuas.

---

## app/core/database.py

- `_get_base_client()`
  - Crea un cliente `supabase` base con `SUPABASE_ANON_KEY`.
  - Ideal para operaciones públicas.

- `get_supabase(access_token: Optional[str] = None)`
  - Parámetros: `access_token` (JWT de Supabase, opcional).
  - Comportamiento:
    - Si se pasa `access_token`, crea un cliente y llama `client.postgrest.auth(access_token)` para que las consultas respeten RLS (Row Level Security).
    - Si no se pasa, retorna el cliente base (sin contexto de usuario).
  - Uso: todas las funciones de `services` llaman `get_supabase` con el token del usuario.

---

## app/core/security.py

- `auth_scheme = HTTPBearer(auto_error=False)`
  - Define el esquema de seguridad que espera un header `Authorization: Bearer <token>`.

- `verify_supabase_token(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme))`
  - Parámetros inyectados por FastAPI: `credentials`.
  - Proceso:
    1. Si `credentials` es `None` lanza 401.
    2. Usa `jose.jwt.decode` con `SUPABASE_JWT_SECRET` para decodificar el token y obtener `payload`.
    3. Extrae `sub` como id del usuario (user_id).
    4. Retorna dict con `id`, `_access_token` y `claims`.
  - Importante: sirve como dependencia en rutas para autenticar y obtener user info.

---

## app/services/tasks_service.py

- `listar_tareas(access_token: str) -> List[TaskOut]`
  - Llama a `get_supabase(access_token)` y ejecuta `select("*")` sobre la tabla `tasks` ordenada por `created_at`.
  - Retorna lista de `TaskOut` (Pydantic) para serializar al frontend.

- `crear_tarea(data: TaskCreate, access_token: str) -> TaskOut`
  - `data` es un Pydantic model; `data.model_dump()` crea un `dict` listo para insertar.
  - Llama `insert(insert_data).execute()` y retorna la fila insertada como `TaskOut`.
  - Atención: `user_id` puede completarse en la DB con `auth.uid()` si se configuró RLS y la función SQL.

- `obtener_tarea(task_id: int, access_token: str) -> Optional[TaskOut]`
  - Consulta `.eq("id", task_id).single()` para obtener una fila.
  - Si no existe, retorna `None`.

- `actualizar_tarea(task_id: int, data: TaskUpdate, access_token: str) -> Optional[TaskOut]`
  - `update_data = data.model_dump(exclude_unset=True)` para actualizar solo campos enviados.
  - Realiza `update(update_data).eq("id", task_id)` y retorna `TaskOut` con la fila actualizada.
  - Si no envías campos (vacío), retorna la tarea actual.

- `eliminar_tarea(task_id: int, access_token: str) -> bool`
  - Ejecuta `delete().eq("id", task_id)` y retorna `True` si `res.data` contiene filas eliminadas.

---

## app/schemas/task_schema.py (métodos/funciones implícitas)

Pydantic ofrece métodos útiles sobre los modelos:

- `TaskCreate`, `TaskUpdate`, `TaskOut` heredan `BaseModel`.
- `model_dump()` — serializa el model a `dict` (se usa para insertar o actualizar datos).
- `TaskOut(**row)` — construye el modelo a partir de una fila proveniente de la DB.

Puntos de validación:
- `titulo: str` valida que se recibe string; si se quiere, se puede añadir `Field(min_length=3)` para más validación.

---

## Notas generales sobre errores y excepciones

- Los servicios asumen que `get_supabase` devuelve un cliente funcional. Si supabase falla, la excepción será levantada por `supabase-py`.
- Los endpoints transforman `None` a errores HTTP (ej: 404) en `tasks_routes.py`.

---

> Si quieres, puedo generar un documento técnico con UML (diagrama de clases/flujo) que muestre las relaciones entre métodos y modelos.
