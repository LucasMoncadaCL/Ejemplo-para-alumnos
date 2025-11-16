# Ejercicios prácticos sobre funciones externas

Este documento contiene ejercicios cortos pensados para alumnos para practicar
las funciones externas usadas en el backend: Supabase (`supabase-py`), `python-jose`,
FastAPI y Pydantic.

Reglas:
- Intenta resolver cada ejercicio en un archivo nuevo o en la REPL.
- Guarda capturas de pantalla o resultados (JSON) para comparar con el solucionario.

---

## Ejercicio 1 — Crear cliente Supabase

Objetivo: entender `create_client` y obtener la lista de tablas (o ejecutar un `select` simple).

Tarea:
1. En un script `scripts/test_supabase_client.py`, crea un cliente con `create_client(SUPABASE_URL, SUPABASE_ANON_KEY)` (usa las vars del `.env`).
2. Ejecuta `client.table('tasks').select('*').limit(1).execute()` y muestra por pantalla `res.data` y `res.status_code`.

Comprobación: asegúrate de que `res` no tiene `error` y que `res.data` es una lista o `null`.

---

## Ejercicio 2 — Insert y select en Supabase

Objetivo: practicar `insert()` y `select()` encadenando los métodos.

Tarea:
1. Crea un script `scripts/insert_and_select.py` que inserte una tarea de prueba con `insert()`.
2. Después de insertar, ejecuta un `select('*').eq('id', new_id).single().execute()` para obtener la fila insertada.
3. Muestra la fila por pantalla.

Nota: si RLS impide insertar, prueba con el cliente base (sin token) o ajusta temporalmente la política de RLS.

---

## Ejercicio 3 — Autenticar cliente con token (postgrest.auth)

Objetivo: ver cómo `postgrest.auth(token)` cambia el contexto de las consultas.

Tarea:
1. Toma un JWT válido (puede ser uno real o uno generado por `python-jose` con el secreto del `.env`).
2. Crea un cliente y ejecuta `client.postgrest.auth(token)`.
3. Ejecuta `select()` sobre `tasks` y observa diferencias con el cliente sin token (por ejemplo, filas visibles por RLS).

---

## Ejercicio 4 — Decodificar JWT con `python-jose`

Objetivo: decodificar y leer claims de un JWT.

Tarea:
1. Crea un script `scripts/decode_jwt.py` que lea `SUPABASE_JWT_SECRET` del `.env`.
2. Dado un token de ejemplo, usar `jwt.decode(token, secret, algorithms=['HS256'], options={'verify_aud': False})`.
3. Imprimir `payload` y comprobar que contiene `sub`, `iat` y `exp`.

---

## Ejercicio 5 — Dependencias en FastAPI: `Depends` + `HTTPBearer`

Objetivo: entender cómo se inyecta una dependencia de seguridad.

Tarea:
1. Crea un pequeño `router` o endpoint en `main.py` (ej.: `GET /test-dep`) que reciba `usuario = Depends(verify_supabase_token)` y devuelva `usuario`.
2. Arranca la app y prueba con un token válido: deberías recibir el dict con `id` y `_access_token`.
3. Prueba sin token: deberías recibir 401.

---

## Ejercicio 6 — Pydantic: `model_dump()` y `exclude_unset`

Objetivo: ver cómo serializar modelos y preparar datos para updates parciales.

Tarea:
1. Desde un REPL o script, crea `TaskCreate(titulo='Prueba', descripcion='...')` y ejecuta `model_dump()`.
2. Crea `TaskUpdate(titulo='Nuevo')` y ejecuta `model_dump(exclude_unset=True)`.
3. Observa las diferencias en los `dict` resultantes.

---

## Ejercicio 7 — Simulación para tests (mockear `get_supabase`)

Objetivo: aprender a aislar los servicios en tests unitarios.

Tarea:
1. Escribe un test simple para `tasks_service.listar_tareas` donde reemplaces (monkeypatch) `app.core.database.get_supabase` por una función que retorne un objeto con `table(...).select(...).execute()` devolviendo `data=[{...}]`.
2. Comprueba que `listar_tareas` transforma la respuesta a `TaskOut` correctamente.

---

Entrega: sube los scripts en `back/scripts/` o pega los outputs en un documento y luego compara con el `docs/solutions.md`.
