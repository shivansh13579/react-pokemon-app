import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";


function PokemonList(){




    const [pokemonListState,setPokemonListState] = useState({
        pokemonList : [],
        isLoading: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
        nextUrl: '',
        prevUrl: ''
    });
    
    

    

    async function downloadPokemon(){
        setPokemonListState((state)=>({...state,isLoading: true }))
        const response = await axios.get(pokemonListState.pokedexUrl); //this download the 20 pokemon

        const pokemonResults = response.data.results; //we get the array of pokemon from result
        
        console.log(response.data);
        setPokemonListState((state)=>({
            ...state,
            nextUrl:response.data.next,
            prevUrl:response.data.previous
        }));
        

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
       setPokemonListState((state)=>({
        ...state,
        pokemonList : pokeListResult,
        isLoading:false
    }));
       
    }

    useEffect( ()=>{
       downloadPokemon();
    },[pokemonListState.pokedexUrl]);
    return(
        <div className="pokemon-list-wrapper">
            
            <div className="pokemon-wrapper">
             {(pokemonListState.isLoading) ?' loading...' : 
             pokemonListState.pokemonList.map((p)=><Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>)
             }
            </div>
            <div className="controls">
                <button disabled={pokemonListState.prevUrl==null} onClick={()=>{
                    const urlToSet = pokemonListState.prevUrl;
                    setPokemonListState(()=>({...pokemonListState,pokedexUrl: urlToSet})
                )}
                }>Prev</button>
                <button disabled={pokemonListState.nextUrl==null} onClick={()=>{
                     const urlToSet = pokemonListState.nextUrl;
                     setPokemonListState(()=>({...pokemonListState, pokedexUrl: urlToSet}))
                }}>next</button>
            </div>
           
        </div>
    )
}

export default PokemonList;