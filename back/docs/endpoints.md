# Documentación de Endpoints y Validaciones

En este archivo se describe cada endpoint del backend, los parámetros que acepta,
las validaciones aplicadas y ejemplos de petición y respuesta.

---

## 1) GET /

- Descripción: endpoint de salud / ping.
- Parámetros: ninguno.
- Respuesta: JSON con `message`, `version` y `docs`.

Ejemplo de respuesta:
```json
{
  "message": "Backend activo",
  "version": "1.0",
  "docs": "/docs"
}
```

---

## 2) GET /api/tasks

- Descripción: lista las tareas del usuario autenticado.
- Seguridad: requiere header `Authorization: Bearer <token>` y la dependencia
  `verify_supabase_token` para validar JWT.
- Parámetros: ninguno en el body; tokens en header.
- Respuesta: lista de `TaskOut`

Modelo de `TaskOut` (resumido):
```json
{
  "id": 1,
  "titulo": "Comprar leche",
  "descripcion": "Ir al supermercado",
  "completada": false,
  "created_at": "2024-01-01T12:00:00",
  "updated_at": "2024-01-01T12:00:00"
}
```

Notas de validación:
- FastAPI valida que la respuesta tenga los campos definidos en `TaskOut`.
- Si `verify_supabase_token` falla (token inválido o ausente), retorna 401.

---

## 3) POST /api/tasks

- Descripción: crear una nueva tarea para el usuario autenticado.
- Seguridad: requiere `Authorization: Bearer <token>`.
- Body (JSON): debe coincidir con `TaskCreate`.

Ejemplo de body:
```json
{
  "titulo": "Estudiar FastAPI",
  "descripcion": "Leer el README y probar las rutas",
  "completada": false
}
```

Validaciones y notas:
- `titulo` es obligatorio (tipo `str`).
- `descripcion` y `completada` son opcionales con valores por defecto.
- Se devuelve `TaskOut` con `id` asignado por la DB.
- Código: retorna 201 Created al insertar correctamente.

---

## 4) GET /api/tasks/{task_id}

- Descripción: obtiene una tarea por su ID (si pertenece al usuario autenticado).
- Seguridad: `Authorization: Bearer <token>`.
- Parámetros: `task_id` en la ruta (int).
- Respuesta: `TaskOut` si existe; 404 si no existe.

---

## 5) PUT /api/tasks/{task_id}

- Descripción: actualiza una tarea completa.
- Seguridad: `Authorization: Bearer <token>`.
- Body: `TaskUpdate` (todos los campos opcionales).

Ejemplo de body:
```json
{
  "titulo": "Estudiar FastAPI (actualizado)",
  "completada": true
}
```

Validaciones y detalles:
- `TaskUpdate` permite `titulo`, `descripcion`, y `completada` como opcionales.
- `update_data = data.model_dump(exclude_unset=True)` asegura que solo se
  actualicen los campos enviados en el body.
- Si `update_data` está vacío (no enviaste campos), la función retorna la tarea actual.
- Si la tarea no existe o no pertenece al usuario, se retorna 404.

---

## 6) DELETE /api/tasks/{task_id}

- Descripción: elimina una tarea por su ID (usuario debe ser propietario).
- Seguridad: `Authorization: Bearer <token>`.
- Respuesta: 204 No Content si se eliminó, 404 si no existe.

---

## Notas generales sobre validaciones

- Validación de entrada: Pydantic valida tipos y formatos en los modelos.
- Validación de salida: `response_model` garantiza que la respuesta cumpla el schema.
- Manejo de errores: `HTTPException` en las rutas para códigos 401/404.

---

## Ejemplo de pruebas con curl

Listar tareas (ejemplo):

```bash
curl -H "Authorization: Bearer <TOKEN>" http://127.0.0.1:8000/api/tasks
```

Crear tarea:

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"titulo": "Probar API"}' http://127.0.0.1:8000/api/tasks
```