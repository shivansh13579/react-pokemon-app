import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";


function PokemonList(){



    const [pokemonList,setPokemonList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [pokedexUrl,setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');

    const [nextUrl,setNextUrl] = useState('');
    const [prevUrl,setPrevUrl] = useState('');
    
    

    

    async function downloadPokemon(){
       
        const response = await axios.get(pokedexUrl); //this download the 20 pokemon

        const pokemonResults = response.data.results; //we get the array of pokemon from result
        console.log(response.data);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);

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
    },[pokedexUrl]);
    return(
        <div className="pokemon-list-wrapper">
            
            <div className="pokemon-wrapper">
             {(isLoading) ?' loading...' : 
              pokemonList.map((p)=><Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>)
             }
            </div>
            <div className="controls">
                <button disabled={prevUrl==null} onClick={()=>setPokedexUrl(prevUrl)}>Prev</button>
                <button disabled={nextUrl==null} onClick={()=>setPokedexUrl(nextUrl)}>next</button>
            </div>
           
        </div>
    )
}

export default PokemonList;