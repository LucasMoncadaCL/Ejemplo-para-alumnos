// src/App.jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AuthForm from './components/AuthForm'
import TasksView from './components/TasksView'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import Slide from '@mui/material/Slide'

function App() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>Cargando...</Typography>
            </Box>
        )
    }

    // 🔹 SIN sesión → login centrado con animación Slide
    if (!session) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom, rgba(129,140,248,0.18), transparent 55%), #020617',
                }}
            >
                <Container maxWidth="xs">
                    <Slide in direction="up" timeout={500}>
                        <Paper
                            elevation={8}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid rgba(148,163,184,0.4)',
                                backdropFilter: 'blur(12px)',
                                transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 12,
                                },
                            }}
                        >
                            <Typography variant="h4" component="h1" gutterBottom>
                                Demo FastAPI + Supabase
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Inicia sesión o regístrate para ver tus tareas.
                            </Typography>
                            <AuthForm />
                        </Paper>
                    </Slide>
                </Container>
            </Box>
        )
    }

    // 🔹 CON sesión → vista de tareas con Fade in
    return (
        <Fade in timeout={450}>
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                >
                    <Box>
                        <Typography variant="h4" component="h1">
                            Tus tareas
                        </Typography>
                        <Chip
                            label="Sesión activa"
                            size="small"
                            sx={{ mt: 1, backgroundColor: 'grey.900', borderRadius: 999 }}
                        />
                    </Box>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={async () => {
                            await supabase.auth.signOut()
                        }}
                    >
                        Cerrar sesión
                    </Button>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Usuario: {session.user?.email}
                </Typography>

                <TasksView session={session} />
            </Container>
        </Fade>
    )
}

export default App
