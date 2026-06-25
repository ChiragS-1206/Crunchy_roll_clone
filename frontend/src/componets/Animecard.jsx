import React from 'react';
import { Link } from 'react-router-dom';
import "./Animecard1.css";

const AnimeCard = ({ 
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
  const animeId = encodeURIComponent(id);

  const handleCardClick = () => {
    // Add to continue watching when card is clicked
    if (onAnimeClick) {
      onAnimeClick(id);
    }
    // Navigation will happen automatically due to Link component
  };

  return (
    <Link to={`/anime/${id}`} className="anime-card-link" onClick={handleCardClick}>
      <div className='theek'>
        <div className='anime-card'>
          <img src={image} className='anime-image' alt={title} />
          <div className='anime-info'>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <div className='text'>
            <p>{title}</p><br />
            <p>{rating}</p>
            <div className='grey'>
              <p>{season}</p>
              <p>{episode}</p>
            </div>
            <p>{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
