// Components
import { CaixaConteudo } from "../../components/CaixaConteudo/CaixaConteudo";
import { ModalPok } from "../../components/ModalPok/ModalPok";
// Css
import styles from "../Pokemon/Pokemon.module.css";
// Hooks
import { useState, useEffect } from "react";
// Libs
import axios from "axios";
import { useQuery } from "react-query";
import Skeleton from 'react-loading-skeleton';

export function Pokemon() {
  const limit = 12;
  // States
  const [visiblePokemons, setVisiblePokemons] = useState(limit);
  const [pokemonsData, setPokemonsData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Get API datas
  const { data: pokemonUrls, error } = useQuery(
    ["pokemons"],
    () => {
      return axios
        .get("https://pokeapi.co/api/v2/pokemon?limit=150")
        .then((response) => response.data.results);
    },
    {
      retry: 3,
    }
  );

  // Displaying skeleton loading before API data loading
  useEffect(() => {
    if (pokemonUrls) {
      setIsLoadingData(true);
      fetchPokemonDetails();
    }
  }, [pokemonUrls]);

  // Skeleton loading time
  useEffect(() => {
    if (!isLoadingData) {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 1800);

      return () => clearTimeout(timeout);
    }
  }, [isLoadingData]);

  // Data search and storage
  const fetchPokemonDetails = async () => {
    const start = pokemonsData.length;
    const end = start + limit;

    const pokemonRequests = pokemonUrls
      .slice(start, end)
      .map((pokemon) => axios.get(pokemon.url));

    try {
      const responses = await Promise.all(pokemonRequests);
      const pokemonsDetails = responses.map((response) => response.data);

      setPokemonsData((prevPokemonsData) => [
        ...prevPokemonsData,
        ...pokemonsDetails,
      ]);
      setVisiblePokemons(end);
    } catch (error) {
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load more pokemons
  const handleLoadMore = () => {
    if (visiblePokemons >= 150) {
      return;
    }
    fetchPokemonDetails();
  };

  // Pokemon colors by type
  const getTypeColor = (type) => {
    switch (type) {
      case "normal":
        return "--normal";
      case "grass":
        return "--grass";
      case "fire":
        return "--fire";
      case "water":
        return "--water";
      case "electric":
        return "--electric";
      case "ice":
        return "--ice";
      case "ground":
        return "--ground";
      case "flying":
        return "--flying";
      case "poison":
        return "--poison";
      case "fighting":
        return "--fighting";
      case "psychic":
        return "--psychic";
      case "dark":
        return "--dark";
      case "rock":
        return "--rock";
      case "bug":
        return "--bug";
      case "ghost":
        return "--ghost";
      case "steel":
        return "--steel";
      case "dragon":
        return "--dragon";
      case "fairy":
        return "--fairy";
      default:
        return "";
    }
  };

  return (
    <>
      <CaixaConteudo>
        <div className={styles.boxPoke}>
          <div className={styles.title}>
            <h1>Pokemons</h1>
          </div>

          {/* Skeleton loader for the card section */}
          {showSkeleton && (
            <div className={styles.containerPoke}>
              {Array.from({ length: limit }).map((_, index) => (
                <div key={index} className={styles.cardPokemon} style={{ backgroundColor: '#D7D7D7' }}>
                  <div>
                    <ul>
                      <li><Skeleton height={20} width={100} /></li>
                      <li className={styles.pokemonTypes}>
                        <ul>
                          <li><Skeleton height={15} width={80} /></li>
                          <li><Skeleton height={15} width={80} /></li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.pokeIdImage}>
                    <ul>
                      <li><Skeleton height={20} width={40} /></li>
                      <li><Skeleton circle height={80} width={80} /></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actual content */}
          {!showSkeleton && !error && (
            <div className={styles.containerPoke}>
              {pokemonsData.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className={styles.cardPokemon}
                  style={{
                    backgroundColor: `var(${getTypeColor(
                      pokemon.types[0].type.name
                    )})`,
                  }}
                  onClick={() => setSelectedPokemon(pokemon)}
                >
                  <div>
                    <ul>
                      <li>
                        <span className={styles.pokeName}>{pokemon.name}</span>
                      </li>
                      <li className={styles.pokemonTypes}>
                        <ul>
                          {pokemon.types.map((type) => (
                            <li key={type.type.name}>{type.type.name}</li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.pokeIdImage}>
                    <ul>
                      <li>#{pokemon.id}</li>
                      <li>
                        <img
                          src={
                            pokemon.sprites.versions["generation-v"]["black-white"][
                              "animated"
                            ]["front_default"]
                          }
                          alt={pokemon.name}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {visiblePokemons < 150 && (
            <div className={styles.morePokemon}>
              <div className={styles.buttonContainer}>
                <button onClick={handleLoadMore}>Ver Mais</button>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.loadingPage}>
              Hum... Parece que algo deu errado. Caso persista, contate o administrador.
            </div>
          )}

          {selectedPokemon && (
            <ModalPok
              pokemon={selectedPokemon}
              closeModal={() => setSelectedPokemon(null)}
            />
          )}
        </div>
      </CaixaConteudo>
    </>
  );
}
