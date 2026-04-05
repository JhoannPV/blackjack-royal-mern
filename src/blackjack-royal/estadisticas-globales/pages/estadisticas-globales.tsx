import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStatsStore, type CategoriaFiltro } from '../../../hooks';
import { UserMenu } from '../../shared/components/user-menu/UserMenu';
import './estadisticas-globales.css';

export const EstadisticasGlobales = () => {
    const navigate = useNavigate();
    const { ranking, startLoadGlobalRanking } = useStatsStore();
    const [filtro, setFiltro] = useState('');
    const [categoria, setCategoria] = useState<CategoriaFiltro>('todas');

    useEffect(() => {
        void startLoadGlobalRanking();
    }, [startLoadGlobalRanking]);

    const rankingFiltrado = useMemo(() => {
        const termino = filtro.trim().toLowerCase();
        const base = [...ranking];

        if (categoria !== 'todas') {
            base.sort((a, b) => {
                if (b[categoria] !== a[categoria]) {
                    return b[categoria] - a[categoria];
                }

                return b.ganadas - a.ganadas;
            });
        }

        const porCategoria = base.filter((jugador) => {
            if (categoria === 'ganadas') {
                return jugador.ganadas > 0;
            }

            if (categoria === 'perdidas') {
                return jugador.perdidas > 0;
            }

            if (categoria === 'empatadas') {
                return jugador.empatadas > 0;
            }

            return true;
        });

        if (!termino) {
            return porCategoria;
        }

        return porCategoria.filter(
            (jugador) =>
                jugador.nombre.toLowerCase().includes(termino) ||
                jugador.usuario.toLowerCase().includes(termino)
        );
    }, [categoria, filtro, ranking]);

    const obtenerMedalla = (posicion: number) => {
        if (posicion === 1) {
            return '🥇';
        }

        if (posicion === 2) {
            return '🥈';
        }

        if (posicion === 3) {
            return '🥉';
        }

        return '•';
    };

    return (
        <section className="global-stats" aria-label="Ranking global de jugadores">
            <div className="global-shell">
                <UserMenu mostrarCasino mostrarEstadisticas mostrarEstadisticasGlobales={false} />

                <header className="global-header">
                    <h1>Estadisticas Globales</h1>
                    <p>Ranking total de jugadores por partidas ganadas y efectividad</p>
                </header>

                <div className="global-toolbar">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Filtrar por nombre o usuario"
                        value={filtro}
                        onChange={(evento) => setFiltro(evento.target.value)}
                    />

                    <label className="category-filter-label" htmlFor="categoryFilter">
                        Categoria
                    </label>
                    <select
                        id="categoryFilter"
                        className="category-filter"
                        value={categoria}
                        onChange={(evento) => setCategoria(evento.target.value as CategoriaFiltro)}
                    >
                        <option value="todas">Todas</option>
                        <option value="ganadas">Partidas ganadas</option>
                        <option value="perdidas">Partidas perdidas</option>
                        <option value="empatadas">Empates</option>
                    </select>
                </div>

                {ranking.length === 0 ? (
                    <article className="empty-state">
                        <h2>Aun no hay jugadores registrados</h2>
                        <p>Cuando los usuarios se registren y jueguen partidas, apareceran aqui.</p>
                    </article>
                ) : rankingFiltrado.length === 0 ? (
                    <article className="empty-state">
                        <h2>Sin coincidencias</h2>
                        <p>No hay jugadores que coincidan con el filtro actual.</p>
                    </article>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Top</th>
                                    <th>#</th>
                                    <th>Jugador</th>
                                    <th>Usuario</th>
                                    <th>Ganadas</th>
                                    <th>Perdidas</th>
                                    <th>Empatadas</th>
                                    <th>Total</th>
                                    <th>Efectividad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankingFiltrado.map((jugador) => (
                                    <tr key={jugador.usuario}>
                                        <td className="medal-cell">{obtenerMedalla(jugador.posicion)}</td>
                                        <td>{jugador.posicion}</td>
                                        <td>{jugador.nombre}</td>
                                        <td>{jugador.usuario}</td>
                                        <td>{jugador.ganadas}</td>
                                        <td>{jugador.perdidas}</td>
                                        <td>{jugador.empatadas}</td>
                                        <td>{jugador.total}</td>
                                        <td>{jugador.efectividad.toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <button type="button" className="back-btn" onClick={() => navigate('/casino')}>
                    Volver al casino
                </button>
            </div>
        </section>
    );
};