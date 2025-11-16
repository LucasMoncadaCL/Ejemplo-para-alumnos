# 📚 Guía Completa: React + Vite + Supabase para Principiantes

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [¿Qué es React?](#qué-es-react)
3. [¿Qué es Vite?](#qué-es-vite)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Package.json - El Corazón del Proyecto](#packagejson---el-corazón-del-proyecto)
6. [Configuración de Vite](#configuración-de-vite)
7. [Componentes React](#componentes-react)
8. [Hooks de React](#hooks-de-react)
9. [Variables de Entorno](#variables-de-entorno)
10. [Dependencias Instaladas](#dependencias-instaladas)
11. [Flujo de Datos](#flujo-de-datos)
12. [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
13. [Conceptos Clave](#conceptos-clave)

---

## Introducción

¡Bienvenido! Este proyecto es una **aplicación web moderna** que combina:
- **React 19**: Librería de JavaScript para construir interfaces de usuario (UIs)
- **Vite 7**: Herramienta de desarrollo ultra-rápida que transforma tu código JavaScript/JSX
- **Supabase**: Backend como servicio que proporciona autenticación y base de datos
- **Material-UI (MUI)**: Librería de componentes visuales listos para usar

Es un proyecto **real** que incluye:
- ✅ Sistema de autenticación (login/registro)
- ✅ Gestión de tareas conectada a una base de datos
- ✅ UI moderna con animaciones
- ✅ Integración con backend FastAPI

---

## ¿Qué es React?

### Concepto Fundamental
React es una **librería JavaScript** (no es un framework completo) creada por Facebook que te permite:
- Crear interfaces de usuario dinámicas
- Actualizar la pantalla automáticamente cuando los datos cambian
- Reutilizar componentes

### Analogía: Piezas de LEGO
Imagina que React es un sistema de LEGO:
- Cada **bloque LEGO** es un **componente**
- Puedes **combinar bloques** para crear estructuras más complejas
- Cuando cambias un bloque, toda la estructura se actualiza automáticamente

### Ejemplo: Un Componente Simple
```jsx
function Saludo() {
  return <h1>¡Hola, mundo!</h1>
}
```

Este es un componente que renderiza un título. Sí, ¡así de simple!

### JSX: La Magia de React
JSX es una **sintaxis especial** que parece HTML pero es JavaScript:

```jsx
// Esto es JSX
const elemento = <h1>Hola {nombre}</h1>

// Detrás de cámaras, se convierte en:
const elemento = React.createElement('h1', null, `Hola ${nombre}`)
```

Vite y Babel se encargan de convertir JSX a JavaScript normal.

### Virtual DOM (DOM Virtual)
React no actualiza el HTML directamente (que es lento). En su lugar:
1. Mantiene una **copia virtual** del DOM en memoria
2. Compara cambios (diffing)
3. Actualiza **solo lo que cambió**

Esto lo hace **muchísimo más rápido** que manipular el DOM directamente.

---

## ¿Qué es Vite?

### Definición
Vite es una **herramienta de construcción** (build tool) que:
- Sirve tu código en desarrollo de forma **ultra-rápida**
- Transforma JSX a JavaScript
- Empaqueta todo para producción
- Ofrece recarga en caliente (HMR - Hot Module Replacement)

### ¿Por qué Vite y no Create-React-App?

| Aspecto | Vite | Create-React-App |
|--------|------|------------------|
| Velocidad de inicio | ⚡ Súper rápido (~100ms) | 🐢 Lento (~3-5s) |
| Recarga en caliente | Instantánea | Lenta |
| Configuración | Simple y explícita | Oculta (ejectada) |
| Tamaño final | Más pequeño | Más grande |
| **Estado** | 🚀 Moderno (2024) | 😴 Deprecated |

### Cómo Funciona Vite

```
┌─────────────────────────────────────────┐
│  Archivos JSX/TypeScript                │
│  (Tu código)                            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Vite Dev Server                        │
│  - Convierte JSX a JS                   │
│  - Maneja módulos                       │
│  - Hot Module Replacement (HMR)         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  http://localhost:5173                  │
│  (Tu aplicación en el navegador)        │
└─────────────────────────────────────────┘
```

---

## Estructura del Proyecto

```
ejemplo-alumnos/
├── .env                      # Variables de entorno (secretos y URLs)
├── .gitignore               # Archivos a ignorar en Git
├── package.json             # Dependencias y scripts
├── vite.config.js           # Configuración de Vite
├── index.html               # HTML principal (punto de entrada)
├── eslint.config.js         # Configuración de linter (detecta errores)
├── public/                  # Archivos estáticos (imágenes, iconos, etc.)
└── src/                     # 🔥 AQUÍ VA TODO TU CÓDIGO
    ├── main.jsx             # Punto de entrada de React
    ├── App.jsx              # Componente raíz (nivel más alto)
    ├── App.css              # Estilos CSS del componente App
    ├── index.css            # Estilos globales
    ├── supabaseClient.js     # Configuración de Supabase
    ├── assets/              # Recursos (imágenes, videos, etc.)
    └── components/          # 🧩 Componentes reutilizables
        ├── AuthForm.jsx     # Formulario de login/registro
        └── TasksView.jsx    # Vista de tareas
```

### Explicación de Archivos Clave

#### `index.html`
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Demo FastAPI + Supabase</title>
  </head>
  <body>
    <div id="root"></div>  <!-- React va a renderizar aquí -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Encuentra el elemento con id="root" en index.html
// y renderiza el componente App dentro de él
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Package.json - El Corazón del Proyecto

El `package.json` es como la **ficha técnica** de tu proyecto. Define:
- Qué **librerías** usa (dependencias)
- Qué **comandos** puedes ejecutar
- Metadata del proyecto

### Ejemplo Anotado

```json
{
  // Información básica
  "name": "ejemplo-alumnos",           // Nombre del proyecto
  "private": true,                      // No es un paquete público
  "version": "0.0.0",                   // Versión actual
  "type": "module",                     // Usa módulos ES6 (import/export)

  // 🔧 Comandos que puedes ejecutar
  "scripts": {
    "dev": "vite",                      // npm run dev → inicia servidor
    "build": "vite build",              // npm run build → empaqueta para producción
    "lint": "eslint .",                 // npm run lint → revisa errores
    "preview": "vite preview"           // npm run preview → previsualiza build
  },

  // 📦 Librerías necesarias en PRODUCCIÓN
  "dependencies": {
    "react": "^19.2.0",                 // Librería de UI
    "react-dom": "^19.2.0",             // Renderiza React en el navegador
    "@supabase/supabase-js": "^2.81.1", // Cliente de Supabase
    "@mui/material": "^7.3.5",          // Componentes UI listos
    "@emotion/react": "^11.14.0",       // Sistema de estilos (requerido por MUI)
    "@emotion/styled": "^11.14.1"       // Más estilos (requerido por MUI)
  },

  // 🛠️ Librerías necesarias SOLO en desarrollo
  "devDependencies": {
    "vite": "^7.2.2",                   // Build tool
    "@vitejs/plugin-react": "^5.1.0",   // Plugin React para Vite
    "eslint": "^9.39.1",                // Linter (revisa código)
    "@types/react": "^19.2.2",          // Tipos de React (para TypeScript)
    // ... más herramientas de desarrollo
  }
}
```

### Sobre las Versiones (^, ~, *)

```
"react": "^19.2.0"
         └─ Este símbolo es importante

^ (caret)   → Permite cambios menores y parches (19.2.0 a 19.9.9)
~ (tilde)   → Solo permite parches (19.2.0 a 19.2.9)
* (asterisk)→ Cualquier versión (¡peligroso!)
ninguno     → Exactamente esa versión (más seguro)

Ejemplo:
"react": "19.2.0"     (exactamente 19.2.0)
"react": "~19.2.0"    (19.2.x)
"react": "^19.2.0"    (19.x.x)
```

---

## Configuración de Vite

El archivo `vite.config.js` define cómo Vite procesa tu código:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],  // Plugin que entiende JSX
  // Más configuraciones opcionales...
})
```

### ¿Qué Hace el Plugin React?
1. **Transforma JSX a JavaScript**
   - Entrada: `<h1>Hola</h1>`
   - Salida: `React.createElement('h1', null, 'Hola')`

2. **Hot Module Replacement**
   - Cuando cambias un componente, Vite lo actualiza sin recargar la página

3. **Fast Refresh**
   - Conserva el estado del componente aunque hagas cambios

---

## Componentes React

Un componente es una **función JavaScript** que retorna JSX. Piénsalo como un "bloque de construcción" reutilizable.

### Tipos de Componentes

#### 1. Componentes Funcionales (Modernos)
```jsx
function Saludo() {
  return <h1>¡Hola!</h1>
}

// O con arrow function:
const Saludo = () => {
  return <h1>¡Hola!</h1>
}
```

#### 2. Componentes con Props (Parámetros)
```jsx
// Definición
function Tarjeta({ titulo, descripcion }) {
  return (
    <div>
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </div>
  )
}

// Uso
<Tarjeta 
  titulo="React" 
  descripcion="Librería para UIs"
/>
```

### Props: Pasar Datos a Componentes

```jsx
// Componente padre
function App() {
  const usuario = { nombre: 'Juan', edad: 25 }
  
  return <Perfil usuario={usuario} />
}

// Componente hijo
function Perfil({ usuario }) {
  return (
    <div>
      <h1>{usuario.nombre}</h1>
      <p>Edad: {usuario.edad}</p>
    </div>
  )
}
```

**Importante**: Los props son **de solo lectura** (read-only). No puedes modificarlos directamente. Para eso existen los **estados**.

### Composición: Combinar Componentes

```jsx
function App() {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  )
}

function Header() {
  return <h1>Mi Aplicación</h1>
}

function MainContent() {
  return <p>Contenido principal aquí</p>
}

function Footer() {
  return <footer>© 2024</footer>
}
```

---

## Hooks de React

Los **Hooks** son funciones especiales que te permiten:
- Usar estado en componentes funcionales
- Ejecutar efectos secundarios
- Acceder a contexto

### 1. useState - Agregar Estado

El **estado** es datos que pueden cambiar. Cuando el estado cambia, React re-renderiza el componente.

```jsx
import { useState } from 'react'

function Contador() {
  // useState retorna [valorActual, función_para_cambiar]
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  )
}
```

**¿Cómo funciona?**
1. `count = 0` → valor inicial
2. `setCount(1)` → actualiza el estado
3. React detecta el cambio
4. React re-renderiza el componente
5. La pantalla muestra el nuevo valor

### 2. useEffect - Efectos Secundarios

`useEffect` ejecuta código **después** de que el componente se renderiza.

```jsx
import { useEffect, useState } from 'react'

function DatosUsuario() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  
  useEffect(() => {
    // Este código se ejecuta DESPUÉS de renderizar
    console.log('Componente montado, fetching datos...')
    
    // Simular una llamada a API
    setTimeout(() => {
      setDatos({ nombre: 'Juan' })
      setCargando(false)
    }, 1000)
  }, []) // Array vacío = ejecutar solo una vez (al montar)
  
  if (cargando) return <p>Cargando...</p>
  return <h1>Hola, {datos.nombre}</h1>
}
```

**Array de Dependencias:**
```jsx
useEffect(() => { /* code */ }, []) 
// ^ Se ejecuta 1 vez (al montar)

useEffect(() => { /* code */ }, [userId])
// ^ Se ejecuta cuando userId cambia

useEffect(() => { /* code */ })
// ^ Se ejecuta después de CADA renderizado (¡puede ser peligroso!)
```

### 3. useEffect - Limpieza

Cuando un componente se **desmonta** (desaparece), puedes limpiar recursos:

```jsx
useEffect(() => {
  const subscription = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state cambió:', session)
  })
  
  // Función de limpieza (cleanup)
  return () => {
    console.log('Desuscribiendo...')
    subscription.unsubscribe()
  }
}, [])
```

### 4. Aplicación Real: AuthForm

En tu proyecto `AuthForm.jsx` usa estos hooks:

```jsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }
  
  return (
    <form onSubmit={handleSignUp}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        type="password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  )
}
```

---

## Variables de Entorno

Las variables de entorno son valores que cambian según el entorno (desarrollo, producción).

### ¿Por qué las necesitamos?

```javascript
// ❌ NUNCA hardcodear secretos
const API_KEY = "sk-1234567890"  // ¡Expuesto en GitHub!

// ✅ Usar variables de entorno
const API_KEY = import.meta.env.VITE_SUPABASE_KEY  // Seguro
```

### Archivo `.env`

```dotenv
# URLs del Backend
VITE_BACKEND_URL=http://localhost:8000

# Configuración de Supabase
VITE_SUPABASE_URL=https://uwpzbfgemdhpvvvdtafm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Cómo Acceder

```jsx
// ✅ En desarrollo
const url = import.meta.env.VITE_BACKEND_URL
// → "http://localhost:8000"

// ✅ En producción (diferentes valores en .env.production)
// Vite cambia automáticamente los valores
```

### Importante: Prefijo `VITE_`

- ✅ `VITE_SUPABASE_URL` → Expuesto al navegador (público)
- ❌ `SUPABASE_SECRET` → NO expuesto (solo backend)

En Vite, **solo las variables que empiezan con `VITE_` son accesibles** en el navegador.

---

## Dependencias Instaladas

### Dependencias de Producción

#### 1. **React** (`react` + `react-dom`)
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'

// React = lógica de componentes
// ReactDOM = renderizar en el navegador
```
- Crea componentes y maneja el estado
- `react-dom` los renderiza en HTML

#### 2. **Supabase** (`@supabase/supabase-js`)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)
// Proporciona: autenticación, base de datos, storage
```
- Cliente para conectarse a Supabase
- Maneja autenticación y operaciones CRUD
- APIs asincrónicas

#### 3. **Material-UI** (`@mui/material`, `@mui/icons-material`)
```jsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Componentes visuales listos para usar
<Button variant="contained">Click me</Button>
```
- Librería de componentes hermosos
- Sigue el diseño "Material Design" de Google
- Incluye: botones, campos, diálogos, etc.

#### 4. **Emotion** (`@emotion/react`, `@emotion/styled`)
```javascript
import styled from '@emotion/styled'

const StyledButton = styled.button`
  background-color: blue;
  color: white;
`
```
- Sistema de CSS-in-JS
- Requerido por Material-UI
- Permite escribir CSS con JavaScript

### Dependencias de Desarrollo

#### 1. **Vite** (`vite`)
- Build tool principal
- Sirve código en desarrollo
- Empaqueta para producción

#### 2. **@vitejs/plugin-react**
- Plugin para que Vite entienda JSX
- Habilita Fast Refresh

#### 3. **ESLint**
```bash
npm run lint  # Revisa errores en el código
```
- Linter que detecta problemas
- Impone estilo de código consistente
- Plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

#### 4. **TypeScript Types** (`@types/react`, `@types/react-dom`)
- Definiciones de tipos para autocomplete
- Opcional pero muy recomendado

---

## Flujo de Datos

### Flujo General en la App

```
┌─────────────────────────────────────────────────────────┐
│                     App.jsx (Principal)                 │
│  - Maneja sesión del usuario                            │
│  - Decide qué mostrar (login o tareas)                  │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   SIN SESIÓN        CON SESIÓN
   (mostrar)         (mostrar)
        │                 │
        ▼                 ▼
   AuthForm.jsx      TasksView.jsx
   - Input email     - Lista de tareas
   - Input password  - Crear tarea
   - Submit          - Actualizar tarea
        │                 │
        └────────┬────────┘
                 │
                 ▼
          supabaseClient.js
          - API calls
          - Auth
          - Database
```

### Ejemplo: Flujo de Autenticación

```
1. Usuario escribe email y contraseña
   ↓
2. Click en "Registrarse"
   ↓
3. AuthForm.jsx llama supabase.auth.signUp()
   ↓
4. Supabase valida y crea usuario
   ↓
5. App.jsx detecta cambio en sesión (useEffect)
   ↓
6. setSession(nuevaSesion) actualiza estado
   ↓
7. React re-renderiza App.jsx
   ↓
8. Ahora muestra TasksView en lugar de AuthForm
```

---

## Cómo Ejecutar el Proyecto

### 1. **Instalación Inicial**
```bash
# Navega a la carpeta del proyecto
cd ejemplo-alumnos

# Instala todas las dependencias
npm install
# Esto crea una carpeta node_modules/ con todas las librerías
```

### 2. **Iniciar Servidor de Desarrollo**
```bash
npm run dev
# Output:
#   VITE v7.2.2  ready in 145 ms
#   ➜  Local:   http://localhost:5173/
#   ➜  press h for help
```

Abre `http://localhost:5173/` en tu navegador.

### 3. **Características en Desarrollo**
- ✅ **Hot Module Replacement (HMR)**: Cambios instantáneos
- ✅ **Recarga automática**: Cada vez que guardas un archivo
- ✅ **Error overlay**: Errores mostrados en la pantalla

### 4. **Linting (Revisar Errores)**
```bash
npm run lint
# Muestra problemas en el código
```

### 5. **Build para Producción**
```bash
npm run build
# Crea carpeta dist/ con archivos optimizados
```

### 6. **Previsualizar Build**
```bash
npm run preview
# Simula cómo se ve en producción
```

---

## Conceptos Clave

### 1. **SPA (Single Page Application)**
Una SPA es una aplicación que:
- Carga una sola página HTML (`index.html`)
- JavaScript cambia el contenido sin recargar
- Más rápido y fluido que aplicaciones tradicionales

```
Aplicación Tradicional:
usuario hace click → navegador pide HTML al servidor → servidor envía HTML → página recarga

SPA (React):
usuario hace click → JavaScript actualiza el contenido → navegador actualiza pantalla (sin recargar)
```

### 2. **Rendering**
Renderizar = convertir componentes React a HTML que el navegador entienda.

```jsx
// Componente (JSX)
<h1>Hola</h1>

// ↓ React lo renderiza a ↓

// HTML
<h1>Hola</h1>

// ↓ Navegador lo dibuja ↓

// En pantalla
┌─────────┐
│ Hola    │
└─────────┘
```

### 3. **Re-rendering**
Cuando el estado o props cambian, React renderiza de nuevo.

```jsx
const [count, setCount] = useState(0)

// Primer render: count = 0
// Usuario hace click
// setCount(1)
// Re-render: count = 1
```

### 4. **Ciclo de Vida de un Componente**

```
1. MONTAR
   └─ Componente se crea
   └─ useEffect con [] se ejecuta

2. ACTUALIZAR
   └─ Props o estado cambian
   └─ useEffect con dependencias se ejecuta

3. DESMONTAR
   └─ Componente se elimina
   └─ Función de limpieza de useEffect se ejecuta
```

### 5. **Asincronía en React**

```jsx
// ❌ MAL
const datos = supabase.from('tareas').select() // Promesa
// No esperas a que se complete

// ✅ BIEN
useEffect(async () => {
  const { data } = await supabase.from('tareas').select()
  setDatos(data)
}, [])
// Esperas con async/await
```

### 6. **Eventos en React**

```jsx
// HTML normal
<button onclick="miFuncion()">Click</button>

// React (camelCase y función)
<button onClick={() => miFuncion()}>Click</button>

// Con parámetros
<button onClick={(e) => miFuncion(e)}>Click</button>

// Eventos comunes:
// onClick, onChange, onSubmit, onFocus, onBlur, onMouseEnter, etc.
```

### 7. **Condicionales en JSX**

```jsx
// Operador ternario
{usuario ? <h1>Hola {usuario}</h1> : <p>Inicia sesión</p>}

// Operador &&
{usuario && <h1>Hola {usuario}</h1>}

// if/else (no directamente en JSX, usa una función)
function mostrarContenido() {
  if (usuario) return <h1>Hola</h1>
  return <p>Inicia sesión</p>
}
return mostrarContenido()
```

### 8. **Listas y Keys**

```jsx
const tareas = [
  { id: 1, titulo: 'Tarea 1' },
  { id: 2, titulo: 'Tarea 2' }
]

// ✅ BIEN: con key única
{tareas.map(tarea => (
  <div key={tarea.id}>{tarea.titulo}</div>
))}

// ❌ MAL: sin key (causa bugs)
{tareas.map((tarea, index) => (
  <div key={index}>{tarea.titulo}</div>
))}
```

---

## Flujo Típico: De la Idea al Código

### 1. Diseña el Componente
```
┌─────────────────────────┐
│   Mi Componente         │
│  ┌─────────────────┐    │
│  │ Estado: count   │    │
│  │ Props: inicial  │    │
│  └─────────────────┘    │
│  ┌─────────────────┐    │
│  │ Botones         │    │
│  │ Texto           │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

### 2. Crea el Componente
```jsx
function MiComponente({ inicial }) {
  const [count, setCount] = useState(inicial)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

### 3. Úsalo en Otro Componente
```jsx
function App() {
  return <MiComponente inicial={0} />
}
```

### 4. Si Necesitas Datos del Backend
```jsx
useEffect(() => {
  const cargarDatos = async () => {
    const { data } = await supabase.from('tareas').select()
    setTareas(data)
  }
  cargarDatos()
}, [])
```

---

## Debugging en React

### 1. React Developer Tools (Extensión)
Instala "React Developer Tools" en Chrome/Firefox para inspeccionar componentes.

### 2. console.log()
```jsx
useEffect(() => {
  console.log('Componente montado')
  console.log('Session:', session)
  return () => console.log('Componente desmontado')
}, [])
```

### 3. Errores Comunes
```jsx
// ❌ No actualizar estado directamente
state.propiedad = "nuevo valor"

// ✅ Usar setState
setState({ ...state, propiedad: "nuevo valor" })

// ❌ Missing dependency en useEffect
useEffect(() => {
  console.log(userId) // userId no está en dependencias
}, []) // Bug!

// ✅ Incluir en dependencias
useEffect(() => {
  console.log(userId)
}, [userId])
```

---

## Recursos para Profundizar

- 📖 [React Oficial](https://react.dev)
- 📖 [Vite Oficial](https://vitejs.dev)
- 📖 [Material-UI](https://mui.com)
- 📖 [Supabase](https://supabase.com/docs)
- 🎥 [React Hooks Explicado](https://react.dev/reference/react)

---

## Próximos Pasos

1. **Modifica AuthForm.jsx** - Añade validación
2. **Crea un nuevo componente** - TareaCard.jsx
3. **Experimenta con estilos** - Usa sx de MUI
4. **Conecta APIs** - Llama al backend FastAPI
5. **Aprende TypeScript** - Mejora el código

---

## Conclusión

React + Vite es una **combinación moderna y poderosa** para crear UIs. Los conceptos clave son:

- **Componentes**: Bloques reutilizables
- **JSX**: HTML en JavaScript
- **Hooks**: Estado y efectos
- **Props**: Pasar datos
- **State**: Datos que cambian
- **Vite**: Herramienta rápida

¡A partir de aquí, la única limitación es tu imaginación!

---

## Cheat Sheet

```jsx
// Importar React
import { useState, useEffect } from 'react'

// Crear componente
function MiComponente({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue)
  
  useEffect(() => {
    // Código que se ejecuta al montar
    return () => {
      // Limpieza al desmontar
    }
  }, [dependencies])
  
  return (
    <div>
      <p>{state}</p>
      <p>{prop1}</p>
    </div>
  )
}

export default MiComponente
```

¡Éxito en tu aprendizaje! 🚀
