# Ejemplo: Exportar desde Oracle a CSV y usar `COPY` en PostgreSQL

Flujo sugerido (pasos):

1. Exportar desde Oracle a CSV (ejemplo con `sqlplus` o `sqlcl`):

```bash
# Con sqlcl o sqlplus: ajustar formato y separador
sql -s user/pass@orcl <<SQL
SET FEEDBACK OFF
SET HEADING OFF
SET PAGESIZE 0
SET LINESIZE 1000
SET TRIMSPOOL ON
SPOOL tasks.csv
SELECT id || ',' || -- construir CSV adecuadamente
       -- mejor usar script que maneje comillas y comas en texto
FROM tasks;
SPOOL OFF
EXIT
SQL
```

2. Transformar campos si es necesario (ej.: RAW(16) -> uuid textual) con un script Python pequeño:

```python
# transformar_raw_to_uuid.py
import csv
from binascii import hexlify

with open('tasks_raw.csv','rb') as inf, open('tasks.csv','w', newline='') as outf:
    reader = csv.DictReader(inf)
    writer = csv.DictWriter(outf, fieldnames=reader.fieldnames)
    writer.writeheader()
    for row in reader:
        # ejemplo hipotético: row['user_id_raw'] -> convertir
        # row['user_id'] = convert_raw_to_uuid(row['user_id_raw'])
        writer.writerow(row)
```

3. Importar en PostgreSQL con `COPY`:

```sql
COPY public.tasks(id, user_id, titulo, descripcion, completada, created_at, updated_at)
FROM '/path/to/tasks.csv' WITH (FORMAT csv, HEADER true);
```

4. Validaciones rápidas:
- `SELECT count(*) FROM tasks;`
- `SELECT count(*) FROM tasks WHERE user_id IS NULL;`

---

Nota: la exportación desde Oracle a CSV debe cuidar comillas, escapes y saltos de línea en `descripcion`. Por eso en muchos casos conviene usar herramientas que generen CSV correctamente (Oracle SQL Developer, scripts Python con cx_Oracle, etc.).

---

## Ejemplos para Windows (PowerShell) y capturas sugeridas

Si trabajas en Windows y prefieres usar PowerShell para ejecutar comandos y verificar archivos antes de importarlos, aquí tienes ejemplos útiles.

- Exportar desde Oracle usando `sql` (SQLcl) en PowerShell (ajusta `user`, `host`, `service` y `password`):

```powershell
# Con SQLcl instalado y en PATH
$oracleUser = 'user'
$oracleHost = 'orcl_host:1521/ORCLCDB'
$oraclePass = 'mypassword'

# Comando SQLcl para spooling simple (mejor usar export desde SQL Developer para CSV robusto)
sql -s $oracleUser/$oraclePass@$oracleHost @export_tasks.sql
```

# `export_tasks.sql` debería contener la lógica para formatear CSV correctamente o llamar a una utilidad que lo haga.

- Importar en PostgreSQL usando `psql` y `\copy` (cliente lee el archivo local):

```powershell
$pgHost = 'db.example.com'
$pgPort = 5432
$pgUser = 'postgres'
$pgDb = 'mi_db'
$csvPath = 'C:\path\to\tasks.csv'

# Usando psql y el meta-comando \copy (se ejecuta dentro de psql, por eso usamos -c y escapamos la barra)
psql -h $pgHost -p $pgPort -U $pgUser -d $pgDb -c "\copy public.tasks(id, user_id, titulo, descripcion, completada, created_at, updated_at) FROM '$csvPath' CSV HEADER;"
```

Notas sobre PowerShell y rutas:
- En PowerShell las rutas usan `\\` o `/` y si pones la ruta entre comillas simples en el `\copy` evita que PowerShell expanda variables inesperadas.
- Si tienes problemas de encoding, abre el CSV en un editor que muestre la codificación y conviértelo a UTF-8 sin BOM.

Capturas de pantalla sugeridas (sólo nombres de archivo):
- `sql_developer_export_dialog.png` — diálogo de exportación en SQL Developer (mostrar opciones CSV y header).
- `csv_preview_in_excel.png` — vista previa del CSV en Excel/Notepad++ para verificar encoding y separadores.
- `psql_copy_example.png` — resultado en la consola psql mostrando el número de filas importadas.