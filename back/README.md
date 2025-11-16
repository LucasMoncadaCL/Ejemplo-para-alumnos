# Backend - Ejemplo para alumnos (FastAPI + Supabase)

Este directorio contiene un backend pequeño pensado para clases y hackathons:

- Estructura modular: `core`, `routes`, `schemas` y `services`.
- Uso de Supabase como fuente de datos (Postgres + Auth + RLS).
- Documentación automática con Swagger UI (`/docs`) y redoc (`/redoc`).

Nota pedagógica: las explicaciones y ejemplos en este repositorio están pensados
para alumnos cuya experiencia práctica previa se limita a Oracle Data Modeler
y consultas simples desde Oracle SQL Developer. Por eso las comparaciones con
PostgreSQL/Supabase incluyen explicaciones paso a paso y equivalencias técnicas.

### Si sólo usas Oracle Data Modeler y SQL Developer (instrucciones rápidas)

- Extraer DDL desde Data Modeler: abre el modelo, menú `File` → `Export` → `DDL File`, selecciona las tablas y guarda el .sql. Usa ese DDL con los prompts en `docs/prompts_migration.md`.
- Exportar datos desde SQL Developer a CSV: en SQL Developer haz clic derecho sobre la tabla → `Export` → selecciona `CSV`, marca `Header` y guarda el archivo. Este CSV se puede importar en PostgreSQL con `COPY` (ver `docs/prompts_examples/csv_copy_example.md`).
- Si no quieres instalar herramientas nuevas, puedes usar el flujo: Data Modeler (DDL) → SQL Developer (export CSV) → `COPY` en Postgres o `pgloader` si lo prefieres.

Estas indicaciones están integradas en los ejemplos de `docs/prompts_examples/` para que puedas seguir paso a paso usando las herramientas que ya conoces.

---

## Índice

1. [Requisitos](#requisitos)
2. [Ejecución local rápida](#ejecución-local-rápida)
3. [Estructura de carpetas y porqué](#estructura-de-carpetas-y-porqué)
4. [Funciones y módulos principales (qué hacen)](#funciones-y-módulos-principales-qué-hacen)
5. [Cómo se comunican los archivos (flujo)](#cómo-se-comunican-los-archivos-flujo)
6. [Consejos para hackathons](#consejos-para-hackathons)
7. [Extensiones y ejercicios para alumnos](#extensiones-y-ejercicios-para-alumnos)
8. [Seguridad y producción](#seguridad-y-producción)

---

## Requisitos

- Python 3.11 o superior
- Dependencias declaradas en `requirements.txt` (FastAPI, Uvicorn, supabase-py, python-jose, python-dotenv)

## Ejecución local rápida (PowerShell)
Seguramente ustedes ya saben descargar con pip, pero si no lo saben, desde acá ustedes pueden descargar librerias externas de python.

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Variables: el proyecto incluye un .env con keys demo de Supabase
uvicorn main:app --reload
```

Abrir `http://127.0.0.1:8000/docs` para la UI interactiva (Swagger) y `http://127.0.0.1:8000/redoc` para ReDoc.

---

## Estructura de carpetas y porqué

Estructura actual:

- `main.py` — Entrypoint; configura FastAPI, CORS y registra routers.
- `app/core/` — Configuración, conexión a DB y utilidades de seguridad.
	- `config.py` — Carga variables de entorno con Pydantic `BaseSettings`.
	- `database.py` — Crea clientes de Supabase; maneja tokens y clientes base.
	- `security.py` — Dependencias de seguridad y verificación de JWT.
- `app/routes/` — `APIRouter` con endpoints (aquí `tasks_routes.py`).
- `app/schemas/` — Pydantic models (esquemas de entrada/salida).
- `app/services/` — Lógica de negocio: accesos a DB y transformaciones.

Por qué esta organización ayuda en un hackathon:

- Separa responsabilidades: las rutas no contienen lógica de negocio compleja.
- Facilita trabajo en paralelo: una persona puede trabajar en rutas, otra en servicios.
- Permite añadir rápidamente nuevos routers o reemplazar la fuente de datos.
- Hace que los tests y el mocking sean sencillos (ej.: mockear `get_supabase`).

---

## Funciones y módulos principales (qué hacen)

Abajo están las funciones/módulos principales y su propósito — refiérete a cada archivo para ver ejemplos concretos.

- `main.py`
	- `FastAPI()` — crea la app.
	- `app.add_middleware(CORSMiddleware, ...)` — habilita CORS para el frontend.
	- `app.include_router(tasks_routes.router, prefix='/api/tasks')` — registra las rutas de tareas.

- `app/core/config.py`
	- `Settings(BaseSettings)` — define variables de entorno requeridas (ej. `SUPABASE_URL`).
	- `get_settings()` — función cached que retorna las settings (evita instancias repetidas).

- `app/core/database.py`
	- `_get_base_client()` — crea y retorna el cliente de supabase (sin token).
	- `get_supabase(access_token=None)` — si se pasa token, crea cliente con `postgrest.auth(token)`;
		esto permite usar RLS y consultas limitadas al usuario.

- `app/core/security.py`
	- `auth_scheme = HTTPBearer()` — esquema para leer Authorization: Bearer <token>.
	- `verify_supabase_token(credentials=Depends(auth_scheme))` — decodifica el JWT y retorna `{'id': user_id, '_access_token': token}`.

- `app/schemas/task_schema.py`
	- `TaskCreate`, `TaskUpdate`, `TaskOut` — modelos Pydantic para entrada/salida.
	- `TaskOut` incluye `id`, `created_at` y `updated_at` para serializar.

- `app/services/tasks_service.py`
	- `listar_tareas(access_token)` — select * ordenado por created_at.
	- `crear_tarea(data, access_token)` — insert en Supabase.
	- `obtener_tarea(task_id, access_token)` — select where id igual.
	- `actualizar_tarea(task_id, data, access_token)` — update con `exclude_unset=True`.
	- `eliminar_tarea(task_id, access_token)` — delete por id.

---

## Cómo se comunican los archivos (flujo de peticiones)

Diagrama simplificado (petición GET a /api/tasks):

1. Cliente (frontend) envía petición a `GET /api/tasks`.
2. `main.py` enruta a `tasks_routes` mediante `include_router`.
3. `tasks_routes.listar()` se ejecuta:
	 - FastAPI inyecta la dependencia `verify_supabase_token` en `usuario`.
	 - `verify_supabase_token` decodifica el token y retorna un dict con `_access_token`.
4. `listar()` entrega `access_token` a `tasks_service.listar_tareas`.
5. `tasks_service` llama `get_supabase(access_token)` en `app/core/database.py`.
6. `get_supabase` crea un cliente Supabase con `postgrest.auth(access_token)` —
	 esto permite que Postgres aplique RLS usando `auth.uid()`.
7. Se ejecuta la query (`select`, `insert`, etc.) y Supabase devuelve `data`.
8. `tasks_service` transforma los resultados a `TaskOut(**row)` y los devuelve.
9. FastAPI serializa los modelos y los envía al frontend.

En resumen: Rutas -> Dependencias (seguridad) -> Servicios (negocio) -> DB -> Pydantic -> Respuesta.

---

## Consejos para hackathons (por qué esta estructura es útil)

- Separación rápida de responsabilidad: puedes iterar rápidamente sobre la UI sin romper la lógica de negocio.
- Reemplazo sencillo de la DB: si durante el hackathon necesitas usar una base local o un stub, solo cambias `get_supabase`.
- Testing y demos más fáciles: los servicios son testables de manera aislada sin arrancar el servidor.
- Escalabilidad progresiva: si la idea resulta viable, es muy fácil añadir middlewares, autenticación completa o más tablas y routers.

---

## Ejercicios y extensiones sugeridas para alumnos

- Agregar un filtro `?completada=true` al endpoint `GET /api/tasks`.
- Crear un endpoint `PATCH /api/tasks/{id}/toggle` que cambie `completada`.
- Añadir validación de longitud mínima a `TaskCreate.titulo` (Pydantic `Field(min_length=3)`).
- Escribir tests para `tasks_service`:
	- Mockear `get_supabase` para devolver objetos JSON y validar los modelos Pydantic.
- Implementar un endpoint público (sin token) que devuelva solo tareas públicas (si existiera campo `public`).

---

## Documentación adicional

He añadido documentación extra en `docs/`:

- `docs/methods.md`: explica cada método principal en `core` y `services`, su propósito y retorno.
- `docs/endpoints.md`: describe endpoints, validaciones, ejemplos de `curl` y respuestas.
- `docs/external_functions.md`: explica funciones de librerías externas (Supabase, jose, Pydantic, FastAPI).

Además de los anteriores, el proyecto contiene la siguiente documentación útil para la clase y el hackathon:

- `docs/exercises.md`: ejercicios prácticos para que los alumnos practiquen (Supabase, JWT, FastAPI, Pydantic, tests).
- `docs/solutions.md`: solucionario detallado con scripts de ejemplo y explicaciones paso a paso.
- `docs/env_security.md`: guía sobre por qué no subir `.env`, cómo añadir `.gitignore` y pasos de mitigación en caso de filtración.
- `docs/schema_postgres_vs_oracle.md`: deconstrucción del DDL `tasks` (Postgres/Supabase) con equivalencias y notas para Oracle 21c.
- `docs/prompts_migration.md`: plantillas de prompts para usar LLMs en la migración Oracle → PostgreSQL.

También incluye ejemplos prácticos en `docs/prompts_examples/`:

- `docs/prompts_examples/ddl_conversion.md` — ejemplo de prompt y respuesta para conversión de DDL.
- `docs/prompts_examples/trigger_conversion.md` — ejemplo para convertir triggers (PL/SQL → PL/pgSQL).
- `docs/prompts_examples/pgloader_example.md` — plantilla de configuración `pgloader`.
- `docs/prompts_examples/csv_copy_example.md` — pasos para exportar desde Oracle a CSV y usar `COPY` en Postgres.
- `docs/prompts_examples/validation_checks.md` — queries y checks para validar la migración.

---

## Seguridad y notas de producción

- El ejemplo usa un `SUPABASE_JWT_SECRET` simple y los `options={'verify_aud': False}`
	para simplificar en un hackathon — esto NO es seguro en producción.
- Producción: validar `aud`, rotar secretos, usar entornos secretos y no guardar `.env` en repositorios públicos.
- Para usar la app en producción, programa un flujo de refresco de tokens y considera usar Cloudflare/HTTPS.

---

## Problemas comunes y debugging

- Problema: 401 Unauthorized en endpoints con token
	- Revisar que el header sea `Authorization: Bearer <token>`.
	- Verificar `SUPABASE_JWT_SECRET` y la `aud` en la configuración de Supabase.

- Problema: `res.data` vacío en respuestas de Supabase
	- Revisar RLS (Row Level Security) y que el usuario tenga permiso a las filas.
