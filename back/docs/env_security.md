# Seguridad: nunca publicar tu archivo `.env`

Este documento explica por qué NUNCA debes subir `.env` con credenciales a un repositorio público,
y ofrece pasos prácticos y seguros para evitar filtraciones, borrar un `.env` ya comiteado,
y rotar secretos si se filtran. También se muestra cómo añadir `.env` a `.gitignore` y buenas prácticas.

---

## ¿Por qué es peligroso publicar `.env`?

- El `.env` suele contener secretos: claves de API, tokens, contraseñas, secrets de JWT, credenciales de bases de datos.
- Si alguien obtiene esas credenciales puede acceder a servicios (bases de datos, SaaS, proveedores), generar costes, leer o borrar datos y comprometer usuarios.
- Los repositorios públicos y forks hacen que las credenciales queden disponibles a mucha gente — incluso bots buscan automáticamente claves en GitHub.

Ejemplos de cosas que suelen ir en `.env`:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`
- `DATABASE_URL`, `AWS_SECRET_ACCESS_KEY`, `STRIPE_SECRET_KEY`

---

## Primera línea de defensa: añadir `.env` a `.gitignore`

1. En la raíz del repositorio crea o edita el archivo `.gitignore`.
2. Añade la línea:

```
.env
```

3. Guardar y commitear el cambio:

```powershell
# PowerShell (Windows)
git add .gitignore; git commit -m "Ignore .env"; git push
```

Esto evita que futuros cambios a `.env` sean rastreados por Git. IMPORTANTE: si el fichero ya fue comiteado previamente, este paso no lo eliminará del historial por sí solo (ver sección siguiente).

---

## Si ya comiteaste `.env`: pasos para eliminarlo del repo y mitigar

Si ya subiste `.env` al repositorio (en cualquier rama), sigue estos pasos urgentes:

1) **Eliminar del índice (staging) y commitear** (esto no borra el historial remoto):

```powershell
# elimina .env del índice local (no borra el archivo local)
git rm --cached .env
git commit -m "Remove .env from repository"
git push
```

2) **Rotar (invalidar) todas las credenciales comprometidas**
- Asume que las claves en `.env` fueron vistas por terceros: regenera/revoca las claves en los servicios (Supabase, AWS, Stripe, etc.).
- Actualiza las variables en los servicios donde se configuran (GitHub Secrets, entorno del servidor, etc.).

3) **Eliminar de historial remoto (opcional y más invasivo)**
- Para remover definitivamente las claves del historial Git (cuidado: reescribe historial):
  - Usar `git filter-repo` (recomendado) o `git filter-branch` o la herramienta `bfg-repo-cleaner`.
  - Ejemplo con `git filter-repo` (instálalo primero):

```powershell
# instala git-filter-repo (recomendado en Linux/macOS via pip o paquete). En Windows, usa WSL o instala la herramienta.
# Ejemplo de comando (ADVERTENCIA: reescribe historial):
git filter-repo --path .env --invert-paths
# Luego fuerza push (ten cuidado, rompe clones remotos):
git push --force --all
git push --force --tags
```

- Si trabajas en equipo, coordina: reescribir historial obliga a que todos reconstruyan sus clones.

4) **Buscar la clave en servicios públicos**
- Revisa si la clave fue usada por terceros.
- Revoca y regenera si hay actividad sospechosa.

---

## Buenas prácticas (prevención)

- Añade `.env` a `.gitignore` en todos tus repositorios desde el inicio.
- Mantén un archivo `env.example` o `env.sample` sin secretos que sirva como plantilla:

```
# .env.example
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
ENVIRONMENT=development
```

- Usa variables de entorno seguras en el entorno de despliegue (Heroku config vars, GitHub Actions Secrets, Azure App Settings, Vercel/Netlify env vars, etc.).
- No hardcodees secretos en el código fuente.
- Considera herramientas de secret management (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
- Implementa controles de pre-commit que detecten secrets (ej.: `pre-commit` + `detect-secrets` o `git-secrets`).

---

## Cómo comprobar si `.env` está siendo trackeado

```powershell
# Muestra si .env está en el índice (staged o tracked)
git ls-files --error-unmatch .env
# si el comando devuelve el filename, significa que está trackeado; si falla, no lo está
```

También puedes listar archivos trackeados y filtrar:

```powershell
git ls-files | Select-String ".env"
```

---

## Qué hacer si encuentras un `.env` público en GitHub

1. **Rotar inmediatamente** las claves comprometidas.
2. **Eliminar** el archivo del repo local (`git rm --cached .env`) y hacer commit/push.
3. **Reescribir historial** si es estrictamente necesario para borrar la clave (ver sección de `git filter-repo` o `BFG`).
4. **Auditar** logs del servicio para detectar accesos no autorizados.
5. **Enseñar la lección**: convertir este incidente en política: agregar `.env` y checks automáticos al pipeline.

---

## Ejemplo: flujo seguro para compartir proyecto con equipo (recomendado)

1. Crear `.env` localmente con claves de test.
2. Añadir `.env` a `.gitignore` y commitear ese cambio.
3. Crear `env.example` sin secretos y commitearlo.
4. Para despliegue o CI, configurar variables en el servicio (GitHub Secrets, Azure, etc.).
5. Usar `dotenv` o `pydantic.BaseSettings` para leer variables en tiempo de ejecución.

---

## Herramientas útiles

- `git-secrets` — bloquea commits que contienen patrones de secretos.
- `detect-secrets` (Yelp) — detector de secretos para usar en CI.
- `pre-commit` — framework para ejecutar checks antes del commit.
- `BFG Repo-Cleaner` — herramienta fácil para eliminar ficheros del historial.
- `git filter-repo` — herramienta moderna para reescribir historial de Git.

---

## Resumen breve para compartir con alumnos

- Nunca subas `.env` a repositorios públicos.
- Añade `.env` a `.gitignore` de inmediato.
- Si lo subiste, elimina el fichero del índice, rota las claves y considera reescribir el historial.
- Usa `env.example` para compartir la estructura sin revelar secretos.
- Automatiza la detección de secretos con hooks o CI.
