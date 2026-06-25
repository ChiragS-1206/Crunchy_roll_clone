import React from 'react';
import AnimeCard2 from './Animecard2';
import './AnimeGallery2.css';

const AnimeGallery2 = ({ animeList2, onAnimeClick }) => {
  return (
    <div className="anime-gallery2">
      {animeList2.map((anime, index) => (
        <AnimeCard2
          key={anime.id || `anime-${index}`}
          id={anime.id || `${anime.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}-${index}`}
          title={anime.title}
          subtitle={anime.subtitle}
          image={anime.image}
          season={anime.season}
          episode={anime.episode}
          rating={anime.rating}
          desc={anime.desc}
          onAnimeClick={onAnimeClick}
        />
      ))}
    </div>
  );
};

export default AnimeGallery2;
