from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from .config import get_settings

# HTTPBearer es el esquema que busca un Authorization: Bearer <token>
auth_scheme = HTTPBearer(auto_error=False)

async def verify_supabase_token(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
):
    """
    Dependencia de seguridad que FastAPI puede inyectar en un endpoint.

    - Recibe el JWT del header `Authorization` gracias a `HTTPBearer`.
    - Decodifica el token con `jose.jwt` usando el secreto (`SUPABASE_JWT_SECRET`).
    - Si todo es correcto, retorna un diccionario con el `id` del usuario y el token;
        esto lo puedes usar en rutas para identificar al usuario.
    NOTAS para alumnos:
    - `Depends`: cuando lo pones en la firma de una ruta, FastAPI ejecuta la
        función y pasa su resultado a la ruta (inyección de dependencias).
    - En producción no ignores la aud (audíencia): aquí se desactivó para el ejemplo
        del hackathon.
    """
    if credentials is None:
        raise HTTPException(    
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falta encabezado Authorization",
        )

    token = credentials.credentials
    settings = get_settings()

    try:
        # Supabase por defecto usa HS256 + JWT_SECRET
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},  # simplificamos para hackathon
        )
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: sin 'sub'",
            )

        # Lo que retornamos lo tendrás disponible en los endpoints
        return {
            "id": user_id,
            "_access_token": token,
            "claims": payload,
        }

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de Supabase inválido",
        )
