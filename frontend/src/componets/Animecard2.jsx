import React from 'react';
import { Link } from 'react-router-dom';
import "./Animecard2_1.css";

const Animecard2 = ({ 
  id,
  title, 
  subtitle, 
  image, 
  desc, 
  rating, 
  episode, 
  season,
  onAnimeClick 
}) => {
  // Create anime ID for routing - use title if id is not provided
  const animeId = id || encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));

  const handleCardClick = (e) => {
    // Add to continue watching when card is clicked
    if (onAnimeClick) {
      onAnimeClick(animeId);
    }
    // Navigation will happen automatically due to Link component
    console.log(`Navigating to anime: ${animeId}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick(e);
    }
  };

  return (
    <Link 
      to={`/anime/${animeId}`} 
      className="anime-card-link" 
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      <div className='theek'>
        <div className='anime-card2'>
          <div className="anime-image-container">
            <img 
              src={image} 
              className='anime-image2' 
              alt={`${title} poster`}
              loading="lazy"
              onError={(e) => {
                e.target.src = '/images/placeholder-anime.jpg'; // Fallback image
              }}
            />
            
          </div>
          
          <div className='anime-info2'>
            <h3 className="anime-title">{title}</h3>
            <p className="anime-subtitle">{subtitle}</p>
          </div>
          
          <div className='text2'>
            <p className="anime-main-title">{title}</p>
            <br />
            <div className="anime-rating">
              <p>{rating}</p>
            </div>
            <div className='grey2'>
              <p className="anime-season">{season}</p>
              <p className="anime-episode">{episode}</p>
            </div>
            <p className="anime-description">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Animecard2;
