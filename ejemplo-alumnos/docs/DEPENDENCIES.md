# 📚 Librerías y Dependencias - Explicadas

## Package.json - El ADN del Proyecto

El `package.json` es un archivo **JSON** que describe tu proyecto. Es como un "documento de identidad" con toda la información necesaria.

```json
{
  "name": "ejemplo-alumnos",          // Nombre único del proyecto
  "version": "0.0.0",                  // Versión del proyecto
  "private": true,                     // No es un paquete público
  "type": "module",                    // Usa módulos ES6 (import/export)
  "description": "Mi aplicación",      // Descripción
  "author": "Yo",                      // Autor
  "scripts": {},                       // Comandos npm
  "dependencies": {},                  // Librerías de producción
  "devDependencies": {}               // Librerías solo de desarrollo
}
```

---

## Dependencies vs DevDependencies

### Dependencies (Producción)

Son librerías que tu aplicación **necesita para funcionar** en producción.

```json
"dependencies": {
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@supabase/supabase-js": "^2.81.1",
  "@mui/material": "^7.3.5"
}
```

Cuando haces `npm run build`, estas librerías se incluyen en el bundle final.

### DevDependencies (Desarrollo)

Son herramientas que **solo necesitas durante el desarrollo**. No se incluyen en el bundle final.

```json
"devDependencies": {
  "vite": "^7.2.2",
  "@vitejs/plugin-react": "^5.1.0",
  "eslint": "^9.39.1"
}
```

Cuando haces `npm run build`, estas librerías se excluyen del bundle.

### Diferencia Práctica

```javascript
// dependencies - va al bundle
import React from 'react'  // ✅ Incluido en producción

// devDependencies - NO va al bundle
import eslintPlugin from '@vitejs/plugin-react'  // ❌ No incluido

// En producción:
// bundle.js contiene React
// bundle.js NO contiene eslint
```

---

## Versionamiento Semántico (Semantic Versioning)

Las versiones siguen el formato: **MAJOR.MINOR.PATCH**

```
"react": "^19.2.0"
          ↑  ↑ ↑
          │  │ └─ PATCH (arreglos de bugs: 19.2.0 → 19.2.1)
          │  └──── MINOR (nuevas features: 19.2.0 → 19.3.0)
          └─────── MAJOR (cambios incompatibles: 19.0.0 → 20.0.0)
```

### Símbolos de Versión

```
"react": "19.2.0"      ← Exactamente esta versión
"react": "~19.2.0"     ← 19.2.x (19.2.0 a 19.2.999)
"react": "^19.2.0"     ← 19.x.x (19.2.0 a 19.999.999)
"react": "*"           ← Cualquier versión (¡peligroso!)
```

### Ejemplos Prácticos

```
19.2.0 → 19.2.1 ✅ Actualización segura (patch)
19.2.0 → 19.3.0 ⚠️  Podría romper cosas (features nuevas)
19.2.0 → 20.0.0 ❌ Probablemente rompa cosas (cambios mayores)

Con ^19.2.0:
  19.2.0 ✅
  19.2.5 ✅
  19.3.0 ✅
  20.0.0 ❌

Con ~19.2.0:
  19.2.0 ✅
  19.2.5 ✅
  19.3.0 ❌
```

---

## Librerías en Tu Proyecto

### React (^19.2.0)

**¿Qué es?**
La librería principal para construir interfaces de usuario.

**¿Qué proporciona?**
- Componentes reutilizables
- Hooks (useState, useEffect, etc.)
- Virtual DOM
- JSX

**Instalación:**
```bash
npm install react
```

**Uso:**
```jsx
import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
```

### React-DOM (^19.2.0)

**¿Qué es?**
La glue que conecta React con el DOM del navegador.

**¿Qué proporciona?**
- `ReactDOM.createRoot()` - renderiza React en el HTML
- Métodos para manipular el DOM

**Importante:**
React y React-DOM están **separados** porque React es agnóstico del DOM. Teóricamente podrías usarlo con React Native para móviles, React VR para realidad virtual, etc.

**Instalación:**
```bash
npm install react-dom
```

**Uso:**
```javascript
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

### Supabase (@supabase/supabase-js ^2.81.1)

**¿Qué es?**
Cliente JavaScript para conectarse a Supabase (backend).

**¿Qué proporciona?**
- Autenticación (login, registro)
- Base de datos (operaciones CRUD)
- Almacenamiento (files)
- Realtime (escuchar cambios)

**Instalación:**
```bash
npm install @supabase/supabase-js
```

**Uso:**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Autenticación
await supabase.auth.signUp({ email, password })
await supabase.auth.signIn({ email, password })

// Base de datos
const { data, error } = await supabase
  .from('tareas')
  .select()

// Actualizar
await supabase
  .from('tareas')
  .update({ titulo: 'Nueva' })
  .eq('id', 1)
```

### Material-UI (@mui/material ^7.3.5)

**¿Qué es?**
Librería de componentes visuales pre-construidos.

**¿Qué proporciona?**
- Botones, inputs, formularios
- Diálogos, modales, drawers
- Layouts (Box, Container, Grid, Stack)
- Tema (colores, tipografía)
- Iconos

**Instalación:**
```bash
npm install @mui/material @emotion/react @emotion/styled
```

**Uso:**
```jsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

function MiComponente() {
  return (
    <Box sx={{ p: 2 }}>
      <TextField label="Email" />
      <Button variant="contained">Enviar</Button>
    </Box>
  )
}
```

**Componentes Comunes:**
- `Button` - botones
- `TextField` - inputs de texto
- `Box` - contenedor (div con estilos)
- `Container` - contenedor centrado
- `Paper` - elemento con sombra
- `Typography` - textos
- `Stack` - agrupa elementos en fila/columna
- `Chip` - etiqueta pequeña
- `Fade`, `Slide` - animaciones

### Material-UI Icons (@mui/icons-material ^7.3.5)

**¿Qué es?**
Iconos pre-diseñados para usar con Material-UI.

**Instalación:**
```bash
npm install @mui/icons-material
```

**Uso:**
```jsx
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

function MiComponente() {
  return (
    <div>
      <DeleteIcon />
      <EditIcon />
    </div>
  )
}
```

**Iconos Populares:**
- `DeleteIcon` - trash
- `EditIcon` - lápiz
- `SaveIcon` - diskette
- `CancelIcon` - X
- `SearchIcon` - lupa
- `MailIcon` - sobre
- `LogoutIcon` - salida
- `LoginIcon` - entrada

### Emotion (@emotion/react, @emotion/styled)

**¿Qué es?**
Sistema de CSS-in-JS que Material-UI usa internamente.

**¿Qué proporciona?**
- Escribir CSS con JavaScript
- Estilos dinámicos basados en props
- Scoping automático

**Instalación:**
```bash
npm install @emotion/react @emotion/styled
```

**Uso:**
```javascript
import styled from '@emotion/styled'
import { css } from '@emotion/react'

// Componente estilizado
const BotonEstilo = styled.button`
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: darkblue;
  }
`

// Con props dinámicas
const Caja = styled.div`
  background-color: ${props => props.color || 'white'};
  padding: ${props => props.p || '10px'};
`

// En React
function App() {
  return (
    <>
      <BotonEstilo>Click me</BotonEstilo>
      <Caja color="blue" p="20px">Contenido</Caja>
    </>
  )
}
```

---

## DevDependencies Explicadas

### Vite (^7.2.2)

**¿Qué es?**
Build tool para desarrollo y producción.

**¿Qué hace?**
- Sirve código en desarrollo ultra rápido
- Empaqueta para producción
- Maneja JSX

**Instalación:**
```bash
npm install --save-dev vite
```

### @vitejs/plugin-react (^5.1.0)

**¿Qué es?**
Plugin que hace que Vite entienda React/JSX.

**¿Qué hace?**
- Transforma JSX a JavaScript
- Habilita Fast Refresh
- Valida rules of hooks

**Instalación:**
```bash
npm install --save-dev @vitejs/plugin-react
```

**Configuración:**
```javascript
// vite.config.js
import react from '@vitejs/plugin-react'

export default {
  plugins: [react()]
}
```

### ESLint (^9.39.1)

**¿Qué es?**
Linter - revisa tu código en busca de errores y estilo.

**¿Qué hace?**
- Detecta bugs
- Impone estilo de código
- Sugiere mejoras

**Instalación:**
```bash
npm install --save-dev eslint
```

**Uso:**
```bash
npm run lint  # Revisa todos los archivos
```

**Tipos de Reglas:**
```javascript
// Errores
- No usar variables no declaradas
- No usar funciones antes de declararlas
- Sintaxis inválida

// Warnings
- Variables sin usar
- Parámetros sin usar
- Código duplicado

// Style
- Punto y coma al final
- Comillas simples vs dobles
- Espacios en blanco
```

### @types/react, @types/react-dom

**¿Qué es?**
Definiciones de tipos para TypeScript (aunque no uses TypeScript).

**¿Qué proporciona?**
- Autocompletado mejor en el editor
- Previene errores comunes

**Instalación:**
```bash
npm install --save-dev @types/react @types/react-dom
```

### Otros DevDependencies

```json
{
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0"
}
```

- `eslint-plugin-react-hooks` - Valida el uso correcto de hooks
- `eslint-plugin-react-refresh` - Valida Fast Refresh
- `globals` - Define variables globales conocidas

---

## Cómo Instalar Librerías

### Agregar una Dependencia

```bash
# Production
npm install react-router-dom

# Development
npm install --save-dev typescript

# Short version
npm i react-router-dom
npm i -D typescript
```

### package.json se Actualiza Automáticamente

Cuando instalas, npm actualiza `package.json`:

```json
{
  "dependencies": {
    "react-router-dom": "^6.20.0"  // ← Automáticamente agregado
  }
}
```

### package-lock.json

Además, crea `package-lock.json` que "congela" las versiones exactas para reproducibilidad:

```json
{
  "react-router-dom": {
    "version": "6.20.0",
    "resolved": "https://registry.npmjs.org/react-router-dom/-/react-router-dom-6.20.0.tgz",
    "integrity": "sha512-..."
  }
}
```

### Instalar Todas las Dependencias

```bash
npm install
# o
npm i

# Instala TODAS las librerías listadas en package.json
# Crea carpeta node_modules/
```

### Desinstalar Librerías

```bash
npm uninstall react-router-dom

# O remover una devDependency
npm uninstall --save-dev typescript
```

### Actualizar Librerías

```bash
# Ver qué se puede actualizar
npm outdated

# Actualizar todas
npm update

# Actualizar una específica
npm install react@latest
```

---

## node_modules - La Carpeta Mágica

Cuando haces `npm install`, npm descarga todas las librerías y las mete en `node_modules/`.

```
node_modules/
├── react/
│   ├── package.json
│   ├── index.js
│   ├── dist/
│   └── ...
├── react-dom/
│   └── ...
├── @supabase/
│   └── supabase-js/
│       └── ...
└── ... (miles de carpetas)
```

### Tamaño de node_modules

```
node_modules/ puede ocupar 500MB - 1GB o más!
```

Por eso es importante:

1. **Nunca commitear** `node_modules/` a Git
2. **Usar** `.gitignore`:
   ```
   node_modules/
   dist/
   .env
   ```

3. **Si clonas un repo**:
   ```bash
   git clone https://github.com/user/repo
   cd repo
   npm install  # Restaura node_modules
   ```

---

## Flujo de npm

```
1. Escribes: npm install express
   ↓
2. npm descarga express del repositorio oficial (npmjs.com)
   ↓
3. npm descarga todas las dependencias de express recursivamente
   ↓
4. npm coloca todo en node_modules/
   ↓
5. npm actualiza package.json y package-lock.json
   ↓
6. Puedes importar: import express from 'express'
```

---

## Seguridad con npm

### Auditar Vulnerabilidades

```bash
npm audit
# Muestra vulnerabilidades conocidas

npm audit fix
# Intenta arreglarlas automáticamente
```

### Verificar Integridad

```bash
npm ci
# Instala versiones EXACTAS de package-lock.json
# Mejor para CI/CD y producción
```

---

## Cheat Sheet - Dependencias

```bash
# Instalar todo
npm install

# Agregar dependencia
npm install nombre-libreria

# Agregar devDependency
npm install --save-dev nombre-libreria

# Desinstalar
npm uninstall nombre-libreria

# Ver dependencias instaladas
npm list

# Actualizar todas
npm update

# Ver qué se puede actualizar
npm outdated

# Revisar vulnerabilidades
npm audit
```

---

## Resumen Visual

```
Tu Código
  ↓
 import { Button } from '@mui/material'
  ↓
Node busca en node_modules/@mui/material/
  ↓
Encuentra el código de Button
  ↓
Lo incluye en el bundle
  ↓
Tu aplicación funciona
```

¡Ahora entiendes cómo funcionan las librerías en npm! 🚀
