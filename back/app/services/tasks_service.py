from typing import List, Optional

from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskOut
from app.core.database import get_supabase

TABLE_NAME = "tasks"

"""
Servicio de tareas: contiene la lógica de negocio y abstrae el acceso a la DB.

Por qué tener servicios separados:
- Mantiene las rutas limpias (las rutas sólo reciben peticiones y retornan respuestas).
- Facilita testing (puedes probar `tasks_service` sin levantar el servidor).

En este ejemplo se usa `supabase-py` para operar sobre la tabla `tasks`.
Observa cómo retornamos `TaskOut` para que la capa superior (rutas) envíe
respuesta validada:
    - `TaskOut(**row)` transforma la dict recibida de Supabase en un modelo Pydantic.
"""

def listar_tareas(access_token: str) -> List[TaskOut]:
    supabase = get_supabase(access_token)
    # Hacemos una consulta a Supabase: seleccionamos todas las filas ordenadas
    # por `created_at`. `execute()` realiza la petición y devuelve un resultado
    # con `data` y `status_code`.
    res = supabase.table(TABLE_NAME).select("*").order("created_at", desc=False).execute()
    data = res.data or []
    return [TaskOut(**row) for row in data]

def crear_tarea(data: TaskCreate, access_token: str) -> TaskOut:
    supabase = get_supabase(access_token)
    insert_data = data.model_dump()
    # user_id se completa solo con auth.uid() en PostgreSQL (default)
    # `insert()` retorna la fila insertada (o filas) dentro de `res.data`.
    res = supabase.table(TABLE_NAME).insert(insert_data).execute()
    row = res.data[0]
    return TaskOut(**row)

def obtener_tarea(task_id: int, access_token: str) -> Optional[TaskOut]:
    supabase = get_supabase(access_token)
    res = (
        supabase
        .table(TABLE_NAME)
        .select("*")
        .eq("id", task_id)
        .single()
        .execute()
    )
    # `single()` asume que la query devolverá una sola fila — si no la encuentra
    # retorna `None` en `res.data`.
    row = res.data
    if not row:
        return None
    return TaskOut(**row)

def actualizar_tarea(task_id: int, data: TaskUpdate, access_token: str) -> Optional[TaskOut]:
    supabase = get_supabase(access_token)
    update_data = data.model_dump(exclude_unset=True)

    # Si no hay campos para actualizar, devolvemos el registro actual.
    if not update_data:
        # nada que actualizar
        return obtener_tarea(task_id, access_token)

    res = (
        supabase
        .table(TABLE_NAME)
        .update(update_data)
        .eq("id", task_id)
        .execute()
    )

    if not res.data:
        return None

    return TaskOut(**res.data[0])

def eliminar_tarea(task_id: int, access_token: str) -> bool:
    supabase = get_supabase(access_token)
    res = supabase.table(TABLE_NAME).delete().eq("id", task_id).execute()
    return bool(res.data)
