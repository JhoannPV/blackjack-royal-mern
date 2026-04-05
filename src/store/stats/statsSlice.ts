import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PlayerStats, RankingJugador } from '../../hooks/types/StoreTypes';

interface StatsState {
    isLoadingStats: boolean;
    isLoadingRanking: boolean;
    ganadas: number;
    perdidas: number;
    empatadas: number;
    totalPartidas: number;
    ranking: RankingJugador[];
    errorMessage: string | undefined;
}

const initialState: StatsState = {
    isLoadingStats: false,
    isLoadingRanking: false,
    ganadas: 0,
    perdidas: 0,
    empatadas: 0,
    totalPartidas: 0,
    ranking: [],
    errorMessage: undefined,
};

export const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        onStartLoadingStats: (state) => {
            state.isLoadingStats = true;
            state.errorMessage = undefined;
        },
        onStartLoadingRanking: (state) => {
            state.isLoadingRanking = true;
            state.errorMessage = undefined;
        },
        onSetPlayerStats: (state, { payload }: PayloadAction<PlayerStats>) => {
            state.isLoadingStats = false;
            state.ganadas = payload.ganadas;
            state.perdidas = payload.perdidas;
            state.empatadas = payload.empatadas;
            state.totalPartidas = payload.totalPartidas;
        },
        onSetRanking: (state, { payload }: PayloadAction<RankingJugador[]>) => {
            state.isLoadingRanking = false;
            state.ranking = payload;
        },
        onSetStatsError: (state, { payload }: PayloadAction<string | undefined>) => {
            state.isLoadingStats = false;
            state.isLoadingRanking = false;
            state.errorMessage = payload;
        },
        onClearStats: () => initialState,
    },
});

export const {
    onStartLoadingStats,
    onStartLoadingRanking,
    onSetPlayerStats,
    onSetRanking,
    onSetStatsError,
    onClearStats,
} = statsSlice.actions;
