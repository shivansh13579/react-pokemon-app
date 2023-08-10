import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";


function PokemonList(){

    const [pokemomList,setPokemonList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    
    const POKEDEC_URL = 'https://pokeapi.co/api/v2/pokemon';

    async function downloadPokemon(){
       
        const response = await axios.get(POKEDEC_URL); //this download the 20 pokemon

        const pokemonResults = response.data.results; //we get the array of pokemon from result
        console.log(response.data);

        //iterating over the array of pokemon,and using url to create the array of pokemon
        //that will download the 20 pokemon
       const pokemonResultData = pokemonResults.map((pokemon)=>axios.get(pokemon.url));
     
       //passing that promise array to axios.all
       const pokemonData = await axios.all(pokemonResultData);//array of 20 pokemon detailed data
       console.log(pokemonData); 
       //now iterate on the data of each pokemon
       const pokeListResult = (pokemonData.map((pokeData)=>{
        const pokemons = pokeData.data;
        return {
            id : pokemons.id,
            name : pokemons.name, 
            image : (pokemons.sprites.other)?pokemons.sprites.other.dream_world.front_default:pokemons.sprites.front_shiny,
            type :pokemons.types}

       }));
       console.log(pokeListResult);
       setPokemonList(pokeListResult);
        setIsLoading(false);
    }

    useEffect( ()=>{
       downloadPokemon();
    },[]);
    return(
        <div className="pokemon-list-wrapper">
            
            <div className="pokemon-wrapper">
            {(isLoading) ?' loading...' : 
            pokemomList.map((p)=><Pokemon name={p.name} image={p.image} key={p.id}/>)
            }
            </div>
            <div className="controls">
                <button>Prev</button>
                <button>next</button>
            </div>
           
        </div>
    )
}

export default PokemonList;