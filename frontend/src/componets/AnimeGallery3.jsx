import React, { useRef, useState, useEffect } from 'react';
import AnimeCard3 from './Animecard3';
import "./AnimeGallery3.css";

const AnimeGallery3 = ({ 
  animeList2, 
  onDelete, 
  deleting, 
  onAnimeClick 
}) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Check if we need scroll buttons based on card count and screen width
  useEffect(() => {
    const checkScrollNeed = () => {
      if (animeList2.length >= 6) {
        setShowRight(true);
      } else {
        setShowRight(false);
        setShowLeft(false);
      }
    };

    checkScrollNeed();
    window.addEventListener('resize', checkScrollNeed);
    return () => window.removeEventListener('resize', checkScrollNeed);
  }, [animeList2.length]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth;
    
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      // Check if we're back at the beginning
      setTimeout(() => {
        if (container.scrollLeft <= 0) {
          setShowLeft(false);
        }
      }, 300);
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setShowLeft(true);
    }
  };

  return (
    <div className='anime-gallery-container3'>
      <div className="anime-gallery3" ref={scrollRef}>
        {animeList2.map((anime, index) => ( 
          <AnimeCard3
            key={anime.id || index}
            title={anime.title}
            subtitle={anime.subtitle}
            image={anime.image}
            animeId={anime.id}
            onDelete={onDelete}
            isDeleting={deleting === anime.id}
            onAnimeClick={onAnimeClick}
          />
        ))}
      </div>
      
      {/* Right button - Only show when 6+ cards */}
      {showRight && <div className='scroll-btn-right3' onClick={() => scroll('right')}></div>}
      
      {/* Left button - Only show after scrolling right */}
      {showLeft && <div className='scroll-btn-left3' onClick={() => scroll('left')}></div>}
    </div>
  );
};

export default AnimeGallery3;
