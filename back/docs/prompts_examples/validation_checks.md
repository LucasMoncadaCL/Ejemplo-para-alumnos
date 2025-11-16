# Ejemplo: Queries de validación post-migración

Estas queries sirven para validar rápidamente que la migración de `tasks` fue correcta.

## 1) Conteo total de filas
```sql
-- Oracle
SELECT COUNT(*) FROM tasks;

-- Postgres
SELECT COUNT(*) FROM public.tasks;
```

## 2) Conteo de nulos en columnas críticas
```sql
SELECT COUNT(*) FROM public.tasks WHERE user_id IS NULL OR titulo IS NULL;
```

## 3) Checksums por fila (ejemplo usando MD5 de concatenación de columnas)
```sql
-- Postgres: concatenar columnas y calcular md5
SELECT id, md5(coalesce(titulo,'') || '|' || coalesce(descripcion,'') || '|' || coalesce(completada::text,'')) as row_checksum
FROM public.tasks
ORDER BY id
LIMIT 5;
```

En Oracle usar funciones equivalentes (DBMS_OBFUSCATION_TOOLKIT MD5 o UTL_RAW + STANDARD_HASH según versión).

## 4) Muestras aleatorias comparadas
- Extraer 5 filas aleatorias de Oracle y 5 de Postgres y comparar los checksums o valores clave (id, titulo, user_id).

## 5) Integridad de FK
```sql
-- Comprobar que todas las user_id tienen referencia en auth.users (Postgres)
SELECT COUNT(*) FROM public.tasks t
LEFT JOIN auth.users u ON t.user_id = u.id
WHERE u.id IS NULL;
```

Si el resultado > 0 hay filas huérfanas; revisar si la migración de usuarios también se realizó.

