import type { Carta, FiguraEspecial, PaloCarta } from '../types/casinoGameTypes';

const PALOS: PaloCarta[] = ['C', 'D', 'H', 'S'];
const FIGURAS_ESPECIALES: FiguraEspecial[] = ['A', 'J', 'Q', 'K'];

const mezclar = <T>(array: T[]) => {
    const copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
};

export const crearBaraja = (): Carta[] => {
    const deck: Carta[] = [];

    for (let i = 2; i <= 10; i++) {
        for (const palo of PALOS) {
            deck.push(`${i}${palo}` as Carta);
        }
    }

    for (const palo of PALOS) {
        for (const figura of FIGURAS_ESPECIALES) {
            deck.push(`${figura}${palo}` as Carta);
        }
    }

    return mezclar(deck);
};

export const valorCarta = (carta: Carta) => {
    const valor = carta.substring(0, carta.length - 1);

    if (!Number.isNaN(Number(valor))) {
        return Number(valor);
    }

    if (valor === 'A') {
        return 1;
    }

    if (valor === 'J') {
        return 11;
    }

    if (valor === 'Q') {
        return 12;
    }

    return 13;
};

export const rutaCarta = (carta: Carta) => new URL(`../../../assets/cartas/${carta}.png`, import.meta.url).href;
