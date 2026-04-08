import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BlackjackApi } from '../api';
import type { ErrorResponse, PlayerStats, RankingJugador, RootState } from './types/StoreTypes';
import {
    onClearStats,
    onSetPlayerStats,
    onSetRanking,
    onSetStatsError,
    onStartLoadingRanking,
    onStartLoadingStats,
} from '../store';

type RegisterResultBackend = 'ganada' | 'perdida' | 'empatada';

const statsDefault: PlayerStats = {
    ganadas: 0,
    perdidas: 0,
    empatadas: 0,
    totalPartidas: 0,
};

export const useStatsStore = () => {
    const dispatch = useDispatch();
    const api = BlackjackApi.getInstance();

    const {
        isLoadingStats,
        isLoadingRanking,
        ganadas,
        perdidas,
        empatadas,
        totalPartidas,
        ranking,
        errorMessage,
    } = useSelector((state: RootState) => state.stats);

    const startLoadMyStats = useCallback(async () => {
        dispatch(onStartLoadingStats());

        try {
            const { data } = await api.get<PlayerStats>('/stats/me');
            dispatch(onSetPlayerStats({
                ganadas: data.ganadas ?? 0,
                perdidas: data.perdidas ?? 0,
                empatadas: data.empatadas ?? 0,
                totalPartidas: data.totalPartidas ?? 0,
            }));
        } catch (error) {
            const { response } = error as ErrorResponse;
            dispatch(onSetPlayerStats(statsDefault));
            dispatch(onSetStatsError(response?.data?.error || 'No se pudieron cargar tus estadisticas.'));
        }
    }, [api, dispatch]);

    const startRegisterResult = useCallback(async (resultado: RegisterResultBackend) => {
        dispatch(onStartLoadingStats());

        try {
            const { data } = await api.post<PlayerStats>('/stats/register-result', { resultado });
            dispatch(onSetPlayerStats({
                ganadas: data.ganadas ?? 0,
                perdidas: data.perdidas ?? 0,
                empatadas: data.empatadas ?? 0,
                totalPartidas: data.totalPartidas ?? 0,
            }));
        } catch (error) {
            const { response } = error as ErrorResponse;
            dispatch(onSetStatsError(response?.data?.error || 'No se pudo registrar el resultado.'));
        }
    }, [api, dispatch]);

    const startLoadGlobalRanking = useCallback(async () => {
        dispatch(onStartLoadingRanking());

        try {
            const { data } = await api.get<{ ranking: RankingJugador[] }>('/stats/global');
            dispatch(onSetRanking(Array.isArray(data.ranking) ? data.ranking : []));
        } catch (error) {
            const { response } = error as ErrorResponse;
            dispatch(onSetRanking([]));
            dispatch(onSetStatsError(response?.data?.error || 'No se pudo cargar el ranking global.'));
        }
    }, [api, dispatch]);

    const clearStats = useCallback(() => {
        dispatch(onClearStats());
    }, [dispatch]);

    return {
        isLoadingStats,
        isLoadingRanking,
        ganadas,
        perdidas,
        empatadas,
        totalPartidas,
        ranking,
        errorMessage,

        startLoadMyStats,
        startRegisterResult,
        startLoadGlobalRanking,
        clearStats,
    };
};
