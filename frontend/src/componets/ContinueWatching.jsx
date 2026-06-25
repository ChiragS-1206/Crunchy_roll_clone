import React from 'react';
import AnimeGallery3 from './AnimeGallery3';
import './ContinueWatching.css';

const ContinueWatching = ({ continueWatchingAnime, onRemove, deleting }) => {
  if (!continueWatchingAnime || continueWatchingAnime.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <div className="continue-watching-section">
      <div className="base2">
        <h1 className='tag'>Continue Watching</h1>
        <h4 className='tag2'>Pick up where you left off ({continueWatchingAnime.length} items)</h4>
        
        <div className="continue-watching-grid">
          <AnimeGallery3 
            animeList2={continueWatchingAnime} 
            onDelete={onRemove}
            deleting={deleting}
          />
        </div>
      </div>
    </div>
  );
};

export default ContinueWatching;
