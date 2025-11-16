# 🏗️ Arquitectura del Proyecto - Cómo Todo Encaja

## Flujo General: De Archivos a Pantalla

```
┌─────────────────────────────────────────────────────────────┐
│                     1. INDEX.HTML                            │
│        (Punto de entrada - HTML vacío)                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Carga el script
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  2. src/main.jsx                             │
│     (Punto de entrada de React)                             │
│     - Importa App.jsx                                        │
│     - Renderiza App en #root                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Renderiza
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  3. src/App.jsx                              │
│           (Componente Raíz)                                 │
│  - Maneja autenticación (session)                            │
│  - Decide qué mostrar                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   SIN SESIÓN        CON SESIÓN
   (mostrará)        (mostrará)
        │                 │
        ▼                 ▼
   4a. AuthForm.jsx    4b. TasksView.jsx
   (Login/Registro)    (Lista de tareas)
        │                 │
        └────────┬────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│             5. supabaseClient.js                             │
│    (Conexión con el backend)                                │
│  - Auth                                                      │
│  - Database                                                  │
│  - Storage                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Detalle de Cada Archivo

### 1. `index.html` - La Base

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Demo FastAPI + Supabase</title>
  </head>
  <body>
    <!-- Este div es donde React renderiza TODO -->
    <div id="root"></div>
    
    <!-- Este script inicia todo -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**¿Qué ocurre?**
1. Navegador carga `index.html`
2. Ve el `<script type="module" src="/src/main.jsx"></script>`
3. Carga y ejecuta `main.jsx`

### 2. `src/main.jsx` - Bootstrap de React

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Paso 1: Encuentra el div con id="root"
const rootElement = document.getElementById('root')

// Paso 2: Crea una "raíz" de React en ese div
const root = ReactDOM.createRoot(rootElement)

// Paso 3: Renderiza el componente App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**¿Qué es `React.StrictMode`?**
Modo que:
- Detecta renders innecesarios
- Advierte sobre APIs deprecadas
- Ayuda a encontrar bugs
- Solo en desarrollo

### 3. `src/App.jsx` - El Controlador

El componente más importante. Maneja la lógica principal.

```jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AuthForm from './components/AuthForm'
import TasksView from './components/TasksView'

function App() {
  // Estado 1: sesión del usuario
  const [session, setSession] = useState(null)
  // Estado 2: está cargando?
  const [loading, setLoading] = useState(true)

  // Efecto: al montar el componente
  useEffect(() => {
    // Paso 1: Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Paso 2: Escuchar cambios en auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)  // Actualiza cuando usuario hace login/logout
    })

    // Paso 3: Limpieza
    return () => subscription.unsubscribe()
  }, [])  // Se ejecuta solo una vez al montar

  // Mientras carga
  if (loading) {
    return <div>Cargando...</div>
  }

  // Si NO hay sesión → mostrar login
  if (!session) {
    return <AuthForm />
  }

  // Si HAY sesión → mostrar tareas
  return <TasksView session={session} />
}

export default App
```

**Lógica Principal:**
1. Al abrir la app, intenta obtener la sesión guardada
2. Escucha cambios en autenticación
3. Dependiendo de si hay sesión:
   - **Sin sesión** → Muestra `AuthForm`
   - **Con sesión** → Muestra `TasksView`

### 4. `src/components/AuthForm.jsx` - Login/Registro

```jsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AuthForm() {
  // Estados del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Manejar registro
  const handleSignUp = async (e) => {
    e.preventDefault()  // No recargar la página
    setLoading(true)
    setError(null)

    // Llamar a Supabase para registrar
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }
    // Si todo bien, App.jsx detecta el cambio y actualiza

    setLoading(false)
  }

  // Manejar login
  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signIn({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }

    setLoading(false)
  }

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Tu contraseña"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSignUp} disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
```

**Flujo:**
1. Usuario escribe email y contraseña
2. Hace click en "Registrarse" o "Iniciar sesión"
3. `handleSignUp` o `handleSignIn` se ejecuta
4. Se llama a `supabase.auth.signUp()` o `supabase.auth.signIn()`
5. Supabase valida y crea/autentica el usuario
6. `App.jsx` detecta cambio en sesión vía `onAuthStateChange`
7. App se re-renderiza y muestra `TasksView`

### 5. `src/components/TasksView.jsx` - Lista de Tareas

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function TasksView({ session }) {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevaTarea, setNuevaTarea] = useState('')

  // Cargar tareas cuando la sesión cambia
  useEffect(() => {
    cargarTareas()
  }, [session])

  const cargarTareas = async () => {
    try {
      setCargando(true)
      // Obtener tareas del usuario actual
      const { data, error } = await supabase
        .from('tareas')
        .select()
        .eq('user_id', session.user.id)

      if (error) throw error
      setTareas(data || [])
    } finally {
      setCargando(false)
    }
  }

  // Crear nueva tarea
  const agregarTarea = async () => {
    if (!nuevaTarea.trim()) return

    const { error } = await supabase
      .from('tareas')
      .insert([
        {
          titulo: nuevaTarea,
          user_id: session.user.id,
        },
      ])

    if (!error) {
      setNuevaTarea('')
      cargarTareas()  // Recargar lista
    }
  }

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    const { error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', id)

    if (!error) {
      cargarTareas()  // Recargar lista
    }
  }

  if (cargando) return <p>Cargando tareas...</p>

  return (
    <div>
      <h1>Mis Tareas</h1>
      <p>Usuario: {session.user?.email}</p>

      {/* Agregar nueva tarea */}
      <div>
        <input
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      {/* Lista de tareas */}
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            {tarea.titulo}
            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button onClick={() => supabase.auth.signOut()}>
        Cerrar sesión
      </button>
    </div>
  )
}
```

**Flujo:**
1. Componente se monta
2. `useEffect` llama a `cargarTareas()`
3. `cargarTareas()` obtiene tareas de la BD
4. Se muestran en una lista
5. Usuario puede:
   - Agregar tarea → actualiza BD → recarga lista
   - Eliminar tarea → actualiza BD → recarga lista
   - Cerrar sesión → `App.jsx` detecta cambio → muestra `AuthForm`

### 6. `src/supabaseClient.js` - Conexión

```javascript
import { createClient } from '@supabase/supabase-js'

// Obtener URLs del .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crear cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**¿Qué hace?**
1. Importa la función `createClient` de Supabase
2. Obtiene URL y clave del `.env`
3. Crea el cliente
4. Lo exporta para que otros componentes lo usen

**Uso en otros archivos:**
```javascript
import { supabase } from './supabaseClient'

// Ahora puedes usar supabase en toda la app
await supabase.auth.signUp({ email, password })
```

---

## Flujo de Autenticación - Paso a Paso

```
1. Usuario abre la app
   ↓
2. main.jsx renderiza App.jsx
   ↓
3. App.jsx se monta, useEffect se ejecuta
   ↓
4. Obtiene sesión guardada: supabase.auth.getSession()
   ↓
5. SI no hay sesión:
   - Muestra AuthForm
   - Usuario escribe email y contraseña
   - Click en "Registrarse"
   - handleSignUp llama a supabase.auth.signUp()
   ↓
6. Supabase valida y crea usuario
   ↓
7. supabase.auth.onAuthStateChange() detecta cambio
   ↓
8. setSession(nuevaSesion) actualiza estado en App.jsx
   ↓
9. App.jsx re-renderiza
   ↓
10. Ahora session != null, muestra TasksView
    ↓
11. TasksView obtiene tareas del usuario
    ↓
12. Usuario ve su lista de tareas
```

---

## Flujo de Datos - Cómo Fluyen los Datos

### De Arriba a Abajo (Props)

```
App.jsx (tiene session)
  ↓ pasa session como prop
TasksView.jsx (recibe { session })
  ↓ usa session.user.id para traer tareas
  ↓ muestra lista de tareas
```

### De Abajo a Arriba (Callbacks)

```
AuthForm.jsx (formulario)
  ↓ usuario hace click
  ↓ handleSignUp se ejecuta
  ↓ supabase.auth.signUp()
  ↓ Supabase manda evento de cambio
  ↓ supabase.auth.onAuthStateChange() en App.jsx
  ↓ setSession actualiza estado
  ↓ App.jsx se re-renderiza
  ↓ TasksView aparece en pantalla
```

---

## Estructura de Carpetas - Recomendación

```
proyecto/
├── src/
│   ├── main.jsx                  # Bootstrap
│   ├── App.jsx                   # Componente principal
│   ├── index.css                 # Estilos globales
│   ├── supabaseClient.js         # Inicialización de Supabase
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── AuthForm.jsx
│   │   ├── TasksView.jsx
│   │   ├── TareaCard.jsx        # Componentes nuevos aquí
│   │   └── Header.jsx
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.js
│   │   └── useTareas.js
│   │
│   ├── utils/                    # Funciones de utilidad
│   │   ├── api.js               # Llamadas a Supabase
│   │   └── helpers.js           # Funciones auxiliares
│   │
│   └── styles/                   # Estilos compartidos
│       └── theme.js             # Tema de colores
│
└── public/                       # Archivos estáticos
```

---

## Ciclo de Vida de la App

### Etapa 1: Carga Inicial

```
1. Usuario abre http://localhost:5173
2. Navegador descarga index.html
3. index.html carga main.jsx
4. main.jsx renderiza <App />
5. React crea el árbol de componentes
6. Pantalla se muestra con AuthForm
```

### Etapa 2: Usuario Interactúa

```
1. Usuario escribe email y contraseña
2. Hace click en "Registrarse"
3. handleSignUp se ejecuta
4. Se llama a Supabase
5. Supabase valida y crea usuario
6. onAuthStateChange se ejecuta
7. setSession actualiza estado
8. App se re-renderiza
9. TasksView aparece
```

### Etapa 3: Usuario Usa la App

```
1. Usuario escribe un título de tarea
2. Hace click en "Agregar"
3. Se llama a supabase.from('tareas').insert()
4. Tarea se guarda en BD
5. cargarTareas() se llama
6. Se obtienen tareas de BD
7. setTareas actualiza estado
8. TasksView se re-renderiza
9. Nueva tarea aparece en lista
```

### Etapa 4: Usuario Cierra Sesión

```
1. Hace click en "Cerrar sesión"
2. supabase.auth.signOut() se ejecuta
3. onAuthStateChange se ejecuta
4. setSession(null) actualiza estado
5. App se re-renderiza
6. AuthForm aparece de nuevo
```

---

## Diagrama de Estados

```
┌─────────────────────────┐
│     App.jsx Estados     │
├─────────────────────────┤
│ session: null           │ ← Usuario NO logueado
│ session: {user: {...}}  │ ← Usuario logueado
└─────────────────────────┘

┌──────────────────────────────────────┐
│     TasksView.jsx Estados            │
├──────────────────────────────────────┤
│ tareas: []                           │ ← Sin tareas
│ tareas: [{id:1, titulo:"..."}, ...] │ ← Con tareas
│ cargando: true                       │ ← Esperando BD
│ cargando: false                      │ ← Datos listos
└──────────────────────────────────────┘

┌────────────────────────────────────────┐
│    AuthForm.jsx Estados                │
├────────────────────────────────────────┤
│ loading: false                         │ ← Esperando entrada
│ loading: true                          │ ← Esperando respuesta
│ error: null                            │ ← Sin errores
│ error: "Email already exists"          │ ← Con error
└────────────────────────────────────────┘
```

---

## Resumen Visual Completo

```
┌────────────────────────────────────────────────────────┐
│                   NAVEGADOR                             │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ index.html - punto de entrada                  │   │
│  │ <div id="root"></div>                          │   │
│  │ <script src="/src/main.jsx"></script>          │   │
│  └────────┬─────────────────────────────────────┘   │
│           │                                         │
│           │ carga                                   │
│           ▼                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ main.jsx                                       │   │
│  │ ReactDOM.createRoot().render(<App />)          │   │
│  └────────┬─────────────────────────────────────┘   │
│           │                                         │
│           │ renderiza                               │
│           ▼                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ App.jsx - controlador principal                │   │
│  │ useEffect: obtiene sesión                      │   │
│  │ session = null ? AuthForm : TasksView          │   │
│  └────┬────────────────────────┬──────────────────┘   │
│       │                        │                       │
│       ▼                        ▼                       │
│  ┌─────────────────┐   ┌────────────────────────┐   │
│  │ AuthForm.jsx    │   │ TasksView.jsx          │   │
│  │ - Login         │   │ - Mostrar tareas       │   │
│  │ - Registro      │   │ - Agregar tarea        │   │
│  │ - Validación    │   │ - Eliminar tarea       │   │
│  └────────┬────────┘   └─────────┬──────────────┘   │
│           │                      │                    │
│           │ ambos usan           │                    │
│           └──────────┬───────────┘                    │
│                      ▼                                │
│           ┌────────────────────────┐                 │
│           │ supabaseClient.js       │                 │
│           │ createClient(url, key)  │                 │
│           │ - auth.signUp()         │                 │
│           │ - auth.signIn()         │                 │
│           │ - from('tareas').select()                │
│           └─────────┬──────────────┘                 │
│                     │ llamadas HTTP                  │
│                     ▼                                │
└────────────────────│────────────────────────────────┘
                     │
                     │ INTERNET
                     │
                     ▼
          ┌──────────────────────────┐
          │   SUPABASE (Backend)     │
          ├──────────────────────────┤
          │ - Autenticación          │
          │ - Base de datos          │
          │ - Storage                │
          │ - Realtime               │
          └──────────────────────────┘
```

¡Ahora entiendes cómo todo encaja! 🚀
