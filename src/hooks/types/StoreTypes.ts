import { StoreGlobal } from "../../store";

type AppStore = ReturnType<typeof StoreGlobal.getInstance>

export type RootState = ReturnType<AppStore["getState"]>

export interface LoginParams {
    username: string;
    password: string;
}

export interface RegisterParams {
    name: string;
    username: string;
    password: string;
}

export interface ErrorResponse {
    response?: {
        data?: {
            error?: string;
            message?: string;
            errors?: Record<string, { msg?: string }>;
        }
    }
}

export type CategoriaFiltro = 'todas' | 'ganadas' | 'perdidas' | 'empatadas';

export interface RankingJugador {
    posicion: number;
    nombre: string;
    usuario: string;
    ganadas: number;
    perdidas: number;
    empatadas: number;
    total: number;
    efectividad: number;
}

export interface PlayerStats {
    ganadas: number;
    perdidas: number;
    empatadas: number;
    totalPartidas: number;
}