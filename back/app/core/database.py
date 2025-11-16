from functools import lru_cache
from typing import Optional

from supabase import create_client, Client
from .config import get_settings

_supabase_service_client: Optional[Client] = None

@lru_cache()
def _get_base_client() -> Client:
    """
    Cliente sin token de usuario.
    Útil para operaciones públicas o administrativas.
    """
    settings = get_settings()
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

def get_supabase(access_token: Optional[str] = None) -> Client:
    """
    Devuelve un cliente de Supabase.

    - Si se pasa `access_token`: genera un cliente con token de usuario, útil para
        aplicar RLS (Row Level Security) en Supabase y que las queries sólo vean
        lo que el usuario puede ver.
    - Si no se pasa token: devuelve un cliente "base" sin contexto de usuario.

    Conceptos importantes para alumnos:
    - RLS en PostgreSQL limita filas por usuario y se utiliza comúnmente con
        Supabase combinando JWT y `auth.uid()` en SQL.
    - No guardes tokens en código en producción; usa env vars y prácticas seguras.
    """
    settings = get_settings()

    if access_token:
        # Cliente con contexto de usuario (RLS)
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
        client.postgrest.auth(access_token)
        return client

    # Cliente base compartido
    return _get_base_client()
