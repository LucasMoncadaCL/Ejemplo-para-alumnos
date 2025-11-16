from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import tasks_routes
from app.core.config import get_settings

settings = get_settings()

"""
Archivo principal de la aplicación (entrypoint).

Explicación para alumnos:
- `FastAPI()` crea la instancia de la aplicación web. FastAPI usa tipado y async para
    manejar rutas fácilmente.
- La configuración de `CORS` permite que el frontend (por ejemplo, Vite/React)
    haga peticiones al backend desde otro origen.
- `include_router` importa rutas organizadas en módulos (aquí `tasks_routes`).

La idea es mantener `main.py` ligero: configura la app y monta routers.
"""

app = FastAPI(
    title="Backend de Tareas con FastAPI + Supabase",
    version="1.0",
    description="Ejemplo de backend simple para hackathons",
)

# Configuración básica de CORS (ajusta para tu frontend)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    # agrega aquí la URL de tu frontend en producción
]

if settings.ENVIRONMENT == "development":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas de tareas
app.include_router(
    tasks_routes.router,
    prefix="/api/tasks",
    tags=["Tasks"],
)

@app.get("/")
def root():
    return {
        "message": "Backend activo",
        "version": "1.0",
        "docs": "/docs",
    }

# Nota para alumnos:
# - `@app.get("/docs")` no es necesario declarar: FastAPI agrega Swagger UI
#   automáticamente en `/docs` y ReDoc en `/redoc`.
