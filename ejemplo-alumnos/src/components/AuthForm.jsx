// src/components/AuthForm.jsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const { error } = await supabase.auth.signUp({ email, password })

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        setMessage(
            'Revisa tu correo para confirmar tu cuenta (según configuración de Supabase).'
        )
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        setMessage('Sesión iniciada correctamente.')
    }

    return (
        <form>
            <Stack spacing={1.5}>
                <TextField
                    label="Email"
                    type="email"
                    size="small"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alumno@duoc.cl"
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    size="small"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                />

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        onClick={handleLogin}
                        sx={{
                            transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        {loading ? (
                            <>
                                Iniciando...
                                <CircularProgress
                                    size={16}
                                    sx={{ ml: 1, color: 'inherit' }}
                                />
                            </>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        disabled={loading}
                        onClick={handleSignUp}
                    >
                        {loading ? 'Procesando...' : 'Registrarse'}
                    </Button>
                </Stack>

                {message && (
                    <Alert severity="success" variant="outlined">
                        {message}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" variant="outlined">
                        {error}
                    </Alert>
                )}
            </Stack>
        </form>
    )
}
