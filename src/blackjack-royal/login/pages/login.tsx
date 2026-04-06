import { useEffect, useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../hooks';
import './login.css';

export const Login = () => {
    const navigate = useNavigate();
    const { status, errorMessage, startLogin, startRegister } = useAuthStore();

    const [modoRegistro, setModoRegistro] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [mensajeInfo, setMensajeInfo] = useState('');

    const [loginUsuario, setLoginUsuario] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registroNombre, setRegistroNombre] = useState('');
    const [registroUsuario, setRegistroUsuario] = useState('');
    const [registroPassword, setRegistroPassword] = useState('');

    const cargando = status === 'checking';

    useEffect(() => {
        if (status === 'authenticated') {
            navigate('/casino', { replace: true });
        }
    }, [navigate, status]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setMensajeError(errorMessage || '');
        }, 0);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [errorMessage]);

    const activarModoRegistro = () => {
        setModoRegistro(true);
        setMensajeError('');
        setMensajeInfo('');
    };

    const activarModoLogin = () => {
        setModoRegistro(false);
        setMensajeError('');
        setMensajeInfo('');
    };

    const enviarFormulario = async (evento: SyntheticEvent<HTMLFormElement>) => {
        evento.preventDefault();

        setMensajeError('');
        setMensajeInfo('');

        if (modoRegistro) {
            const nombre = registroNombre.trim();
            const usuario = registroUsuario.trim();
            const password = registroPassword.trim();

            if (!nombre || !usuario || !password) {
                setMensajeError('Completa todos los campos del registro.');
                return;
            }

            if (nombre.length < 2 || usuario.length < 3 || password.length < 6) {
                setMensajeError('Verifica longitudes minimas: nombre 2, usuario 3 y contrasena 6.');
                return;
            }

            const ok = await startRegister({ name: nombre, username: usuario, password });
            if (ok) {
                setMensajeInfo('Registro exitoso. Entrando al casino...');
            }
            return;
        }

        const usuario = loginUsuario.trim();
        const password = loginPassword.trim();

        if (!usuario || !password) {
            setMensajeError('Completa los campos para iniciar sesion.');
            return;
        }

        await startLogin({ username: usuario, password });
    };

    return (
        <section className="auth-shell" aria-label="Autenticacion de usuario">
            <article className="auth-card">
                <header className="auth-header">
                    <h1>
                        <strong>Blackjack Royal</strong>
                    </h1>
                    <p>Inicia sesion o registrate para entrar al casino</p>
                </header>

                <div className="auth-tabs" role="tablist" aria-label="Tipo de acceso">
                    <button type="button" role="tab" className={`tab-btn ${!modoRegistro ? 'active' : ''}`} onClick={activarModoLogin}>
                        Iniciar sesion
                    </button>
                    <button type="button" role="tab" className={`tab-btn ${modoRegistro ? 'active' : ''}`} onClick={activarModoRegistro}>
                        Registrarse
                    </button>
                </div>

                <form className="auth-form" onSubmit={enviarFormulario}>
                    {modoRegistro ? (
                        <>
                            <label>
                                Nombre
                                <input
                                    type="text"
                                    name="registroNombre"
                                    placeholder="Tu nombre"
                                    value={registroNombre}
                                    onChange={(e) => setRegistroNombre(e.target.value)}
                                    disabled={cargando}
                                />
                            </label>

                            <label>
                                Usuario
                                <input
                                    type="text"
                                    name="registroUsuario"
                                    placeholder="Tu usuario"
                                    value={registroUsuario}
                                    onChange={(e) => setRegistroUsuario(e.target.value)}
                                    disabled={cargando}
                                />
                            </label>

                            <label>
                                Contrasena
                                <input
                                    type="password"
                                    name="registroPassword"
                                    placeholder="Tu contrasena"
                                    value={registroPassword}
                                    onChange={(e) => setRegistroPassword(e.target.value)}
                                    disabled={cargando}
                                />
                            </label>
                        </>
                    ) : (
                        <>
                            <label>
                                Usuario
                                <input
                                    type="text"
                                    name="loginUsuario"
                                    placeholder="Tu usuario"
                                    value={loginUsuario}
                                    onChange={(e) => setLoginUsuario(e.target.value)}
                                    disabled={cargando}
                                />
                            </label>

                            <label>
                                Contrasena
                                <input
                                    type="password"
                                    name="loginPassword"
                                    placeholder="Tu contrasena"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    disabled={cargando}
                                />
                            </label>
                        </>
                    )}

                    {mensajeError && <p className="feedback error">{mensajeError}</p>}
                    {mensajeInfo && <p className="feedback info">{mensajeInfo}</p>}

                    <button className="submit-btn" type="submit" disabled={cargando}>
                        {cargando ? 'Procesando...' : modoRegistro ? 'Registrarme e ingresar' : 'Ingresar al casino'}
                    </button>
                </form>
            </article>
        </section>
    );
};