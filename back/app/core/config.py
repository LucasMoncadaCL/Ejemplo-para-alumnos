from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import Optional

"""
Archivo de configuración usando Pydantic BaseSettings.

Explicación para alumnos:
- `BaseSettings` (Pydantic) carga variables desde el entorno o archivos `.env`.
- Aquí definimos las claves que la app necesita: URL y keys de Supabase.
- `get_settings()` usa `lru_cache` para crear un singleton: evita recrear la
    configuración en cada petición y mejora performance.
"""

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
