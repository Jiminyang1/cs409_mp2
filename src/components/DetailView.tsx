import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonByName } from '../services/pokeapi';
import styles from './DetailView.module.css';

interface LocationState {
  pokemonList?: string[];
  currentIndex?: number;
}

const DetailView: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as LocationState;
  const pokemonList = state?.pokemonList || [];
  const currentIndex = state?.currentIndex ?? -1;

  // Fetch Pokemon data when name changes
  useEffect(() => {
    const fetchData = async () => {
      if (!name) {
        setError('No Pokemon name provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const pokemonData = await fetchPokemonByName(name);
        setPokemon(pokemonData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Pokemon details:', err);
        setError('Failed to load Pokemon details. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const handlePrevious = () => {
    if (currentIndex > 0 && pokemonList.length > 0) {
      const prevPokemon = pokemonList[currentIndex - 1];
      navigate(`/pokemon/${prevPokemon}`, {
        state: {
          pokemonList,
          currentIndex: currentIndex - 1,
        },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < pokemonList.length - 1 && pokemonList.length > 0) {
      const nextPokemon = pokemonList[currentIndex + 1];
      navigate(`/pokemon/${nextPokemon}`, {
        state: {
          pokemonList,
          currentIndex: currentIndex + 1,
        },
      });
    }
  };

  const handleBackToGallery = () => {
    navigate('/');
  };

  const handleBackToList = () => {
    navigate('/list');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading Pokemon details...</div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Pokemon not found'}</div>
        <button className={styles.backButton} onClick={handleBackToGallery}>
          Back to Gallery
        </button>
      </div>
    );
  }

  const officialArtwork =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={handleBackToGallery}>
          ← Gallery
        </button>
        <button className={styles.backButton} onClick={handleBackToList}>
          ← List
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.name}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h1>
          <span className={styles.id}>
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.imageSection}>
            {officialArtwork ? (
              <img
                src={officialArtwork}
                alt={pokemon.name}
                className={styles.image}
              />
            ) : (
              <div className={styles.noImage}>No Image Available</div>
            )}
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.detailGroup}>
              <h2 className={styles.sectionTitle}>Types</h2>
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

            <div className={styles.detailGroup}>
              <h2 className={styles.sectionTitle}>Abilities</h2>
              <ul className={styles.abilities}>
                {pokemon.abilities.map((ability) => (
                  <li key={ability.ability.name} className={styles.ability}>
                    {ability.ability.name.charAt(0).toUpperCase() +
                      ability.ability.name.slice(1).replace(/-/g, ' ')}
                    {ability.is_hidden && (
                      <span className={styles.hiddenAbility}>(Hidden)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.detailGroup}>
              <h2 className={styles.sectionTitle}>Physical Attributes</h2>
              <div className={styles.attributes}>
                <div className={styles.attribute}>
                  <span className={styles.attributeLabel}>Height:</span>
                  <span className={styles.attributeValue}>
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div className={styles.attribute}>
                  <span className={styles.attributeLabel}>Weight:</span>
                  <span className={styles.attributeValue}>
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailGroup}>
              <h2 className={styles.sectionTitle}>Base Stats</h2>
              <div className={styles.stats}>
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className={styles.stat}>
                    <span className={styles.statName}>
                      {stat.stat.name
                        .replace('-', ' ')
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                      :
                    </span>
                    <div 
                      className={styles.statBar}
                      style={
                        { '--stat-width': `${(stat.base_stat / 255) * 100}%` } as React.CSSProperties
                      }
                    >
                      <div className={styles.statFill} />
                    </div>
                    <span className={styles.statValue}>{stat.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {pokemonList.length > 0 && (
          <div className={styles.navigationButtons}>
            <button
              className={styles.navButton}
              onClick={handlePrevious}
              disabled={currentIndex <= 0}
            >
              ← Previous
            </button>
            <span className={styles.positionInfo}>
              {currentIndex + 1} of {pokemonList.length}
            </span>
            <button
              className={styles.navButton}
              onClick={handleNext}
              disabled={currentIndex >= pokemonList.length - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;

