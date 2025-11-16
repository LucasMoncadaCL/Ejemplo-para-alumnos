# Ejemplo: Prompt y respuesta — Conversión Trigger / PL/SQL → PL/pgSQL

## Prompt de ejemplo

"Convierte este trigger PL/SQL de Oracle a un trigger equivalente en PostgreSQL (PL/pgSQL). Explica los cambios y cualquier limitación." 

### Trigger (entrada - Oracle)
```sql
CREATE OR REPLACE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
BEGIN
  :new.updated_at := SYSTIMESTAMP;
END;
/
```

## Respuesta (ejemplo generado por LLM)

```sql
-- PL/pgSQL equivalente
CREATE OR REPLACE FUNCTION trg_tasks_updated_at_fn()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION trg_tasks_updated_at_fn();

-- Notas:
-- 1) Oracle usa :new/:old; en PL/pgSQL usamos NEW/OLD.
-- 2) SYSTIMESTAMP ~ CURRENT_TIMESTAMP (revisar zona horaria y precision si importa).
```

## Qué validar
- Comprobar permisos para crear triggers en Postgres.
- Verificar precisión de timestamp y si se necesita `timestamptz`.
- Ejecutar pruebas que actualicen filas y revisar `updated_at`.

---

Este ejemplo es corto; para procedimientos complejos, pide a la IA que divida la tarea en funciones más pequeñas.

---

## Instrucciones y ejemplos (Windows / PowerShell)

Si trabajas en Windows y quieres aplicar el trigger convertido desde PowerShell usando `psql`, aquí tienes un ejemplo:

```powershell
$pgHost = 'db.example.com'
$pgPort = 5432
$pgUser = 'postgres'
$pgDb = 'mi_db'
$triggerFile = 'C:\path\to\trg_tasks_updated_at.sql'

# Ejecutar el archivo SQL que contiene la función y el trigger
psql -h $pgHost -p $pgPort -U $pgUser -d $pgDb -f $triggerFile
```

Notas prácticas:
- Revisa que el rol usado tenga permisos `CREATE` para funciones y triggers en el esquema destino.
- Si el trigger depende de paquetes o funciones auxiliares, migra esas funciones primero.

Capturas sugeridas:
- `trigger_oracle_example.png` — trigger original en Oracle.
- `psql_create_trigger.png` — salida en PowerShell tras ejecutar `psql -f trg_tasks_updated_at.sql` mostrando que la función/trigger se crearon.