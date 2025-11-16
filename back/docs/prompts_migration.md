# Plantillas de prompts para migración Oracle → PostgreSQL (uso con LLMs)

Este archivo contiene prompts reutilizables para pedir a modelos de lenguaje que te ayuden
a convertir DDL, triggers, procedimientos, y generar scripts de migración de datos.
Están pensados para uso en hackathons: rapidez, iteración y validación.

Instrucciones generales antes de usar un prompt:
- Indica claramente la versión de Oracle y de PostgreSQL objetivo (p. ej. Oracle 21c → PostgreSQL 15).
- Pega solo el fragmento necesario (tabla, trigger, procedimiento) para mantener el prompt corto.
- Pide siempre una explicación línea a línea de lo que cambió.
- Indica que el resultado es un borrador y debe validarse en entorno de pruebas.

---

## Prompt corto: convertir DDL

Prompt:

"Convierte este DDL de Oracle 21c a PostgreSQL 15. Mantén claves primarias, foráneas, índices y defaults.
Explica brevemente cada cambio y marca cualquier decisión ambigua que deba revisar manualmente. Devuélvelo en un bloque SQL listo para ejecutar en PostgreSQL." 

Inserta después el DDL Oracle (solo la tabla o fragmento).

Ejemplo de uso:
```
-- Prompt + DDL_ORACLE
```

Salida esperada:
- DDL PostgreSQL con tipos mapeados (NUMBER→NUMERIC/INTEGER, VARCHAR2→VARCHAR, CLOB→TEXT, RAW(16)→UUID o BYTEA).
- Comentarios sobre lo que revisar (triggers, secuencias, índices compuestos).

---

## Prompt detallado: convertir trigger/procedimiento PL/SQL

Prompt:

"Convierte este trigger/procedimiento PL/SQL (Oracle) a PL/pgSQL (Postgres). Explica las diferencias funcionales y cómo adaptar las funciones auxiliares. Si hay partes que no se pueden convertir directamente, sugiere un diseño alternativo (por ejemplo, mover lógica a la capa de aplicación)." 

Adjuntar cuerpo del trigger/proc.

Salida esperada:
- Código PL/pgSQL con `CREATE FUNCTION` + `CREATE TRIGGER` o explicación para migrar la lógica fuera de la DB.
- Notas sobre diferencias de comportamiento (ej.: manejo de `:new`/`:old`, paquetes, tipos específicos).

---

## Prompt para migración de datos (pgloader)

Prompt:

"Genera un archivo de configuración `pgloader` que copie la tabla `tasks` desde Oracle a PostgreSQL.
Mapea `RAW(16)` a `uuid`, `NUMBER(1)` a `boolean`, y `TIMESTAMP WITH TIME ZONE` a `timestamptz`.
Incluye instrucciones para ejecutar `pgloader` y cualquier pre-procesamiento necesario." 

Salida esperada:
- Config `pgloader` (fuente Oracle, destino PostgreSQL) con `CAST` para tipos y opciones de batch.
- Comando de ejecución y notas para verificar integridad.

---

## Prompt para generar `COPY` + CSV export/import

Prompt:

"Crea un proceso en pasos para exportar la tabla `tasks` desde Oracle a CSV, transformar filas que tengan UUID en formato textual y luego importar con `COPY` en PostgreSQL. Incluye ejemplos de comandos SQL/OS y un `COPY` statement final." 

Salida esperada:
- Comandos `SQL*Plus` o `sqlcl` / `expdp`-like para exportar a CSV, instrucciones de transformación (sed/awk/python) y el `COPY tasks (col1,...) FROM 'file.csv' CSV HEADER;` para Postgres.

---

## Prompt para validar integridad después de migrar

Prompt:

"Genera un conjunto de queries SQL para validar que la migración de la tabla `tasks` fue correcta.
Incluye: conteo de filas, conteo de nulos en columnas críticas, checksum por fila (MD5 concat) y muestra 5 filas aleatorias comparadas entre Oracle y PostgreSQL." 

Salida esperada:
- Queries de comprobación en Oracle y en PostgreSQL más pasos para comparar resultados (rowcount, sample rows, checksums).

---

## Prompt para revisar políticas RLS y seguridad

Prompt:

"Dado este set de policies RLS/privileges en Postgres, analiza su equivalencia en Oracle o su reemplazo a nivel de aplicación. Indica riesgos de seguridad y pruebas mínimas (smoke tests) que debemos ejecutar." 

Salida esperada:
- Explicación de RLS, ejemplo de políticas equivalentes o cómo implementar la misma seguridad a nivel de aplicación.

---

## Prompt para generar pruebas automáticas (smoke tests)

Prompt:

"Genera un conjunto de tests SQL (o `pytest` con `psycopg2`) que verifiquen la tabla `tasks` después de la migración: 1) conteo de filas iguales, 2) al menos 3 checksums por muestra, 3) integridad de FK con `auth.users`." 

Salida esperada:
- Código `pytest` ejemplo o scripts SQL para ejecutar las comprobaciones automáticamente.

---

## Prompt para rollback y plan de contingencia

Prompt:

"Genera un plan corto de rollback si la migración falla: incluye pasos para restaurar desde backup, cómo volver a la versión anterior y qué logs/alerts revisar." 

Salida esperada:
- Procedimiento paso a paso para restauración usando `pg_restore` o backups nativos y verificación post-rollback.

---

## Prompts de seguimiento / refinamiento

- "Optimiza este DDL generado por la IA: añade índices sugeridos para consultas frecuentes sobre `user_id` y `created_at` y explica por qué." 
- "Dame 5 tests de regresión que debemos añadir al CI para asegurar que la migración no rompe la app." 
- "Convierte este mapping en un archivo JSON con pares `oracle_type -> postgres_type` para usar en un script automatizado." 

---

## Recomendaciones de uso con LLMs durante el hackathon

- Mantén prompts concretos y enfocados (1 artefacto por prompt).
- Guarda prompts efectivos en `docs/prompts_migration.md` y reutilízalos.
- Comprueba siempre en un entorno de pruebas antes de ejecutar en producción.
- Automatiza comprobaciones básicas después de cada iteración (counts, checksums, 5 random row checks).
- Añade al prompt el contexto: versiones, convenciones de tipos, y cualquier restricción (ej.: no cambiar nombres de columnas).

---

### Prompt adaptado para alumnos que usan solo Data Modeler + SQL Developer

Prompt sugerido:

"Soy un alumno que sólo usa Oracle Data Modeler y Oracle SQL Developer. He exportado el DDL desde Data Modeler y los datos en CSV desde SQL Developer. Convierte el DDL Oracle a PostgreSQL listo para ejecutar en Supabase/Postgres, y proporciona instrucciones paso a paso para importar los CSV usando `COPY`. Indica qué transformaciones manuales debo revisar luego en SQL Developer si algo falla. Aquí está el DDL: [PEGA_DDL_AQUI] y el listado de archivos CSV: [tabla1.csv, tabla2.csv]."

Respuesta esperada del modelo:

- DDL convertido a PostgreSQL (bloque SQL listo para ejecutar en `psql` o el editor SQL de Supabase).
- Comandos `COPY` para cada CSV, por ejemplo: `COPY tasks(id, name, created_at) FROM '/path/tasks.csv' CSV HEADER;` con formato de fecha sugerido.
- Notas sobre tipos: por ejemplo, transformar `NUMBER` sin scale a `INTEGER`, `NUMBER(p,s)` a `NUMERIC(p,s)`, `VARCHAR2` a `VARCHAR`, y recomendaciones para `RAW(16)` → `uuid` o `BYTEA`.
- Pasos para extraer DDL en Data Modeler y exportar CSV en SQL Developer (breve checklist):
	- En Data Modeler: `File` → `Export` → `DDL File` → seleccionar objetos → guardar `model.sql`.
	- En SQL Developer: clic derecho en la tabla → `Export` → elegir `CSV` → marcar `Header` → guardar `tabla.csv`.
- Sugerencias de validación post-import: conteo de filas, checksums MD5 por muestra y verificación de FK.

Incluye también un pequeño checklist de riesgos comunes y cómo resolverlos si el `COPY` falla (encodings, comillas, formatos de fecha, separadores).