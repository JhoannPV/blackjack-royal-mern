import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStatsStore } from '../../../hooks';
import { ResultModal } from '../../shared/components/result-modal/ResultModal';
import { UserMenu } from '../../shared/components/user-menu/UserMenu';
import type { Carta, ResultadoJuego } from '../types/casinoGameTypes';
import { crearBaraja, rutaCarta, valorCarta } from '../utils/casinoDeck';
import './casino.css';

export const Casino = () => {
    const navigate = useNavigate();
    const {
        ganadas,
        perdidas,
        empatadas,
        totalPartidas,
        startLoadMyStats,
        startRegisterResult,
    } = useStatsStore();

    const [deck, setDeck] = useState<Carta[]>(() => crearBaraja());
    const [cartasJugador, setCartasJugador] = useState<Carta[]>([]);
    const [cartasComputadora, setCartasComputadora] = useState<Carta[]>([]);
    const [puntosJugador, setPuntosJugador] = useState(0);
    const [puntosComputadora, setPuntosComputadora] = useState(0);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [mensajeEstado, setMensajeEstado] = useState('Turno del jugador: pide una carta o plantate.');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitulo, setModalTitulo] = useState('Resultado');
    const [modalMensaje, setModalMensaje] = useState('');
    const [modalTipo, setModalTipo] = useState<'ganador' | 'perdedor' | 'empate'>('empate');
    const initRef = useRef(false);

    const puedePedir = !juegoTerminado;
    const puedeDetener = !juegoTerminado && cartasJugador.length > 0;

    const nuevoJuego = () => {
        setDeck(crearBaraja());
        setCartasJugador([]);
        setCartasComputadora([]);
        setPuntosJugador(0);
        setPuntosComputadora(0);
        setJuegoTerminado(false);
        setMensajeEstado('Turno del jugador: pide una carta o plantate.');
        setModalVisible(false);
    };

    useEffect(() => {
        if (initRef.current) {
            return;
        }

        initRef.current = true;
        void startLoadMyStats();
        const timeoutId = setTimeout(() => {
            nuevoJuego();
        }, 0);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [startLoadMyStats]);

    const tomarCarta = (mazo: Carta[]) => {
        if (mazo.length === 0) {
            throw new Error('No hay cartas en el deck');
        }

        const carta = mazo[mazo.length - 1];
        return {
            carta,
            mazoRestante: mazo.slice(0, -1),
        };
    };

    const notificarResultado = async (resultado: ResultadoJuego) => {
        let mensaje = 'Nadie gana 😞';
        let titulo = 'Empate';
        let tipo: 'ganador' | 'perdedor' | 'empate' = 'empate';

        if (resultado === 'jugador') {
            mensaje = 'Jugador gana';
            titulo = 'Ganaste';
            tipo = 'ganador';
            await startRegisterResult('ganada');
        }

        if (resultado === 'computadora') {
            mensaje = 'Computadora gana';
            titulo = 'Perdiste';
            tipo = 'perdedor';
            await startRegisterResult('perdida');
        }

        if (resultado === 'empate') {
            await startRegisterResult('empatada');
        }

        setMensajeEstado(`Resultado: ${mensaje}`);
        setModalTitulo(titulo);
        setModalMensaje(mensaje);
        setModalTipo(tipo);
        setModalVisible(true);
    };

    const determinarGanador = (nuevoPuntosJugador: number, nuevoPuntosComputadora: number): ResultadoJuego => {
        if (nuevoPuntosJugador > 21) {
            return 'computadora';
        }

        if (nuevoPuntosComputadora > 21) {
            return 'jugador';
        }

        if (nuevoPuntosJugador === 21 && nuevoPuntosComputadora === 21) {
            return 'empate';
        }

        return 'computadora';
    };

    const iniciarTurnoComputadora = async (puntosJugadorActual: number, mazoActual: Carta[], cartasComputadoraActual: Carta[]) => {
        let mazo = [...mazoActual];
        const cartasComp = [...cartasComputadoraActual];
        let puntosComp = puntosComputadora;

        setJuegoTerminado(true);

        while (puntosComp <= puntosJugadorActual && puntosJugadorActual < 21) {
            const { carta, mazoRestante } = tomarCarta(mazo);
            mazo = mazoRestante;
            cartasComp.push(carta);
            puntosComp += valorCarta(carta);

            if (puntosComp > 21) {
                break;
            }
        }

        while (puntosComp < puntosJugadorActual && puntosJugadorActual === 21) {
            const { carta, mazoRestante } = tomarCarta(mazo);
            mazo = mazoRestante;
            cartasComp.push(carta);
            puntosComp += valorCarta(carta);

            if (puntosComp >= 21) {
                break;
            }
        }

        setDeck(mazo);
        setCartasComputadora(cartasComp);
        setPuntosComputadora(puntosComp);

        await notificarResultado(determinarGanador(puntosJugadorActual, puntosComp));
    };

    const pedirCarta = async () => {
        if (!puedePedir) {
            return;
        }

        const { carta, mazoRestante } = tomarCarta(deck);
        const nuevasCartasJugador = [...cartasJugador, carta];
        const nuevosPuntosJugador = puntosJugador + valorCarta(carta);

        setDeck(mazoRestante);
        setCartasJugador(nuevasCartasJugador);
        setPuntosJugador(nuevosPuntosJugador);

        if (nuevosPuntosJugador >= 21) {
            await iniciarTurnoComputadora(nuevosPuntosJugador, mazoRestante, cartasComputadora);
        }
    };

    const detenerJuego = async () => {
        if (!puedeDetener) {
            return;
        }

        await iniciarTurnoComputadora(puntosJugador, deck, cartasComputadora);
    };

    return (
        <div className="game-shell">
            <ResultModal
                visible={modalVisible}
                titulo={modalTitulo}
                mensaje={modalMensaje}
                tipo={modalTipo}
                onCerrar={() => setModalVisible(false)}
            />

            <div className="game-container">
                <header className="game-header">
                    <UserMenu mostrarCasino={false} mostrarEstadisticas mostrarEstadisticasGlobales />

                    <div className="header-decoration left" />
                    <h1 className="game-title">
                        <span className="suit">♠</span>
                        Blackjack Royal
                        <span className="suit">♦</span>
                    </h1>
                    <div className="header-decoration right" />
                </header>

                <div className="control-panel" aria-label="Panel de control del juego">
                    <button id="btnNuevo" className="btn-game btn-new" type="button" onClick={nuevoJuego}>
                        <span className="btn-icon">🎲</span>
                        Nuevo Juego
                    </button>
                    <button id="btnPedir" className="btn-game btn-hit" type="button" onClick={() => void pedirCarta()} disabled={!puedePedir}>
                        <span className="btn-icon">🃏</span>
                        Pedir Carta
                    </button>
                    <button
                        id="btnDetener"
                        className="btn-game btn-stand"
                        type="button"
                        onClick={() => void detenerJuego()}
                        disabled={!puedeDetener}
                    >
                        <span className="btn-icon">✋</span>
                        Plantarse
                    </button>
                </div>

                <details className="stats-dropdown">
                    <summary>Estadisticas</summary>
                    <div className="stats-content" role="region" aria-label="Resumen de estadisticas del jugador">
                        <p>
                            <strong>Ganadas:</strong> {ganadas}
                        </p>
                        <p>
                            <strong>Perdidas:</strong> {perdidas}
                        </p>
                        <p>
                            <strong>Empatadas:</strong> {empatadas}
                        </p>
                        <p>
                            <strong>Total:</strong> {totalPartidas}
                        </p>
                        <button type="button" className="stats-link" onClick={() => navigate('/estadisticas')}>
                            Ir a la pagina de estadisticas
                        </button>
                    </div>
                </details>

                <div className="game-table">
                    <section className="player-area" aria-label="Zona del jugador">
                        <div className="player-info">
                            <div className="player-avatar" aria-hidden="true">
                                👤
                            </div>
                            <div className="player-details">
                                <h2 className="player-name">Jugador</h2>
                                <div className="score-display">
                                    <span className="score-label">Puntos:</span>
                                    <small className="score-value">{puntosJugador}</small>
                                </div>
                            </div>
                        </div>
                        <div id="jugador-cartas" className="cards-container divCartas">
                            {cartasJugador.map((carta, index) => (
                                <img className="carta" src={rutaCarta(carta)} alt={`Carta del jugador ${carta}`} key={`${carta}-${index}`} />
                            ))}
                        </div>
                    </section>

                    <div className="table-divider" aria-hidden="true">
                        <span className="divider-text">VS</span>
                    </div>

                    <section className="computer-area" aria-label="Zona del dealer">
                        <div className="player-info">
                            <div className="player-avatar" aria-hidden="true">
                                🤖
                            </div>
                            <div className="player-details">
                                <h2 className="player-name">Dealer</h2>
                                <div className="score-display">
                                    <span className="score-label">Puntos:</span>
                                    <small className="score-value">{puntosComputadora}</small>
                                </div>
                            </div>
                        </div>
                        <div id="computadora-cartas" className="cards-container divCartas">
                            {cartasComputadora.map((carta, index) => (
                                <img className="carta" src={rutaCarta(carta)} alt={`Carta del dealer ${carta}`} key={`${carta}-${index}`} />
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="game-footer">
                    <p>♣ La casa siempre tiene ventaja... ¿o no? ♥</p>
                    <p className="status-message">{mensajeEstado}</p>
                </footer>
            </div>
        </div>
    );
};