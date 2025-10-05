import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonWithDetails, TypeBasic } from '../types/pokemon';
import {
  fetchPokemonList,
  fetchMultiplePokemonDetails,
} from '../services/pokeapi';
import PokemonCard from './PokemonCard';
import styles from './GalleryView.module.css';

const GalleryView: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonWithDetails[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonWithDetails[]>([]);
  const [types, setTypes] = useState<TypeBasic[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all Pokemon and types on component mount
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

        // Transform to include type names for easier filtering
        const pokemonWithTypes: PokemonWithDetails[] = pokemonDetails.map((pokemon) => ({
          ...pokemon,
          typeNames: pokemon.types.map((t) => t.type.name),
        }));

        setAllPokemon(pokemonWithTypes);
        setFilteredPokemon(pokemonWithTypes);

        // Extract unique types from the fetched Pokémon data
        const uniqueTypesSet = new Set<string>();
        pokemonWithTypes.forEach((pokemon) => {
          pokemon.typeNames.forEach((typeName) => {
            uniqueTypesSet.add(typeName);
          });
        });

        // Convert to array and sort alphabetically, then create TypeBasic objects
        const uniqueTypes = Array.from(uniqueTypesSet)
          .sort()
          .map((typeName) => ({
            name: typeName,
            url: `https://pokeapi.co/api/v2/type/${typeName}`,
          }));

        setTypes(uniqueTypes);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching Pokemon data:', err);
        setError('Failed to load Pokemon data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Pokemon by selected types and search query
  useEffect(() => {
    let result = [...allPokemon];

    // Apply type filter (AND logic - Pokemon must have ALL selected types)
    if (selectedTypes.size > 0) {
      result = result.filter((pokemon) =>
        Array.from(selectedTypes).every((selectedType) =>
          pokemon.typeNames.includes(selectedType)
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPokemon(result);
  }, [selectedTypes, searchQuery, allPokemon]);

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

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(typeName)) {
        newSet.delete(typeName);
      } else {
        newSet.add(typeName);
      }
      return newSet;
    });
  };

  const handleClearFilters = () => {
    setSelectedTypes(new Set());
    setSearchQuery('');
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
      <h1 className={styles.title}>Pokémon Gallery</h1>
      
      <div className={styles.filterContainer}>
        <div className={styles.searchSection}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Pokémon by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.typeSection}>
          <div className={styles.typeSectionHeader}>
            <h2 className={styles.filterTitle}>Filter by Type:</h2>
            {(selectedTypes.size > 0 || searchQuery) && (
              <button className={styles.clearButton} onClick={handleClearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
          <div className={styles.typeCheckboxes}>
            {types.map((type) => (
              <label key={type.name} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedTypes.has(type.name)}
                  onChange={() => handleTypeToggle(type.name)}
                />
                <span className={`${styles.typeLabel} ${styles[type.name]}`}>
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resultsCount}>
        Showing {filteredPokemon.length} of {allPokemon.length} Pokémon
        {selectedTypes.size > 0 && (
          <span className={styles.filterInfo}>
            {' '}(filtered by {selectedTypes.size} type{selectedTypes.size > 1 ? 's' : ''})
          </span>
        )}
      </div>

      <div className={styles.gallery}>
        {filteredPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => handlePokemonClick(pokemon.name)}
          />
        ))}
      </div>

      {filteredPokemon.length === 0 && (
        <div className={styles.noResults}>
          No Pokémon found with the selected type.
        </div>
      )}
    </div>
  );
};

export default GalleryView;

