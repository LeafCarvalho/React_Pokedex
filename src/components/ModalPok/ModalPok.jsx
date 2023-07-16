// Assets
import imageLoading from "../../Assets/Loading.gif";
// Bootstrap
import { Modal, Button } from "react-bootstrap";
// Css
import styles from "./ModalPok.module.css";
// Hooks
import React, { useState, useEffect } from "react";
// Libs
import axios from "axios";
// Carrossel
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const ModalPok = ({ pokemon, closeModal }) => {
  const [evolutions, setEvolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const getEvolutions = async (chain) => {
      const evolutionDetailsResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${chain.species.name}`
      );

      const evolutionData = {
        name: chain.species.name,
        image:
          evolutionDetailsResponse.data.sprites.other["official-artwork"]
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
      setIsLoading(true);

      axios
        .get(pokemon.species.url)
        .then((response) => axios.get(response.data.evolution_chain.url))
        .then((evolutionChainResponse) =>
          getEvolutions(evolutionChainResponse.data.chain)
        )
        .then((evolutionsData) => {
          setTimeout(() => {
            setEvolutions(evolutionsData);
            setIsLoading(false);
          }, 2000);
        })
        .catch((error) => console.error(error));
    }
  }, [pokemon]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 950);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <Modal.Dialog>
          <Modal.Title className={styles.title}>Evoluções</Modal.Title>

          <Modal.Body className={styles.pokeHistory}>
            <div className={styles.rightContent}>
              {isLoading ? (
                <div className={styles.loading}>
                  <img src={imageLoading} alt="loading image Picachu" />
                </div>
              ) : isMobile ? (
                <div className={styles.carouselContainer}>
                  <Carousel
                    className={styles.carousel}
                    showThumbs={false}
                    showStatus={false}
                    autoPlay={true}
                    infiniteLoop={true}
                    showIndicators={false}
                    renderArrowPrev={(onClickHandler, label) => (
                      <button
                        type="button"
                        onClick={onClickHandler}
                        title={label.toString()}
                        className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
                      >
                        {"<"}
                      </button>
                    )}
                    renderArrowNext={(onClickHandler, label) => (
                      <button
                        type="button"
                        onClick={onClickHandler}
                        title={label.toString()}
                        className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
                      >
                        {">"}
                      </button>
                    )}
                  >
                    {evolutions.map((evolution, index) => (
                      <div key={index}>
                        <p>{evolution.name}</p>
                        <img
                          src={evolution.image}
                          alt={evolution.name}
                          className={styles.pokemonImage}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
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
