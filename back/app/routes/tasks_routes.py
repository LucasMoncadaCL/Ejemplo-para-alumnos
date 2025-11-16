from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.schemas.task_schema import TaskCreate, TaskOut, TaskUpdate
from app.services import tasks_service
from app.core.security import verify_supabase_token

"""
Rutas (endpoints) relacionadas con 'tasks'.

Explicación para alumnos:
- `APIRouter` permite organizar las rutas en módulos en vez de tenerlas todas
    en `main.py`.
- `Depends(verify_supabase_token)` inyecta seguridad: la ruta no se ejecuta
    si el token es inválido o faltante.
- `response_model` usa Pydantic para validar/serializar la respuesta que enviamos al frontend.
"""

router = APIRouter()

@router.get("/", response_model=List[TaskOut])
async def listar(usuario = Depends(verify_supabase_token)):
    """Lista las tareas del usuario autenticado."""
    # `usuario` es lo que devuelve `verify_supabase_token` (dict con id & token)
    access_token = usuario["_access_token"]
    return tasks_service.listar_tareas(access_token)

@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def crear(data: TaskCreate, usuario = Depends(verify_supabase_token)):
    """Crea una nueva tarea para el usuario autenticado."""
    access_token = usuario["_access_token"]
    return tasks_service.crear_tarea(data, access_token)

@router.get("/{task_id}", response_model=TaskOut)
async def obtener(task_id: int, usuario = Depends(verify_supabase_token)):
    """Obtiene una tarea por ID (si pertenece al usuario)."""
    access_token = usuario["_access_token"]
    tarea = tasks_service.obtener_tarea(task_id, access_token)
    if tarea is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return tarea

@router.put("/{task_id}", response_model=TaskOut)
async def actualizar(task_id: int, data: TaskUpdate, usuario = Depends(verify_supabase_token)):
    """Actualiza una tarea del usuario."""
    access_token = usuario["_access_token"]
    tarea = tasks_service.actualizar_tarea(task_id, data, access_token)
    if tarea is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return tarea

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def borrar(task_id: int, usuario = Depends(verify_supabase_token)):
    """Elimina una tarea del usuario."""
    access_token = usuario["_access_token"]
    ok = tasks_service.eliminar_tarea(task_id, access_token)
    if not ok:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return
