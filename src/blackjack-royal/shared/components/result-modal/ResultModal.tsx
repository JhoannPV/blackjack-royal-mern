import './result-modal.css';

type TipoResultado = 'ganador' | 'perdedor' | 'empate';

interface ResultModalProps {
    visible: boolean;
    titulo: string;
    mensaje: string;
    tipo: TipoResultado;
    onCerrar: () => void;
}

export const ResultModal = ({ visible, titulo, mensaje, tipo, onCerrar }: ResultModalProps) => {
    if (!visible) {
        return null;
    }

    return (
        <div className="modal-overlay" role="presentation" onClick={onCerrar}>
            <section
                className="modal-card"
                role="dialog"
                aria-modal="true"
                aria-label="Resultado de la partida"
                onClick={(evento) => evento.stopPropagation()}
            >
                <header className={`modal-header ${tipo}`}>
                    <h2>{titulo}</h2>
                </header>

                <p className="modal-message">{mensaje}</p>

                <button type="button" className="modal-close" onClick={onCerrar}>
                    Continuar
                </button>
            </section>
        </div>
    );
};
