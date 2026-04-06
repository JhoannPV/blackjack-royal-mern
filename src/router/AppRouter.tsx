import { Navigate, Route, Routes } from "react-router";
import { Casino, Estadisticas, EstadisticasGlobales, Login } from "../blackjack-royal";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";
import "./AppRouter.css";

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        if (status !== 'checking') {
            return;
        }
        checkAuthToken();
    }, [status, checkAuthToken]);

    if (status === 'checking') {
        return (
            <section className="router-loading" aria-label="Cargando aplicacion">
                <div className="router-loading__card">
                    <span className="router-loading__badge">Blackjack Royal</span>
                    <h2 className="router-loading__title">Preparando tu mesa</h2>
                    <p className="router-loading__text">Estamos validando tu sesion.</p>
                    <div className="router-loading__bar" aria-hidden="true" />
                </div>
            </section>
        )
    }
    return (
        <>
            <Routes>
                {
                    (status === 'not-authenticated')
                        ? (
                            <>
                                <Route path="/auth/*" element={<Login />} />
                                <Route path="*" element={<Navigate to="/auth/login" replace />} />
                            </>
                        )
                        : (
                            <>
                                <Route path="/" element={<Casino />} />
                                <Route path="/casino" element={<Casino />} />
                                <Route path="*" element={<Navigate to="/casino" replace />} />
                                <Route path="/estadisticas" element={<Estadisticas />} />
                                <Route path="/estadisticas-globales" element={<EstadisticasGlobales />} />
                            </>
                        )
                }
            </Routes>
        </>
    );
}