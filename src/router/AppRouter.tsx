import { Navigate, Route, Routes } from "react-router";
import { Casino, Estadisticas, EstadisticasGlobales, Login } from "../blackjack-royal";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        if (status === 'checking') {
            checkAuthToken();
        }
    }, [status, checkAuthToken])

    if (status === 'checking') {
        return (
            <h3>Cargando...</h3>
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