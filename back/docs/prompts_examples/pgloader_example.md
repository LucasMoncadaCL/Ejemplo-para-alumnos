# Ejemplo: Configuración pgloader (plantilla)

Este archivo muestra una plantilla `pgloader` para migrar la tabla `tasks` desde Oracle a PostgreSQL.

> Nota: adaptar conexiones (user/password@host) y nombres de tablas según el entorno.

```lisp
LOAD DATABASE
     FROM oracle://oracle_user:oracle_pass@oracle_host:1521/ORCLCDB
     INTO postgresql://pg_user:pg_pass@pg_host:5432/pg_db

 WITH include drop, create tables, create indexes, reset sequences

 CAST
     type raw to uuid using zero-pad,
     type number when (precision = 1) to boolean using zero-one

 SET work_mem to '16MB', maintenance_work_mem to '512 MB'

 BEFORE LOAD DO
    $$ alter schema public owner to pg_user; $$;

 INTO postgresql
     TARGET SCHEMA public

  INCLUDING ONLY TABLE NAMES MATCHING 'tasks'
;
```

Explicaciones:
- `CAST` aquí es indicativo: es probable que necesites un script previo para transformar `RAW(16)` a texto UUID o usar una función custom en pgloader.
- `number precision 1` a boolean: hacer transformación explícita si los valores son 0/1.

Comandos para ejecutar pgloader (ejemplo):

```bash
pgloader pgloader_tasks.conf
```

---

## Ejecución en Windows (PowerShell) y notas prácticas

Si trabajas en Windows y quieres lanzar `pgloader` desde PowerShell, generalmente tendrás `pgloader` instalado como ejecutable (ej. `pgloader.exe`) o en WSL. Aquí un ejemplo usando WSL o un binario en PATH:

```powershell
# Si usas WSL y tienes pgloader en Linux:
wsl pgloader /mnt/c/path/to/pgloader_tasks.conf

# Si tienes pgloader.exe en PATH (build nativo o paquete):
pgloader C:\path\to\pgloader_tasks.conf
```

Notas prácticas:
- `pgloader` necesita un conector JDBC/Oracle o acceso directo al listener Oracle; valida que el host/puerto/credenciales sean accesibles desde la máquina donde ejecutas `pgloader`.
- Si `RAW(16)` está en formato binario, considera un paso previo para convertir a texto UUID o usar una función `CAST` personalizada en `pgloader`.

Capturas sugeridas:
- `pgloader_run_output.png` — salida de la ejecución mostrando tablas migradas y número de filas.
- `pgloader_conf_snippet.png` — fragmento del archivo `pgloader_tasks.conf` con la sección `CAST`.
