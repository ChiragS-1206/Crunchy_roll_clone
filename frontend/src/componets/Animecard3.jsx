import React from 'react';
import "./Animecard3.css";

const Animecard3 = ({ 
  title, 
  subtitle, 
  image, 
  animeId, 
  onDelete, 
  isDeleting, 
  onAnimeClick 
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click when deleting
    onDelete(animeId);
  };

  const handleCardClick = () => {
    if (onAnimeClick) {
      onAnimeClick(animeId);
    }
    console.log('Clicked anime:', animeId);
  };

  return (
    <div 
      className={`anime-card3 ${isDeleting ? 'deleting' : ''}`}
      onClick={handleCardClick}
    >
      <img src={image} alt={title} className='anime-image2' />
      
      <div className='anime-info3'>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        
        {/* Remove Button - only show if onDelete function is provided */}
        {onDelete && (
          <button 
            className="remove-btn"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Animecard3;
