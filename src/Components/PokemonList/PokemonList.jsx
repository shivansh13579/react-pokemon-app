import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css';


function PokemonList(){

    const [pokemomList,setPokemonList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    async   function downloadPokemon(){
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
        const pokemonResults = response.data.results;
       const pokemonResultData = pokemonResults.map((pokemon)=>axios.get(pokemon.url));
       const pokemonData = await axios.all(pokemonResultData);
       console.log(pokemonData); 
        setIsLoading(false);
    }

    useEffect( ()=>{
       downloadPokemon();
    },[]);
    return(
        <div className="pokemon-list-wrapper">
            Pokemon List
            {(isLoading)?' loading':' dataDownloaded'}
        </div>
    )
}

export default PokemonList;