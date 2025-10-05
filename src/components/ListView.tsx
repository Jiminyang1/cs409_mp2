import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonWithDetails } from '../types/pokemon';
import {
  fetchPokemonList,
  fetchMultiplePokemonDetails,
} from '../services/pokeapi';
import styles from './ListView.module.css';

type SortProperty = 'name' | 'id';
type SortOrder = 'asc' | 'desc';

const ListView: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonWithDetails[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortProperty, setSortProperty] = useState<SortProperty>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all Pokemon on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the first 151 Pokemon
        const pokemonListResponse = await fetchPokemonList(151, 0);
        
        // Fetch details for all Pokemon
        const pokemonDetails = await fetchMultiplePokemonDetails(
          pokemonListResponse.results
        );

        // Transform to include type names
        const pokemonWithTypes: PokemonWithDetails[] = pokemonDetails.map((pokemon) => ({
          ...pokemon,
          typeNames: pokemon.types.map((t) => t.type.name),
        }));

        setAllPokemon(pokemonWithTypes);
        setFilteredPokemon(pokemonWithTypes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Pokemon data:', err);
        setError('Failed to load Pokemon data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort Pokemon whenever search query or sort settings change
  useEffect(() => {
    let result = [...allPokemon];

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortProperty === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortProperty === 'id') {
        comparison = a.id - b.id;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredPokemon(result);
  }, [searchQuery, sortProperty, sortOrder, allPokemon]);

  const handlePokemonClick = (name: string) => {
    // Find the index of the clicked Pokemon in the current filtered list
    const index = filteredPokemon.findIndex((p) => p.name === name);
    // Navigate to detail view with state containing the full list and current index
    navigate(`/pokemon/${name}`, {
      state: {
        pokemonList: filteredPokemon.map((p) => p.name),
        currentIndex: index,
      },
    });
  };

  const handleSortPropertyChange = (property: SortProperty) => {
    if (sortProperty === property) {
      // Toggle sort order if clicking the same property
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Change property and reset to ascending
      setSortProperty(property);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading Pokemon...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pokémon List</h1>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Pokémon by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.sortContainer}>
          <span className={styles.sortLabel}>Sort by:</span>
          <button
            className={`${styles.sortButton} ${
              sortProperty === 'id' ? styles.active : ''
            }`}
            onClick={() => handleSortPropertyChange('id')}
          >
            ID {sortProperty === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`${styles.sortButton} ${
              sortProperty === 'name' ? styles.active : ''
            }`}
            onClick={() => handleSortPropertyChange('name')}
          >
            Name {sortProperty === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className={styles.resultsCount}>
        Showing {filteredPokemon.length} of {allPokemon.length} Pokémon
      </div>

      <div className={styles.list}>
        {filteredPokemon.map((pokemon) => (
          <div
            key={pokemon.id}
            className={styles.listItem}
            onClick={() => handlePokemonClick(pokemon.name)}
          >
            <div className={styles.listItemLeft}>
              <span className={styles.pokemonId}>
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <span className={styles.pokemonName}>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </span>
            </div>
            <div className={styles.listItemRight}>
              <div className={styles.types}>
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`${styles.type} ${styles[type.type.name]}`}
                  >
                    {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPokemon.length === 0 && (
        <div className={styles.noResults}>
          No Pokémon found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};

export default ListView;

