import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pokemonsPerPage = 9;

  useEffect(() => {
    fetchPokemons();
  }, [currentPage]);

  const fetchPokemons = async () => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${
          (currentPage - 1) * pokemonsPerPage
        }&limit=${pokemonsPerPage}`
      );
      const results = response.data.results;
      setTotalPages(Math.ceil(response.data.count / pokemonsPerPage));

      const pokemonPromises = results.map((pokemon) =>
        fetchPokemonData(pokemon.url)
      );
      Promise.all(pokemonPromises).then((pokemonData) => {
        setPokemonList(pokemonData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPokemonData = async (url) => {
    try {
      const response = await axios.get(url);
      const pokemonData = response.data;
      return pokemonData;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const renderPokemon = () => {
    return pokemonList.map((pokemon) => {
      if (!pokemon) {
        return null;
      }

      let tipos = pokemon.types.map((type) => (
        <p className={`${type.type.name} tipo`} key={type.type.name}>
          {type.type.name}
        </p>
      ));

      let pokeId = pokemon.id.toString();
      if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
      } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
      }

      return (
        <div className="pokemon" key={pokemon.id}>
          <p className="pokemon-id-back">#{pokeId}</p>
          <div className="pokemon-imagen">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
            />
          </div>
          <div className="pokemon-info">
            <div className="nombre-contenedor">
              <p className="pokemon-id">#{pokeId}</p>
              <h2 className="pokemon-nombre">{pokemon.name}</h2>
            </div>
            <div className="pokemon-tipos">{tipos}</div>
            <div className="pokemon-stats">
              <p className="stat">{pokemon.height}m</p>
              <p className="stat">{pokemon.weight}kg</p>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <h1 className="title">Pokédex</h1>
      <div className="pokemon-list">{renderPokemon()}</div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
