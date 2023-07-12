import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

export function Modal() {
  const { data, isLoading, error } = useQuery(['pokemons'], () => {
    const pokemonIds = Array.from({ length: 150 }, (_, index) => index + 1);
    const pokemonRequests = pokemonIds.map(id => axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`));
    return Promise.all(pokemonRequests).then(responses => responses.map(response => response.data));
  }, {
    retry: 3,
  });

  if (isLoading) {
    return <div className="loading">Carregando...</div>
  }

  if (error) {
    return <div className="error">Hum... Parece que algo deu errado. Caso persista, contate o administrador.</div>
  }

  return (
    <>
      {data.map((pokemon) => (
        <div key={pokemon.id}>
          <ul>
            <li>Name: {pokemon.name}</li>
            <li>Height: {pokemon.height}</li>
            <li>Weight: {pokemon.weight}</li>
            <li>Species URL: {pokemon.species.url}</li>
            <li>Types: {pokemon.types.map(type => type.type.name).join(', ')}</li>
            <li>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</li>
            <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
            <li>Total Stats: {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}</li>
            <li>Individual Stats:</li>
            <ul>
              {pokemon.stats.map(stat => (
                <li key={stat.stat.name}>
                  {stat.stat.name}: {stat.base_stat}
                </li>
              ))}
            </ul>
          </ul>
        </div>
      ))}
    </>
  );
}
