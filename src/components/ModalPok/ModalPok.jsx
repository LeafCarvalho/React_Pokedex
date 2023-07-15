import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import styles from "./ModalPok.module.css";
import imageLoading from '../../Assets/Loading.gif'

export const ModalPok = ({ pokemon, closeModal }) => {
  const [evolutions, setEvolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEvolutions = async (chain) => {
      const evolutionDetailsResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${chain.species.name}`
      );

      const evolutionData = {
        name: chain.species.name,
        image: evolutionDetailsResponse.data.sprites.other["official-artwork"]
          .front_default,
      };

      const evolutionsData = [evolutionData];

      if (chain.evolves_to.length > 0) {
        for (const evolution of chain.evolves_to) {
          const nestedEvolutions = await getEvolutions(evolution);
          evolutionsData.push(...nestedEvolutions);
        }
      }

      return evolutionsData;
    };

    if (pokemon) {
      setIsLoading(true); // Define isLoading para true ao iniciar o carregamento

      axios
        .get(pokemon.species.url)
        .then((response) => axios.get(response.data.evolution_chain.url))
        .then((evolutionChainResponse) =>
          getEvolutions(evolutionChainResponse.data.chain)
        )
        .then((evolutionsData) => {
          setTimeout(() => {
            setEvolutions(evolutionsData);
            setIsLoading(false); // Define isLoading para false após dois segundos
          }, 2000);
        })
        .catch((error) => console.error(error));
    }
  }, [pokemon]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <Modal.Dialog>
          <Modal.Title className={styles.title}>Evoluções</Modal.Title>
          <Modal.Header closeButton></Modal.Header>

          <Modal.Body className={styles.pokeHistory}>
            <div className={styles.rightContent}>
              {isLoading ? ( // Verifica se isLoading é verdadeiro
                <div className={styles.loading}><img src={imageLoading} alt="loading image Picachu" /></div>
              ) : (
                <ul className={styles.evolutions}>
                  {evolutions.map((evolution, index) => (
                    <li key={index}>
                      {evolution.name}
                      <img
                        src={evolution.image}
                        alt={evolution.name}
                        className={styles.pokemonImage}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeModal}
              className={styles.closeButton}
            />
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    </div>
  );
};
