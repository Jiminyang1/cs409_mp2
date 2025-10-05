import axios from 'axios';
import {
  PokemonListResponse,
  Pokemon,
  TypeListResponse,
  PokemonTypeDetail,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Fetch the list of Pokemon with pagination
export const fetchPokemonList = async (
  limit: number = 151,
  offset: number = 0
): Promise<PokemonListResponse> => {
  const response = await api.get<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

// Fetch details for a single Pokemon by name or ID
export const fetchPokemonByName = async (
  nameOrId: string | number
): Promise<Pokemon> => {
  const response = await api.get<Pokemon>(`/pokemon/${nameOrId}`);
  return response.data;
};

// Fetch all Pokemon types
export const fetchAllTypes = async (): Promise<TypeListResponse> => {
  const response = await api.get<TypeListResponse>('/type');
  return response.data;
};

// Fetch details for a specific type (includes all Pokemon of that type)
export const fetchTypeDetails = async (
  nameOrId: string | number
): Promise<PokemonTypeDetail> => {
  const response = await api.get<PokemonTypeDetail>(`/type/${nameOrId}`);
  return response.data;
};

// Helper function to fetch multiple Pokemon details in parallel
export const fetchMultiplePokemonDetails = async (
  pokemonList: { name: string; url: string }[]
): Promise<Pokemon[]> => {
  const promises = pokemonList.map((pokemon) => fetchPokemonByName(pokemon.name));
  return Promise.all(promises);
};

