// Components
import { CaixaConteudo } from "../../components/CaixaConteudo/CaixaConteudo";
import { ModalPok } from "../../components/ModalPok/ModalPok";
// CSS
import styles from "../Pokemon/Pokemon.module.css";
// Hooks
import { useState, useEffect } from "react";
// Libs
import axios from "axios";
import { useQuery } from "react-query";


export function Pokemon() {
  const limit = 12;
  const [visiblePokemons, setVisiblePokemons] = useState(limit);
  const [pokemonsData, setPokemonsData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const { data: pokemonUrls, isLoading, error } = useQuery(
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

  useEffect(() => {
    if (pokemonUrls) {
      fetchPokemonDetails();
    }
  }, [pokemonUrls]);

  const fetchPokemonDetails = async () => {
    const start = pokemonsData.length;
    const end = start + limit;

    const pokemonRequests = pokemonUrls
      .slice(start, end)
      .map((pokemon) => axios.get(pokemon.url));

    const responses = await Promise.all(pokemonRequests);
    const pokemonsDetails = responses.map((response) => response.data);

    setPokemonsData((prevPokemonsData) => [
      ...prevPokemonsData,
      ...pokemonsDetails,
    ]);
    setVisiblePokemons(end);
  };

  const handleLoadMore = () => {
    if (visiblePokemons >= 150) {
      return;
    }

    fetchPokemonDetails();
  };

  if (isLoading) {
    return <div className={styles.loadingPage}>Carregando...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Hum... Parece que algo deu errado. Caso persista, contate o
        administrador.
      </div>
    );
  }

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

  const children = (
    <div className={styles.boxPoke}>
      <div className={styles.title}>
        <h1>Pokemons</h1>
      </div>
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
                <li>{pokemon.name}</li>
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
      {visiblePokemons < 150 && (
        <div className={styles.morePokemon}>
          <div className={styles.buttonContainer}>
            <button onClick={handleLoadMore}>Ver Mais</button>
          </div>
        </div>
      )}
      {selectedPokemon && (
        <ModalPok
          pokemon={selectedPokemon}
          closeModal={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );

  return (
    <>
      <CaixaConteudo children={children} />
    </>
  );
}
