# 🚀 Vite - Guía Completa del Build Tool

## ¿Qué es Vite?

Vite es una **herramienta moderna de desarrollo y construcción** para aplicaciones JavaScript/React. Su nombre significa "rápido" en francés, y eso es exactamente lo que es: ⚡ increíblemente rápido.

### Comparación: Vite vs Otros Build Tools

| Característica | Vite | Create-React-App | Webpack |
|---|---|---|---|
| Tiempo de inicio | 50-100ms | 3-5s | 5-10s |
| Recarga en caliente (HMR) | Instantánea (<100ms) | ~1-2s | ~1-2s |
| Compilación inicial | Muy rápida | Lenta | Lenta |
| Tamaño del bundle | Pequeño | Medio | Variable |
| Configuración | Mínima | Oculta | Compleja |
| Años de desarrollo | 2020+ | 2016-2023 | 2012+ |

---

## ¿Por Qué Vite es Tan Rápido?

### 1. Módulos ES Nativo

En desarrollo, Vite **no empaqueta** tu código. En su lugar:
- Sirve los archivos directamente al navegador como módulos ES
- El navegador moderno entiende `import` y `export` de forma nativa

```
Webpack (antiguo):
Tu código → Empaquetar TODO → Servidor → Navegador (lento)

Vite (moderno):
Tu código → Servidor (sin empaquetar) → Navegador (rápido)
```

### 2. Pre-bundling con esbuild

Las dependencias (`node_modules`) se pre-procesan una sola vez con **esbuild** (escrito en Go, muy rápido).

```
npm install → esbuild pre-procesa → se cachea
```

### 3. Hot Module Replacement (HMR)

Cuando cambias un archivo:
1. Vite solo reconvierte ese archivo
2. El navegador recibe el cambio
3. Se actualiza solo ese módulo
4. **El estado se preserva** (Fast Refresh)

---

## Estructura de Vite

### Archivos Principales

```
proyecto/
├── vite.config.js          # Configuración de Vite
├── index.html              # Entrada del HTML
├── src/
│   ├── main.jsx            # Punto de entrada de JavaScript
│   ├── App.jsx
│   └── components/
├── public/                 # Archivos estáticos
└── package.json
```

### `vite.config.js` Explicado

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Plugins que Vite usa
  plugins: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,           // Puerto donde se ejecuta
    open: true,           // Abre el navegador automáticamente
    hmr: {
      host: 'localhost',
      port: 5173
    }
  },
  
  // Configuración de build
  build: {
    target: 'es2015',       // Versión de JavaScript objetivo
    outDir: 'dist',         // Carpeta de salida
    minify: 'terser',       // Minificador
  },
  
  // Alias para imports
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})
```

---

## Cómo Funciona el Desarrollo

### Paso 1: Iniciar el Servidor

```bash
npm run dev
```

Internamente ejecuta:
```bash
vite --open
```

### Paso 2: Vite Carga tu Aplicación

```
1. Lee index.html
2. Encuentra <script type="module" src="/src/main.jsx"></script>
3. Procesa main.jsx (convierte JSX a JS)
4. Sirve los archivos al navegador
5. Navegador carga la aplicación
```

### Paso 3: Haces Cambios en el Código

```
1. Guardas App.jsx
2. Vite detecta el cambio
3. Reconvierte solo App.jsx
4. Envía el módulo actualizado al navegador
5. HMR actualiza la aplicación (sin recargar)
6. Ves los cambios en tiempo real
```

---

## El Plugin React

El plugin `@vitejs/plugin-react` hace varias cosas:

### 1. Transforma JSX a JavaScript

```jsx
// Input (lo que escribes)
const elemento = <h1>Hola</h1>

// Output (lo que Vite envía al navegador)
import { jsx } from 'react/jsx-runtime'
const elemento = jsx('h1', {}, 'Hola')
```

### 2. Fast Refresh

Cuando cambias un componente:
- ✅ Se actualiza el código
- ✅ Se preserva el estado del componente
- ✅ No se pierde lo que escribiste en inputs
- ✅ El usuario no ve parpadeos

```jsx
// Cambias esto
function Contador() {
  const [count, setCount] = useState(0)
  return <p>Count: {count}</p>
}

// React actualiza el componente pero preserva count
// Ves el cambio sin perder el estado
```

### 3. Validación de Rules of Hooks

Vite te avisa si usas hooks incorrectamente.

---

## Scripts del Proyecto

```json
{
  "scripts": {
    "dev": "vite",           // Inicia servidor de desarrollo
    "build": "vite build",   // Empaqueta para producción
    "lint": "eslint .",      // Revisa errores de código
    "preview": "vite preview" // Previsualiza el build
  }
}
```

### `npm run dev`

```bash
$ npm run dev

  VITE v7.2.2  ready in 145 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Qué hace:**
- Inicia servidor de desarrollo en puerto 5173
- Habilita HMR (reloads automáticos)
- Muestra errores en overlay
- Monitorea cambios en archivos

### `npm run build`

```bash
$ npm run build

vite v7.2.2 building for production...
✓ 1234 modules transformed
dist/index.html                  4.5 kB
dist/assets/index-abc123.js    145.2 kB
dist/assets/index-def456.css     8.3 kB

Build complete in 2.5s
```

**Qué hace:**
- Empaqueta todo el código
- Minifica JavaScript y CSS
- Genera source maps (opcional)
- Crea carpeta `dist/` lista para producción

### `npm run preview`

```bash
$ npm run preview
  
  ➜  Local: http://localhost:5173/
```

**Qué hace:**
- Simula el servidor de producción
- Sirve archivos desde `dist/`
- Te permite ver cómo se vería en producción

---

## Configuración Avanzada

### Resolución de Alias

En tu proyecto puedes hacer:

```javascript
// En vite.config.js
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
    }
  }
})
```

Luego puedes importar así:

```jsx
// En lugar de:
import Button from '../../../components/Button'

// Puedes hacer:
import Button from '@components/Button'
import useAuth from '@hooks/useAuth'
```

### Optimización de Dependencias

```javascript
export default defineConfig({
  optimizeDeps: {
    // Pre-empaquetar estas dependencias
    include: ['react', 'react-dom', '@mui/material'],
    // Excluir estas
    exclude: ['heavy-lib']
  }
})
```

### Definir Variables Globales

```javascript
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(true),
    __VERSION__: JSON.stringify('1.0.0')
  }
})
```

Luego en tu código:

```javascript
if (__DEV__) {
  console.log('En desarrollo')
}
console.log(`Versión: ${__VERSION__}`)
```

---

## Variables de Entorno en Vite

### Archivos `.env`

```
proyecto/
├── .env                 # Todas las vistas
├── .env.development     # Solo en desarrollo
├── .env.production      # Solo en producción
└── .env.local           # Local (en .gitignore)
```

### Contenido de `.env`

```dotenv
# Variables públicas (accesibles en el navegador)
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Mi Aplicación

# Variables privadas (solo backend, si usas SSR)
DB_PASSWORD=secreto  # NO accesible en el navegador
```

### Cómo Acceder

```javascript
// En JavaScript
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME

console.log(apiUrl)  // "http://localhost:8000"
console.log(appName) // "Mi Aplicación"
```

**En tu `.env` actual:**
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_BACKEND_URL=http://localhost:8000
```

---

## Plugins

Vite puede extenderse con plugins para manejar tipos de archivos especiales.

### Plugin React (que ya tienes)

```javascript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

### Otros Plugins Útiles

```javascript
// Para Vue
import vue from '@vitejs/plugin-vue'

// Para componentes virtuales
import virtual from '@rollup/plugin-virtual'

// Para cargar archivos raw
import raw from 'vite-raw-plugin'
```

---

## Build para Producción

### Optimizaciones que Hace Vite

1. **Tree Shaking**
   - Elimina código no usado
   - Reduce el tamaño del bundle

2. **Code Splitting**
   - Divide el código en chunks
   - Cada página/ruta carga lo que necesita

3. **Minificación**
   - Comprime JavaScript
   - Comprime CSS

4. **Hashing de Archivos**
   ```
   index-abc123.js  (el hash cambia si el código cambia)
   ```
   - Permite cacheo eficiente en navegadores

### Ejemplo de Build

```bash
$ npm run build

dist/index.html                           0.46 kB │ gzip:  0.33 kB
dist/assets/index-CjC99pqJ.js            145.2 kB │ gzip:  46.1 kB
dist/assets/index-Dy7xZ8Lx.css             2.5 kB │ gzip:  1.1 kB
```

Tamaño final muy optimizado.

---

## Debugging

### Ver lo que Vite Está Haciendo

```bash
# Ver logs detallados
npm run dev -- --debug

# Ver los módulos que carga
npm run dev -- --loglevel info
```

### Error Overlay

Cuando hay un error en desarrollo, Vite lo muestra en la pantalla:

```
[ERROR] Failed to parse source map from...
[ERROR] Expected identifier, got '{'
```

### Source Maps

En desarrollo, Vite genera source maps para debugging:

```javascript
// index-abc123.js.map
// Te permite ver el código original en el DevTools del navegador
```

---

## Rendimiento

### Métricas Típicas

```
Vite Dev Server:
- Tiempo de inicio: 50-200ms
- HMR: <100ms
- Rebuild: 50-500ms

Webpack (viejo):
- Tiempo de inicio: 3-10s
- HMR: 1-3s
- Rebuild: 500ms-5s
```

### Tips de Rendimiento

1. **Evita plugins pesados**
   ```javascript
   // ❌ Lento
   plugins: [heavyPlugin(), anotherHeavyPlugin()]
   
   // ✅ Rápido
   plugins: [lightPlugin()]
   ```

2. **Usa aliases**
   ```javascript
   // Más rápido que ../../../ paths
   alias: { '@': '/src' }
   ```

3. **Pre-bundle dependencias estratégicamente**
   ```javascript
   optimizeDeps: {
     include: ['react', 'react-dom']
   }
   ```

---

## Comparación: Dev vs Production Build

### Desarrollo (`npm run dev`)

```
Ventajas:
✅ Ultra rápido
✅ Recarga instantánea
✅ Errores claramente mostrados
✅ Source maps para debugging

Desventajas:
❌ No está optimizado
❌ Más grande
❌ No está minificado
❌ Variables de entorno NO se remplazan
```

### Producción (`npm run build`)

```
Ventajas:
✅ Super optimizado
✅ Pequeño tamaño
✅ Minificado
✅ Variables reemplazadas
✅ Listo para deployar

Desventajas:
❌ Más lento de buildear
❌ Debugging más difícil (se puede mitigar con source maps)
```

---

## Desplegar el Build

### Contenido de `dist/`

```
dist/
├── index.html                  # Entrada principal
├── assets/
│   ├── index-abc123.js        # JavaScript empaquetado
│   ├── index-def456.css       # CSS empaquetado
│   └── logo-gh45678.svg       # Recursos
└── .nojekyll                  # Para GitHub Pages
```

### Opciones de Despliegue

#### 1. **GitHub Pages**

```bash
# En package.json
"deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

#### 2. **Vercel**

```bash
# Automático - conecta tu GitHub y listo
# Vercel detecta Vite automáticamente
```

#### 3. **Netlify**

```bash
# Build command: npm run build
# Publish directory: dist
```

#### 4. **Docker**

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## Troubleshooting

### Problema: "Cannot find module"

```
❌ Error: Cannot find module '@/components/Button'
```

**Solución:**
- Verifica que el alias esté en `vite.config.js`
- Verifica que la ruta sea correcta

### Problema: HMR No Funciona

```
❌ WebSocket connection failed
```

**Solución:**
```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: {
      host: 'localhost',
      port: 5173
    }
  }
})
```

### Problema: Variables de Entorno No se Cargan

```javascript
// ❌ No funciona - no empieza con VITE_
import.meta.env.API_KEY

// ✅ Funciona - empieza con VITE_
import.meta.env.VITE_API_KEY
```

### Problema: Build Muy Lento

**Causas:**
- Muchos plugins pesados
- Dependencias grandes no pre-empaquetadas
- Configuración ineficiente

**Soluciones:**
```javascript
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    minify: 'esbuild'  // Más rápido que terser
  }
})
```

---

## Cheat Sheet - Vite

```bash
# Iniciar desarrollo
npm run dev

# Buildear para producción
npm run build

# Previsualizar build
npm run preview

# Revisar código
npm run lint
```

```javascript
// vite.config.js básico
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

```javascript
// Acceder a variables de entorno
const apiUrl = import.meta.env.VITE_API_URL
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Conclusión

Vite es una herramienta moderna que hace el desarrollo React **mucho más rápido y agradable**. Sus características principales son:

- ⚡ **Ultra rápido** en desarrollo
- 🔄 **HMR instantáneo**
- 📦 **Builds optimizados**
- ⚙️ **Fácil de configurar**
- 🔌 **Extensible con plugins**

¡Ahora entiendes cómo funciona Vite! 🚀
