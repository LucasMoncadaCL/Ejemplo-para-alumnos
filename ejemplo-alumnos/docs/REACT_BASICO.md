# 🎓 React Básico - Guía Detallada

## ¿Qué es React en 30 Segundos?

React es una **librería de JavaScript** que te ayuda a construir interfaces de usuario (UIs) de forma rápida y eficiente.

### El Problema que Resuelve React

Imagina un contador en una página web:

```html
<!-- HTML tradicional -->
<button id="btn">Contador: 0</button>
<script>
  let contador = 0;
  document.getElementById('btn').addEventListener('click', () => {
    contador++;
    document.getElementById('btn').innerText = 'Contador: ' + contador;
  });
</script>
```

Es tedioso, fácil de equivocarse, y el código crece muy rápido.

### La Solución de React

```jsx
function Contador() {
  const [contador, setContador] = useState(0)
  
  return (
    <button onClick={() => setContador(contador + 1)}>
      Contador: {contador}
    </button>
  )
}
```

Mucho más simple y legible. React maneja la actualización automáticamente.

---

## Conceptos Fundamentales

### 1. Componentes

Un **componente** es una función que retorna JSX (HTML en JavaScript).

```jsx
// Componente simple
function Saludo() {
  return <h1>¡Hola, mundo!</h1>
}

// Componente con lógica
function Calculadora() {
  const resultado = 2 + 2
  return <p>2 + 2 = {resultado}</p>
}

// Componente con HTML complejo
function Tarjeta() {
  return (
    <div style={{ border: '1px solid black', padding: '10px' }}>
      <h2>Mi Tarjeta</h2>
      <p>Contenido aquí</p>
      <button>Hacer click</button>
    </div>
  )
}
```

### 2. JSX - Escribir HTML en JavaScript

JSX permite escribir código que **parece HTML** pero es JavaScript:

```jsx
// JSX (lo que escribes)
const elemento = <h1 className="titulo">Hola</h1>

// Se convierte en (lo que ejecuta)
const elemento = React.createElement('h1', { className: 'titulo' }, 'Hola')
```

**Reglas importantes de JSX:**
- Usa `className` en lugar de `class` (porque `class` es palabra reservada)
- Los atributos van en camelCase: `onClick`, `onChange`, `onMouseEnter`
- Las etiquetas deben cerrarse: `<br />`, `<img />`
- Solo puedes retornar UN elemento raíz

```jsx
// ❌ Error - dos elementos raíz
function App() {
  return (
    <h1>Título</h1>
    <p>Párrafo</p>
  )
}

// ✅ Correcto - envuelto en un div
function App() {
  return (
    <div>
      <h1>Título</h1>
      <p>Párrafo</p>
    </div>
  )
}

// ✅ O con Fragment (no añade un div)
function App() {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  )
}
```

### 3. Props - Pasar Datos a Componentes

Los **props** son argumentos que pasas a un componente:

```jsx
// Definición del componente
function Tarjeta({ titulo, color, contenido }) {
  return (
    <div style={{ border: `2px solid ${color}` }}>
      <h2>{titulo}</h2>
      <p>{contenido}</p>
    </div>
  )
}

// Uso - pasando props
<Tarjeta 
  titulo="Mi Tarjeta" 
  color="blue" 
  contenido="Contenido aquí"
/>

<Tarjeta 
  titulo="Otra Tarjeta" 
  color="red" 
  contenido="Diferente contenido"
/>
```

**Props Importantes:**

```jsx
// Props con valores por defecto
function Saludo({ nombre = 'Amigo' }) {
  return <h1>¡Hola, {nombre}!</h1>
}

<Saludo />                 {/* Saluda a "Amigo" */}
<Saludo nombre="Juan" />   {/* Saluda a "Juan" */}

// Props especiales
function Contenedor({ children }) {
  return (
    <div style={{ border: '1px solid gray', padding: '10px' }}>
      {children}
    </div>
  )
}

<Contenedor>
  <h1>Contenido dentro</h1>
  <p>Más contenido</p>
</Contenedor>
// Aquí, children = [<h1>...</h1>, <p>...</p>]
```

### 4. Estado - useState

El **estado** es datos que pueden cambiar en el componente. Cuando el estado cambia, React actualiza la pantalla automáticamente.

```jsx
import { useState } from 'react'

function Ejemplo() {
  // const [valorActual, función_para_cambiar] = useState(valorInicial)
  const [edad, setEdad] = useState(25)
  const [nombre, setNombre] = useState('Juan')
  const [logueado, setLogueado] = useState(false)
  
  return (
    <div>
      <p>Nombre: {nombre}</p>
      <p>Edad: {edad}</p>
      <p>Logueado: {logueado ? 'Sí' : 'No'}</p>
      
      <button onClick={() => setNombre('Carlos')}>
        Cambiar nombre
      </button>
      <button onClick={() => setEdad(edad + 1)}>
        Cumplir años
      </button>
      <button onClick={() => setLogueado(!logueado)}>
        Toggle login
      </button>
    </div>
  )
}
```

**¿Por qué no actualizar el estado directamente?**

```jsx
// ❌ NUNCA hagas esto
edad = 30  // React no se entera del cambio

// ✅ Siempre usa setState
setEdad(30)  // React se entera y re-renderiza
```

**Estados Complejos:**

```jsx
// Estado con objeto
const [usuario, setUsuario] = useState({
  nombre: 'Juan',
  email: 'juan@example.com'
})

// Actualizar parte del objeto
setUsuario({
  ...usuario,  // Copiar propiedades existentes
  nombre: 'Carlos'  // Cambiar solo esto
})

// Estado con array
const [tareas, setTareas] = useState([
  { id: 1, titulo: 'Tarea 1' },
  { id: 2, titulo: 'Tarea 2' }
])

// Agregar tarea
setTareas([...tareas, { id: 3, titulo: 'Tarea 3' }])

// Eliminar tarea
setTareas(tareas.filter(t => t.id !== 2))

// Actualizar tarea
setTareas(tareas.map(t => 
  t.id === 1 ? { ...t, titulo: 'Actualizada' } : t
))
```

### 5. Eventos

Los eventos son cosas que suceden en la página (clicks, escritura, etc.).

```jsx
function EventosEjemplo() {
  const handleClick = () => {
    console.log('¡Hiciste click!')
  }
  
  const handleChange = (evento) => {
    console.log('Escribiste:', evento.target.value)
  }
  
  const handleSubmit = (evento) => {
    evento.preventDefault()  // Evita que se recargue la página
    console.log('Formulario enviado')
  }
  
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      
      <input onChange={handleChange} placeholder="Escribe aquí" />
      
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}
```

**Eventos Comunes:**
- `onClick` - Click del ratón
- `onChange` - Cambio en input/select/textarea
- `onSubmit` - Envío de formulario
- `onFocus` - Focus en input
- `onBlur` - Pierde focus del input
- `onMouseEnter` - Ratón entra en el elemento
- `onMouseLeave` - Ratón sale del elemento
- `onKeyDown` - Tecla presionada
- `onKeyUp` - Tecla soltada

---

## Hooks

Los **Hooks** son funciones especiales que te permiten usar features de React en componentes funcionales.

### useState (Ya Visto)

```jsx
const [state, setState] = useState(initialValue)
```

### useEffect

`useEffect` te permite ejecutar código **después** de que el componente se renderiza.

```jsx
import { useEffect, useState } from 'react'

function Ejemplo() {
  const [mensaje, setMensaje] = useState('Cargando...')
  
  // Se ejecuta después de renderizar
  useEffect(() => {
    console.log('Componente montado!')
    
    // Simular carga de datos
    setTimeout(() => {
      setMensaje('Datos cargados')
    }, 2000)
  }, [])  // Array vacío = ejecutar solo 1 vez
  
  return <h1>{mensaje}</h1>
}
```

**Array de Dependencias - MUY IMPORTANTE:**

```jsx
// Se ejecuta 1 vez al montar
useEffect(() => {
  console.log('Se ejecuta UNA vez')
}, [])

// Se ejecuta cuando userId cambia
useEffect(() => {
  console.log('userId cambió a:', userId)
}, [userId])

// Se ejecuta cuando userId O userName cambian
useEffect(() => {
  console.log('Algo cambió')
}, [userId, userName])

// Se ejecuta después de CADA render (¡PELIGRO!)
useEffect(() => {
  console.log('Se ejecuta SIEMPRE')
})
```

### Limpieza en useEffect

Cuando un componente desaparece, a veces necesitas limpiar recursos:

```jsx
function Intervalo() {
  const [segundos, setSegundos] = useState(0)
  
  useEffect(() => {
    // Crear un intervalo cada segundo
    const intervalo = setInterval(() => {
      setSegundos(s => s + 1)
    }, 1000)
    
    // Función de limpieza - se ejecuta al desmontar
    return () => {
      clearInterval(intervalo)  // Detener el intervalo
      console.log('Intervalo limpiado')
    }
  }, [])
  
  return <p>Segundos: {segundos}</p>
}
```

---

## Renderizado Condicional

### Operador Ternario

```jsx
function Login({ logueado }) {
  return (
    <div>
      {logueado ? (
        <h1>Bienvenido de vuelta</h1>
      ) : (
        <h1>Inicia sesión</h1>
      )}
    </div>
  )
}
```

### Operador &&

```jsx
function Notificaciones({ nueasMensajes }) {
  return (
    <div>
      {nuevosMensajes > 0 && (
        <div className="notificacion">
          Tienes {nuevosMensajes} mensajes nuevos
        </div>
      )}
    </div>
  )
}
```

### if/else

```jsx
function Permiso({ edad }) {
  if (edad < 18) {
    return <p>No puedes entrar</p>
  }
  
  if (edad < 65) {
    return <p>Puedes entrar</p>
  }
  
  return <p>Descuento para mayores</p>
}
```

---

## Listas en React

```jsx
function ListaTareas() {
  const tareas = [
    { id: 1, titulo: 'Aprender React' },
    { id: 2, titulo: 'Hacer proyecto' },
    { id: 3, titulo: 'Celebrar' }
  ]
  
  return (
    <ul>
      {tareas.map(tarea => (
        <li key={tarea.id}>{tarea.titulo}</li>
        // key es IMPORTANTE para React
      ))}
    </ul>
  )
}
```

**¿Por qué la key es importante?**

```jsx
// ❌ MAL - usar index como key
{tareas.map((tarea, index) => (
  <li key={index}>{tarea.titulo}</li>
))}
// Si eliminas un elemento, React se confunde

// ✅ BIEN - usar ID único
{tareas.map(tarea => (
  <li key={tarea.id}>{tarea.titulo}</li>
))}
// React sabe exactamente qué elemento es cuál
```

---

## Estilos en React

### Estilos Inline

```jsx
function Estilo() {
  const estiloBoton = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
  
  return <button style={estiloBoton}>Click me</button>
}
```

### Clases CSS

```jsx
// App.jsx
import './App.css'

function App() {
  return <h1 className="titulo">Hola</h1>
}

// App.css
.titulo {
  color: blue;
  font-size: 24px;
}
```

### Clases Condicionales

```jsx
function Boton({ activo }) {
  return (
    <button className={activo ? 'activo' : 'inactivo'}>
      Click
    </button>
  )
}

// CSS
.activo {
  background-color: green;
}
.inactivo {
  background-color: gray;
}
```

---

## Formularios

```jsx
function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Datos del formulario:', formData)
    // Aquí enviarías los datos al backend
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label>Mensaje:</label>
        <textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
        />
      </div>
      
      <button type="submit">Enviar</button>
    </form>
  )
}
```

---

## Componentes Reutilizables

### Patrón: Componente Padre → Componentes Hijos

```jsx
// Componente Padre
function App() {
  const [tareas, setTareas] = useState([
    { id: 1, titulo: 'Tarea 1', completada: false },
    { id: 2, titulo: 'Tarea 2', completada: true }
  ])
  
  const completarTarea = (id) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    ))
  }
  
  return (
    <div>
      <h1>Mis Tareas</h1>
      <ListaTareas tareas={tareas} onCompletarTarea={completarTarea} />
    </div>
  )
}

// Componente Hijo 1 - Lista
function ListaTareas({ tareas, onCompletarTarea }) {
  return (
    <ul>
      {tareas.map(tarea => (
        <TareaItem
          key={tarea.id}
          tarea={tarea}
          onCompletar={() => onCompletarTarea(tarea.id)}
        />
      ))}
    </ul>
  )
}

// Componente Hijo 2 - Item
function TareaItem({ tarea, onCompletar }) {
  return (
    <li style={{
      textDecoration: tarea.completada ? 'line-through' : 'none'
    }}>
      {tarea.titulo}
      <button onClick={onCompletar}>
        {tarea.completada ? 'Desmarcar' : 'Marcar'}
      </button>
    </li>
  )
}
```

---

## Casos de Uso Común

### Cargar Datos de una API

```jsx
function DatosUsuario({ usuarioId }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setCargando(true)
        const respuesta = await fetch(`/api/usuarios/${usuarioId}`)
        const datos = await respuesta.json()
        setUsuario(datos)
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    
    cargarUsuario()
  }, [usuarioId])  // Se ejecuta cuando usuarioId cambia
  
  if (cargando) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>
  if (!usuario) return <p>No encontrado</p>
  
  return (
    <div>
      <h1>{usuario.nombre}</h1>
      <p>Email: {usuario.email}</p>
    </div>
  )
}
```

### Búsqueda/Filtrado

```jsx
function BuscadorTareas() {
  const [tareas, setTareas] = useState([
    { id: 1, titulo: 'Aprender React' },
    { id: 2, titulo: 'Hacer proyecto' },
    { id: 3, titulo: 'Aprender JavaScript' }
  ])
  const [busqueda, setBusqueda] = useState('')
  
  const tareasFiltradas = tareas.filter(t =>
    t.titulo.toLowerCase().includes(busqueda.toLowerCase())
  )
  
  return (
    <div>
      <input
        placeholder="Buscar tareas..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <ul>
        {tareasFiltradas.map(tarea => (
          <li key={tarea.id}>{tarea.titulo}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Errores Comunes

### 1. Olvidar las Llaves en JSX

```jsx
// ❌
const nombre = "Juan"
return <h1>Hola nombre</h1>  // Muestra "Hola nombre"

// ✅
return <h1>Hola {nombre}</h1>  // Muestra "Hola Juan"
```

### 2. Modificar Estado Directamente

```jsx
// ❌
estado.propiedad = "nuevo valor"

// ✅
setEstado({ ...estado, propiedad: "nuevo valor" })
```

### 3. Olvidar Dependencias en useEffect

```jsx
// ❌ userId se usa pero no está en dependencias
useEffect(() => {
  console.log(userId)
}, [])

// ✅
useEffect(() => {
  console.log(userId)
}, [userId])
```

### 4. Usar Index como Key

```jsx
// ❌
{items.map((item, index) => <div key={index}>{item}</div>)}

// ✅
{items.map(item => <div key={item.id}>{item.nombre}</div>)}
```

### 5. Olvidar Cerrar Etiquetas

```jsx
// ❌
<img src="imagen.jpg">
<input type="text">

// ✅
<img src="imagen.jpg" />
<input type="text" />
```

---

## Debugging

### 1. React DevTools

Instala la extensión "React Developer Tools" para Chrome/Firefox y podrás:
- Ver la estructura de componentes
- Inspeccionar props y estado
- Ver cuándo se re-renderiza

### 2. console.log

```jsx
useEffect(() => {
  console.log('Componente montado')
  console.log('Props:', props)
  console.log('Estado:', estado)
}, [])
```

### 3. Debugger

```jsx
useEffect(() => {
  debugger  // El navegador se pausa aquí
  console.log('Inspecciona el estado aquí')
}, [])
```

---

## Buenas Prácticas

✅ **Haz:**
- Componentes pequeños y reutilizables
- Nombres descriptivos para variables y funciones
- Separar lógica en funciones
- Usar props para pasar datos
- Incluir todas las dependencias en useEffect

❌ **Evita:**
- Componentes gigantes
- Nombres como `x`, `temp`, `data`
- Lógica compleja dentro del JSX
- Modificar estado directamente
- Olvidar dependencias en useEffect

---

## Cheat Sheet - React Básico

```jsx
// Importar React
import { useState, useEffect } from 'react'

// Componente básico
function MiComponente() {
  return <h1>Hola</h1>
}

// Con props
function Tarjeta({ titulo, color }) {
  return <div style={{ color }}>{titulo}</div>
}

// Con estado
function Contador() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

// Con efecto
function DatosAPI() {
  const [datos, setDatos] = useState(null)
  
  useEffect(() => {
    fetch('/api/datos')
      .then(r => r.json())
      .then(d => setDatos(d))
  }, [])
  
  return <div>{datos?.titulo}</div>
}

// Exportar
export default MiComponente
```

¡Ahora estás listo para crear componentes React! 🚀
