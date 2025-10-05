import React from 'react';
import { PokemonWithDetails } from '../types/pokemon';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  pokemon: PokemonWithDetails;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        {pokemon.sprites.front_default ? (
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>
        <p className={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</p>
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
  );
};

export default PokemonCard;

