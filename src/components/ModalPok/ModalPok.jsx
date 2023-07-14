import { Modal, Button } from 'react-bootstrap';
import styles from "./ModalPok.module.css";

export const ModalPok = ({ pokemon, closeModal }) => {

  if (!pokemon) {
    return null; // Renderiza null se o objeto pokemon for undefined
  }

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>{pokemon.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Number: #{pokemon.id}</p>
            <p>Types:</p>
            <ul>
              {pokemon.types.map((type) => (
                <li key={type.type.name}>{type.type.name}</li>
              ))}
            </ul>
            <img
              src={pokemon.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"]}
              alt={pokemon.name}
            />
            {/* Resto das informações do Pokémon */}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    </div>
  );
};