import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useStatsStore } from '../../../hooks';
import { UserMenu } from '../../shared/components/user-menu/UserMenu';
import './estadisticas.css';

export const Estadisticas = () => {
    const navigate = useNavigate();
    const { ganadas, perdidas, empatadas, totalPartidas, startLoadMyStats } = useStatsStore();

    useEffect(() => {
        void startLoadMyStats();
    }, [startLoadMyStats]);

    return (
        <section className="stats-page" aria-label="Estadisticas del jugador">
            <div className="stats-shell">
                <UserMenu mostrarCasino mostrarEstadisticas={false} mostrarEstadisticasGlobales />

                <header className="stats-header">
                    <h1>Mis Estadisticas</h1>
                    <p>Resumen acumulado de tus partidas de Blackjack Royal</p>
                </header>

                <div className="stats-grid">
                    <article className="stats-card wins">
                        <h2>Ganadas</h2>
                        <strong>{ganadas}</strong>
                    </article>

                    <article className="stats-card loses">
                        <h2>Perdidas</h2>
                        <strong>{perdidas}</strong>
                    </article>

                    <article className="stats-card draws">
                        <h2>Empatadas</h2>
                        <strong>{empatadas}</strong>
                    </article>
                </div>

                <article className="stats-total">
                    <h2>Total de partidas</h2>
                    <strong>{totalPartidas}</strong>
                </article>

                <button type="button" className="back-link" onClick={() => navigate('/casino')}>
                    Volver al casino
                </button>
            </div>
        </section>
    );
};