import React, { useRef, useState } from 'react';
import AnimeCard from './Animecard';
import './AnimeGallery1.css';

const AnimeGallery = ({ animeList, onAnimeClick }) => {
  const scrollRef = useRef(null);
  const [left, setleft] = useState(false);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollamount = container.clientWidth;
    if (direction === "left") {
      container.scrollBy({ left: -scrollamount, behavior: "smooth" });
      setleft(false);
    } else {
      container.scrollBy({ left: scrollamount, behavior: "smooth" });
      setleft(true);
    }
  };

  return (
    <div className='anime-gallery-container'>
      <div className="anime-gallery" ref={scrollRef}>
        {animeList.map((anime, index) => (
          <AnimeCard
            key={index}
            id={anime.id}         
            title={anime.title}
            subtitle={anime.subtitle}
            image={anime.image}
            season={anime.season}
            episode={anime.episode}
            rating={anime.rating}
            desc={anime.desc}
            onAnimeClick={onAnimeClick} // Pass the click handler
          />
        ))}
        {left && <div className='buti2' onClick={() => scroll('left')}></div>}
        <div className='buti1' onClick={() => scroll('right')}></div>
      </div>
    </div>
  );
};

export default AnimeGallery;
