# 💻 Ejemplos Prácticos - Aprende Haciendo

## Ejemplo 1: Contador Simple

Empecemos con lo más básico.

### Paso 1: Crear el Componente

```jsx
// src/components/Contador.jsx
import { useState } from 'react'

export default function Contador() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', border: '1px solid black' }}>
      <h2>Mi Contador</h2>
      <p>Contador: {count}</p>
      
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      
      <button onClick={() => setCount(count - 1)}>
        Decrementar
      </button>
      
      <button onClick={() => setCount(0)}>
        Resetear
      </button>
    </div>
  )
}
```

### Paso 2: Usarlo en App

```jsx
// src/App.jsx
import Contador from './components/Contador'

function App() {
  return (
    <div>
      <h1>Mi App</h1>
      <Contador />
    </div>
  )
}

export default App
```

### Cómo Funciona

1. Al renderizar, `count = 0`
2. Usuario hace click en "Incrementar"
3. `onClick={() => setCount(count + 1)}` se ejecuta
4. `setCount(1)` actualiza el estado
5. React re-renderiza el componente
6. Ahora `count = 1`, pantalla se actualiza

---

## Ejemplo 2: Formulario de Input

```jsx
// src/components/FormularioNombre.jsx
import { useState } from 'react'

export default function FormularioNombre() {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()  // Evita recargar la página
    console.log('Nombre:', nombre, 'Edad:', edad)
    setEnviado(true)
  }

  const handleLimpiar = () => {
    setNombre('')
    setEdad('')
    setEnviado(false)
  }

  return (
    <div>
      <h2>Formulario</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label>Edad:</label>
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            placeholder="Tu edad"
          />
        </div>

        <button type="submit">Enviar</button>
        <button type="button" onClick={handleLimpiar}>
          Limpiar
        </button>
      </form>

      {enviado && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid green' }}>
          <h3>¡Gracias!</h3>
          <p>Hola {nombre}, tienes {edad} años.</p>
        </div>
      )}
    </div>
  )
}
```

---

## Ejemplo 3: Lista de Tareas (Lo Básico)

```jsx
// src/components/ListaTareas.jsx
import { useState } from 'react'

export default function ListaTareas() {
  const [tareas, setTareas] = useState([])
  const [inputTarea, setInputTarea] = useState('')

  // Agregar tarea
  const agregarTarea = () => {
    if (inputTarea.trim() === '') return

    const nuevaTarea = {
      id: Date.now(),  // ID único basado en timestamp
      titulo: inputTarea,
      completada: false
    }

    setTareas([...tareas, nuevaTarea])
    setInputTarea('')  // Limpiar input
  }

  // Completar tarea
  const completarTarea = (id) => {
    setTareas(
      tareas.map(tarea =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    )
  }

  // Eliminar tarea
  const eliminarTarea = (id) => {
    setTareas(tareas.filter(tarea => tarea.id !== id))
  }

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h2>Mis Tareas</h2>

      {/* Input para nueva tarea */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputTarea}
          onChange={(e) => setInputTarea(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
          placeholder="Escribe una nueva tarea..."
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={agregarTarea} style={{ padding: '8px 15px', marginLeft: '10px' }}>
          Agregar
        </button>
      </div>

      {/* Lista de tareas */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas.map(tarea => (
          <li
            key={tarea.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: tarea.completada ? '#f0f0f0' : 'white',
              textDecoration: tarea.completada ? 'line-through' : 'none'
            }}
          >
            <span>{tarea.titulo}</span>
            <div>
              <button
                onClick={() => completarTarea(tarea.id)}
                style={{ marginRight: '10px', padding: '5px 10px' }}
              >
                {tarea.completada ? 'Desmarcar' : 'Completar'}
              </button>
              <button
                onClick={() => eliminarTarea(tarea.id)}
                style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white' }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {tareas.length === 0 && (
        <p style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
          No hay tareas. ¡Agrega una!
        </p>
      )}

      <p style={{ marginTop: '20px', color: '#666' }}>
        Total: {tareas.length} | Completadas: {tareas.filter(t => t.completada).length}
      </p>
    </div>
  )
}
```

**Conceptos que Aprendemos:**
- `useState` con array
- `.map()` para renderizar listas
- Función de ID único: `Date.now()`
- Spread operator: `[...tareas, nuevaTarea]`
- `.filter()` para eliminar
- `.map()` para actualizar

---

## Ejemplo 4: Componentes Padre-Hijo

### Componente Padre: Galería

```jsx
// src/components/Galeria.jsx
import { useState } from 'react'
import TarjetaProducto from './TarjetaProducto'

export default function Galeria() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Laptop', precio: 1000, favorito: false },
    { id: 2, nombre: 'Mouse', precio: 25, favorito: false },
    { id: 3, nombre: 'Teclado', precio: 75, favorito: false }
  ])

  // Cambiar favorito
  const toggleFavorito = (id) => {
    setProductos(
      productos.map(p =>
        p.id === id ? { ...p, favorito: !p.favorito } : p
      )
    )
  }

  // Contar favoritos
  const favoritosCuenta = productos.filter(p => p.favorito).length

  return (
    <div>
      <h2>Galería de Productos</h2>
      <p>Favoritos: {favoritosCuenta}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {productos.map(producto => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            onToggleFavorito={() => toggleFavorito(producto.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

### Componente Hijo: TarjetaProducto

```jsx
// src/components/TarjetaProducto.jsx
export default function TarjetaProducto({ producto, onToggleFavorito }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center',
      backgroundColor: producto.favorito ? '#fffacd' : 'white'
    }}>
      <h3>{producto.nombre}</h3>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
        ${producto.precio}
      </p>
      <button
        onClick={onToggleFavorito}
        style={{
          padding: '10px 20px',
          backgroundColor: producto.favorito ? 'red' : 'gray',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {producto.favorito ? '❤️ Favorito' : '🤍 Añadir a favoritos'}
      </button>
    </div>
  )
}
```

**Conceptos:**
- Props: `producto` y `onToggleFavorito`
- Callbacks: Pasar función del padre al hijo
- El hijo NO modifica directamente, solo llama a función del padre
- El padre actualiza el estado

---

## Ejemplo 5: useEffect - Cargar Datos

```jsx
// src/components/UsuariosAPI.jsx
import { useState, useEffect } from 'react'

export default function UsuariosAPI() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Función para cargar datos
    const cargarUsuarios = async () => {
      try {
        setCargando(true)
        
        // Simular llamada a API
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users')
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar usuarios')
        }
        
        const datos = await respuesta.json()
        setUsuarios(datos.slice(0, 5))  // Solo los primeros 5
        
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }

    cargarUsuarios()
  }, [])  // Se ejecuta solo una vez

  // Mientras carga
  if (cargando) return <p>Cargando usuarios...</p>

  // Si hay error
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  // Si no hay datos
  if (usuarios.length === 0) return <p>No hay usuarios</p>

  // Mostrar usuarios
  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id}>
            <strong>{usuario.name}</strong> - {usuario.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Conceptos:**
- `async/await` en useEffect
- Try/catch para manejo de errores
- Estados: `cargando`, `error`, `datos`
- Renderizado condicional

---

## Ejemplo 6: Estados Complejos

```jsx
// src/components/Perfil.jsx
import { useState } from 'react'

export default function Perfil() {
  // Estado complejo con objeto
  const [perfil, setPerfil] = useState({
    nombre: 'Juan',
    email: 'juan@example.com',
    ciudad: 'Madrid',
    edad: 25,
    intereses: ['React', 'JavaScript', 'Vite']
  })

  // Cambiar propiedad simple
  const cambiarNombre = (nuevoNombre) => {
    setPerfil({
      ...perfil,
      nombre: nuevoNombre
    })
  }

  // Cambiar array (agregar)
  const agregarInteres = (interes) => {
    setPerfil({
      ...perfil,
      intereses: [...perfil.intereses, interes]
    })
  }

  // Cambiar array (eliminar)
  const eliminarInteres = (indice) => {
    setPerfil({
      ...perfil,
      intereses: perfil.intereses.filter((_, i) => i !== indice)
    })
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', border: '1px solid #ccc', padding: '20px' }}>
      <h2>Mi Perfil</h2>

      {/* Nombre */}
      <div style={{ marginBottom: '15px' }}>
        <label>Nombre:</label>
        <input
          value={perfil.nombre}
          onChange={(e) => cambiarNombre(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      {/* Información */}
      <p><strong>Email:</strong> {perfil.email}</p>
      <p><strong>Ciudad:</strong> {perfil.ciudad}</p>
      <p><strong>Edad:</strong> {perfil.edad}</p>

      {/* Intereses */}
      <div>
        <h3>Mis Intereses</h3>
        <ul>
          {perfil.intereses.map((interes, indice) => (
            <li key={indice}>
              {interes}
              <button
                onClick={() => eliminarInteres(indice)}
                style={{ marginLeft: '10px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          id="nuevoInteres"
          placeholder="Nuevo interés..."
          style={{ padding: '5px', marginRight: '5px' }}
        />
        <button
          onClick={() => {
            const input = document.getElementById('nuevoInteres')
            if (input.value.trim()) {
              agregarInteres(input.value)
              input.value = ''
            }
          }}
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
```

**Conceptos:**
- Spread operator para copiar objetos
- Cambiar propiedades específicas
- Cambiar arrays dentro de objetos
- Renderizar arrays con `.map()`

---

## Ejemplo 7: Búsqueda y Filtrado

```jsx
// src/components/BuscadorProductos.jsx
import { useState } from 'react'

export default function BuscadorProductos() {
  const [productos] = useState([
    { id: 1, nombre: 'Laptop Dell', precio: 1200 },
    { id: 2, nombre: 'Mouse Logitech', precio: 50 },
    { id: 3, nombre: 'Monitor LG', precio: 300 },
    { id: 4, nombre: 'Teclado Mecánico', precio: 150 },
    { id: 5, nombre: 'Laptop HP', precio: 900 }
  ])

  const [busqueda, setBusqueda] = useState('')
  const [precioMax, setPrecioMax] = useState(2000)

  // Filtrar productos
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    p.precio <= precioMax
  )

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Buscador de Productos</h2>

      {/* Búsqueda */}
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar producto..."
        style={{ padding: '10px', width: '100%', marginBottom: '15px' }}
      />

      {/* Filtro de precio */}
      <div style={{ marginBottom: '15px' }}>
        <label>Precio máximo: ${precioMax}</label>
        <input
          type="range"
          min="0"
          max="2000"
          value={precioMax}
          onChange={(e) => setPrecioMax(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Resultados */}
      <p>Se encontraron {productosFiltrados.length} productos</p>
      <ul>
        {productosFiltrados.map(producto => (
          <li key={producto.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>{producto.nombre}</strong> - ${producto.precio}
          </li>
        ))}
      </ul>

      {productosFiltrados.length === 0 && (
        <p style={{ color: '#999', textAlign: 'center' }}>
          No se encontraron productos con esos criterios
        </p>
      )}
    </div>
  )
}
```

---

## Ejemplo 8: Validación de Formulario

```jsx
// src/components/FormularioRegistro.jsx
import { useState } from 'react'

export default function FormularioRegistro() {
  const [formulario, setFormulario] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terminos: false
  })

  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  const validar = () => {
    const nuevosErrores = {}

    // Validar email
    if (!formulario.email) {
      nuevosErrores.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
      nuevosErrores.email = 'El email no es válido'
    }

    // Validar password
    if (!formulario.password) {
      nuevosErrores.password = 'La contraseña es requerida'
    } else if (formulario.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    // Validar confirmación
    if (formulario.password !== formulario.confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden'
    }

    // Validar términos
    if (!formulario.terminos) {
      nuevosErrores.terminos = 'Debes aceptar los términos'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validar()) {
      console.log('Formulario válido:', formulario)
      setEnviado(true)
      setFormulario({ email: '', password: '', confirmPassword: '', terminos: false })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <h2>Registrarse</h2>

      {enviado && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', marginBottom: '15px' }}>
          ✓ ¡Registro exitoso!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formulario.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errores.email && (
            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>
              {errores.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formulario.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errores.password && (
            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>
              {errores.password}
            </p>
          )}
        </div>

        {/* Confirmar Password */}
        <div style={{ marginBottom: '15px' }}>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formulario.confirmPassword}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errores.confirmPassword && (
            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>
              {errores.confirmPassword}
            </p>
          )}
        </div>

        {/* Términos */}
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="terminos"
              checked={formulario.terminos}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Aceptar términos y condiciones
          </label>
          {errores.terminos && (
            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>
              {errores.terminos}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}
```

---

## Cómo Usar Estos Ejemplos

1. **Crear el archivo**: Copia el código en `src/components/NombreComponente.jsx`
2. **Importar en App.jsx**:
   ```jsx
   import Contador from './components/Contador'
   ```
3. **Usar en el JSX**:
   ```jsx
   <Contador />
   ```
4. **Ver en el navegador**: La aplicación se actualiza automáticamente

---

## Ejercicios para Practicar

1. **Modifica el Contador**: Agrega un botón para incrementar de 5 en 5
2. **Mejora la Lista de Tareas**: Agrega categorías a las tareas
3. **Crea un Generador de Colores**: Componente que genera colores al azar
4. **Contador Descendente**: Crea un componente que cuente hacia atrás desde 10 a 0
5. **Tablero de Notas**: Componente para crear, editar y eliminar notas
6. **Calculadora**: Componente que suma, resta, multiplica, divide
7. **Carrito de Compras**: Agregar/eliminar productos, calcular total

¡Ahora tienes suficientes ejemplos para empezar! 🚀
