# Ejemplo para Alumnos — Proyecto de Introducción a React + Vite y FastAPI

Este repositorio es un proyecto de ejemplo pensado para estudiantes que están aprendiendo a construir aplicaciones completas (frontend + backend) con React (Vite) y FastAPI. Está preparado como base para prácticas, hackathons y ejercicios en clase.

## Objetivos
- Entender la estructura básica de un proyecto full-stack moderno.
- Levantar y probar un backend con FastAPI (Python).
- Levantar y probar un frontend con React + Vite.
- Integrar autenticación y datos a través de Supabase (cliente JavaScript).
- Aprender buenas prácticas: uso de `.env`, `.gitignore` y flujo básico de Git.

---

## Estructura del repositorio

- `back/` — Backend en Python y FastAPI. Contiene `main.py`, configuración y servicios.
- `ejemplo-alumnos/` — Frontend con Vite + React. Contiene `src/`, `package.json`, configuración y componentes.
- `docs/` — Documentación pedagógica y ejemplos adicionales.
- `.gitignore` — Reglas para evitar subir archivos temporales y secretos.

---

## Requisitos previos

- Git instalado y configurado (`git config --global user.name` y `user.email`).
- Python 3.10+ (o 3.11) para el backend.
- Node.js 18+ y npm o Yarn para el frontend.
- (Opcional) Cuenta de Supabase y un proyecto creado para usar las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

---

## Ejecutar el backend (FastAPI)

1. Abrir una terminal y situarse en la carpeta `back/`:

```powershell
cd "C:\Users\lucas\Documents\Ejemplo para alumnos\back"
```

2. Crear y activar un entorno virtual (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
# Si usas cmd.exe: .\.venv\Scripts\activate.bat
```

3. Instalar dependencias:

```powershell
pip install -r requirements.txt
```

4. Configurar variables de entorno (no subir `.env` al repositorio).
   Crea un archivo `.env` en `back/` con al menos:

```text
# .env (ejemplo)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=alguna_clave_secreta
# Otros valores que el backend use
```

5. Levantar la API en modo desarrollo:

```powershell
uvicorn main:app --reload --port 8000
# o si el entrypoint es distinto: uvicorn back.main:app --reload --port 8000
```

6. Documentación automática de la API (Swagger/OpenAPI):

Visita `http://127.0.0.1:8000/docs` para la interfaz Swagger.

---

## Ejecutar el frontend (React + Vite)

1. Abrir una terminal y situarse en la carpeta del frontend:

```powershell
cd "C:\Users\lucas\Documents\Ejemplo para alumnos\ejemplo-alumnos"
```

2. Instalar dependencias:

```powershell
npm install
# o con yarn: yarn
```

3. Crear un archivo `.env.local` (o `.env`) con las variables que usa la app React. Ejemplo:

```text
# .env.local (ejemplo)
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_BACKEND_URL=http://127.0.0.1:8000
```

4. Levantar la aplicación en modo desarrollo:

```powershell
npm run dev
# luego abrir: http://localhost:5173 (u otra URL que muestre Vite)
```

5. Para producción:

```powershell
npm run build
npm run preview
```

---

## Integración con Supabase

Este proyecto usa `@supabase/supabase-js` en el frontend. Asegúrate de tener las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en tu `.env` del frontend antes de ejecutar la app. No las subas al repositorio.

Si quieres practicar autenticación y almacenamiento de datos:

- Crea un proyecto en Supabase.
- Crea una tabla `tasks` (o usa la que provee el proyecto si existe).
- Copia las claves en el `.env.local` del frontend.

---

## Flujo de desarrollo recomendado

- Trabaja en ramas por feature: `git checkout -b feat/nombre-feature`.
- Haz commits pequeños y descriptivos.
- Antes de push, asegúrate de que `.gitignore` incluye todas las reglas para no subir `.env` ni dependencias.

Comandos útiles (desde la raíz del repo):

```powershell
cd "C:\Users\lucas\Documents\Ejemplo para alumnos"
git status
git add .
git commit -m "Mensaje descriptivo"
git push origin main
```

---

## Ejercicios y retos propuestos

1. Añadir un endpoint REST en el backend para filtrar tareas por usuario.
2. Implementar manejo de errores en el backend y respuestas consistentes (códigos HTTP y mensajes).
3. Extender la UI para permitir editar y eliminar tareas con confirmación modal.
4. Agregar tests básicos: unitarios en Python (pytest) y pruebas de integración en el frontend (Testing Library).
5. Crear una página de administración donde se muestren métricas simples (número de tareas, usuarios activos).

Cada ejercicio puede tener su propia rama y un `PR` (Pull Request) para revisión.

---

## Seguridad y `.gitignore`

Hay un `.gitignore` en la raíz que ya incluye reglas para Node, Python y variables de entorno. Recomendaciones:

- Nunca subir `.env` con credenciales reales.
- Usa variables de entorno de ejemplo (`.env.example`) con placeholders si quieres mostrar qué variables se necesitan.
- Revise `git status` antes de commitear.

Ejemplo de `.env.example` (colocar en la raíz o en cada subproyecto si se desea):

```text
# .env.example
VITE_SUPABASE_URL=REPLACE_ME
VITE_SUPABASE_ANON_KEY=REPLACE_ME
VITE_BACKEND_URL=http://127.0.0.1:8000
DATABASE_URL=postgresql://user:password@host:port/db
```

---

## Recursos de aprendizaje

- Documentación FastAPI: https://fastapi.tiangolo.com
- Documentación Vite: https://vitejs.dev
- React: https://react.dev
- Supabase: https://supabase.com/docs

---

## ¿Necesitas ayuda?

Si algo no funciona, contacta a Lucas Moncada

---

## Licencia y créditos

Lucas Moncada sub-lider track FullStack
