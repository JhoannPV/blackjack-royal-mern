import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../../hooks';
import './user-menu.css';

interface UserMenuProps {
    mostrarCasino?: boolean;
    mostrarEstadisticas?: boolean;
    mostrarEstadisticasGlobales?: boolean;
}

export const UserMenu = ({
    mostrarCasino = true,
    mostrarEstadisticas = true,
    mostrarEstadisticasGlobales = true,
}: UserMenuProps) => {
    const navigate = useNavigate();
    const { user, startLogout } = useAuthStore();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const inicialUsuario = useMemo(() => {
        const nombre = typeof user?.name === 'string' ? user.name.trim() : '';
        return nombre ? nombre.charAt(0).toUpperCase() : '?';
    }, [user]);

    const nombreUsuario = useMemo(() => {
        return typeof user?.name === 'string' && user.name.trim() ? user.name : 'Jugador';
    }, [user]);

    const navegar = (path: string) => {
        setMenuAbierto(false);
        navigate(path);
    };

    const cerrarSesion = () => {
        startLogout();
        setMenuAbierto(false);
        navigate('/auth/login', { replace: true });
    };

    useEffect(() => {
        if (!menuAbierto) {
            return;
        }

        const handleClickFuera = (evento: MouseEvent) => {
            if (!menuRef.current) {
                return;
            }

            if (!menuRef.current.contains(evento.target as Node)) {
                setMenuAbierto(false);
            }
        };

        document.addEventListener('mousedown', handleClickFuera);

        return () => {
            document.removeEventListener('mousedown', handleClickFuera);
        };
    }, [menuAbierto]);

    return (
        <div className="profile-corner" ref={menuRef}>
            <button
                type="button"
                className="profile-trigger"
                aria-label="Abrir menu de perfil"
                aria-expanded={menuAbierto}
                onClick={() => setMenuAbierto((estado) => !estado)}
            >
                {inicialUsuario}
            </button>

            {menuAbierto && (
                <div className="profile-menu" role="menu" aria-label="Menu de usuario">
                    <p className="profile-name">{nombreUsuario}</p>

                    {mostrarCasino && (
                        <button type="button" className="profile-action profile-action-secondary" onClick={() => navegar('/casino')}>
                            Ir al casino
                        </button>
                    )}

                    {mostrarEstadisticas && (
                        <button
                            type="button"
                            className="profile-action profile-action-secondary"
                            onClick={() => navegar('/estadisticas')}
                        >
                            Mis estadisticas
                        </button>
                    )}

                    {mostrarEstadisticasGlobales && (
                        <button
                            type="button"
                            className="profile-action profile-action-secondary"
                            onClick={() => navegar('/estadisticas-globales')}
                        >
                            Estadisticas globales
                        </button>
                    )}

                    <button type="button" className="profile-action" onClick={cerrarSesion}>
                        Cerrar sesion
                    </button>
                </div>
            )}
        </div>
    );
};
