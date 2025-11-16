// src/components/TasksView.jsx
import { useEffect, useState } from 'react'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Grow from '@mui/material/Grow'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function TasksView({ session }) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')

    const accessToken = session?.access_token

    const fetchTasks = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            if (!res.ok) {
                throw new Error(`Error al cargar tareas: ${res.status}`)
            }

            const data = await res.json()
            setTasks(data)
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (accessToken) {
            fetchTasks()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!titulo.trim()) return

        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    titulo,
                    descripcion: descripcion || null,
                    completada: false,
                }),
            })

            if (!res.ok) {
                throw new Error('Error al crear tarea')
            }

            const nueva = await res.json()
            setTasks((prev) => [...prev, nueva])
            setTitulo('')
            setDescripcion('')
        } catch (err) {
            setError(err.message)
        }
    }

    const toggleComplete = async (task) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    completada: !task.completada,
                }),
            })

            if (!res.ok) {
                throw new Error('Error al actualizar tarea')
            }

            const updated = await res.json()
            setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDelete = async (taskId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            if (!res.ok) {
                throw new Error('Error al eliminar tarea')
            }

            setTasks((prev) => prev.filter((t) => t.id !== taskId))
        } catch (err) {
            setError(err.message)
        }
    }

    const total = tasks.length
    const completadas = tasks.filter((t) => t.completada).length

    return (
        <Stack spacing={3}>
            {/* Formulario */}
            <form onSubmit={handleCreate}>
                <Stack spacing={1.5}>
                    <Typography variant="h6">Nueva tarea</Typography>
                    <TextField
                        label="Título"
                        size="small"
                        fullWidth
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej: Terminar informe de la hackathon"
                    />
                    <TextField
                        label="Descripción (opcional)"
                        size="small"
                        fullWidth
                        multiline
                        minRows={2}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        sx={{
                            alignSelf: 'flex-start',
                            transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        Guardar tarea
                    </Button>
                </Stack>
            </form>

            {/* Estado */}
            {loading && (
                <Stack spacing={1}>
                    <LinearProgress />
                    <Typography variant="body2" color="text.secondary">
                        Cargando tus tareas...
                    </Typography>
                </Stack>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                <Typography variant="body2" color="text.secondary">
                    Tienes <strong>{total}</strong> tarea{total !== 1 ? 's' : ''}.{' '}
                    {total > 0 && (
                        <>
                            Completadas: <strong>{completadas}</strong>.
                        </>
                    )}
                </Typography>
            )}

            {/* Lista */}
            {loading && (
                <Grid container spacing={2}>
                    {Array.from(new Array(4)).map((_, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Skeleton
                                variant="rectangular"
                                height={130}
                                sx={{ borderRadius: 2 }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && !error && total === 0 && (
                <Typography variant="body2" color="text.secondary">
                    Aún no has creado tareas. Empieza agregando la primera arriba 👆
                </Typography>
            )}

            {!loading && !error && total > 0 && (
                <Grid container spacing={2}>
                    {tasks.map((task, index) => (
                        <Grid item xs={12} sm={6} key={task.id}>
                            <Grow
                                in
                                timeout={400}
                                style={{ transitionDelay: `${index * 80}ms` }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderColor: task.completada ? 'success.main' : 'divider',
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            sx={{ mb: 1 }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    textDecoration: task.completada
                                                        ? 'line-through'
                                                        : 'none',
                                                }}
                                            >
                                                {task.titulo}
                                            </Typography>
                                            {task.completada && (
                                                <Chip
                                                    label="Completada"
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Stack>
                                        {task.descripcion && (
                                            <Typography variant="body2" color="text.secondary">
                                                {task.descripcion}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <Button
                                            size="small"
                                            variant="text"
                                            onClick={() => toggleComplete(task)}
                                        >
                                            {task.completada
                                                ? 'Marcar pendiente'
                                                : 'Marcar completa'}
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="text"
                                            color="error"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Stack>
    )
}
