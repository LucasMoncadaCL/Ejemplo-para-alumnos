from pydantic import BaseModel
from typing import Optional
from datetime import datetime

"""
Schemas con Pydantic para validar y serializar datos.

- `BaseModel` sirve para definir la forma de datos que esperamos recibir o devolver.
- `TaskCreate`, `TaskUpdate` y `TaskOut` separan la capa de entrada y salida:
    * `TaskCreate`: datos requeridos para crear (titulo, descripción opcional)
    * `TaskUpdate`: datos opcionales para actualizar (por eso todos Optional)
    * `TaskOut`: lo que devolvemos al frontend; incluye `id` y timestamps.

Puntos importantes para alumnos:
- `model_dump()` (usado en el servicio) serializa el model a dict listo para guardar.
- `response_model` en rutas usa estos schemas para validar la salida.
"""

class TaskBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    completada: bool = False

class TaskCreate(TaskBase):
    """Datos para crear una tarea."""
    pass

class TaskUpdate(BaseModel):
    """Datos opcionales para actualizar una tarea."""
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    completada: Optional[bool] = None

class TaskOut(TaskBase):
    """Lo que devolvemos al frontend."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
