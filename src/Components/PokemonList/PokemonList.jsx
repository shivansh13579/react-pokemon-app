import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";


function PokemonList(){

    const [pokemomList,setPokemonList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    async   function downloadPokemon(){
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
        const pokemonResults = response.data.results;
       const pokemonResultData = pokemonResults.map((pokemon)=>axios.get(pokemon.url));
       const pokemonData = await axios.all(pokemonResultData);
       console.log(pokemonData); 
       const res = (pokemonData.map((pokeData)=>{
        const pokemons = pokeData.data;
        return {
            id : pokemons.id,
            name : pokemons.name, 
            image : (pokemons.sprites.other)?pokemons.sprites.other.dream_world.front_default:pokemons.sprites.front_shiny,
            type :pokemons.types}

       }));
       console.log(res);
       setPokemonList(res);
        setIsLoading(false);
    }

    useEffect( ()=>{
       downloadPokemon();
    },[]);
    return(
        <div className="pokemon-list-wrapper">
            <div>Pokemon List</div>
            {(isLoading) ?' loading...' : 
            pokemomList.map((p)=><Pokemon name={p.name} image={p.image} key={p.id}/>)
            }
        </div>
    )
}

export default PokemonList;