// TypeScript interfaces for PokeAPI data structures

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

export interface PokemonBasic {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
  stats: PokemonStat[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface TypeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TypeBasic[];
}

export interface TypeBasic {
  name: string;
  url: string;
}

export interface PokemonTypeDetail {
  id: number;
  name: string;
  pokemon: {
    pokemon: PokemonBasic;
    slot: number;
  }[];
}

// Helper interface for storing Pokemon data with full details
export interface PokemonWithDetails extends Pokemon {
  typeNames: string[];
}

