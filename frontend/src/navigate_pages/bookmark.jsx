import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./bookmark.css";
import bookmark12 from "../componets/photos/bookmark.png";
import AnimeGallery3 from "../componets/AnimeGallery3";

const Bookmark = ({ username }) => {
  const [bookmarkedAnime, setBookmarkedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/user-bookmarks', {
          withCredentials: true
        });
        
        setBookmarkedAnime(response.data.bookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setError('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [username]);

  const handleDelete = async (animeId) => {
    setDeleting(animeId);
    
    try {
      const response = await axios.post('/api/bookmark/remove', {
        Animeid: animeId
      }, {
        withCredentials: true
      });

      setBookmarkedAnime(prevBookmarks => 
        prevBookmarks.filter(anime => anime.id !== animeId)
      );

      console.log('Anime removed from bookmarks successfully');
      
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Failed to remove anime from bookmarks. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const createAnimeChunks = (animeArray, chunkSize = 4) => {
    const chunks = [];
    for (let i = 0; i < animeArray.length; i += chunkSize) {
      chunks.push(animeArray.slice(i, i + chunkSize));
    }
    return chunks;
  };

  if (loading) {
    return (
      <div className='bookmark_container'>
        <div className='bookmark_box'>
          <div className='bookmark_heading'>
            <img src={bookmark12} alt="bookmark" />
            <h1>My Lists</h1>
          </div>
          <hr />
          <div className="loading-state">
            <p>Loading your bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className='bookmark_container'>
        <div className='bookmark_box'>
          <div className='bookmark_heading'>
            <img src={bookmark12} alt="bookmark" />
            <h1>My Lists</h1>
          </div>
          <hr />
          <div className="empty-state">
            <p>Please login to view your bookmarks</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bookmark_container'>
        <div className='bookmark_box'>
          <div className='bookmark_heading'>
            <img src={bookmark12} alt="bookmark" />
            <h1>My Lists</h1>
          </div>
          <hr />
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const animeChunks = createAnimeChunks(bookmarkedAnime, 4);

  return (
    <div className='bookmark_container'>
      <div className='bookmark_box'>
        <div className='bookmark_heading'>
          <img src={bookmark12} alt="bookmark" />
          <h1>My Lists</h1>
        </div>
        <hr />
        
        <div className='watchlist'>
          <h2 className='bookmark_heading2'>My Bookmarked Anime ({bookmarkedAnime.length})</h2>
        </div>

        {bookmarkedAnime.length === 0 ? (
          <div className="empty-state">
            <p>No bookmarked anime yet!</p>
            <p>Start exploring and bookmark your favorite anime.</p>
          </div>
        ) : (
          <div className='anime-cards'>
            {animeChunks.map((chunk, index) => (
              <AnimeGallery3 
                key={index} 
                animeList2={chunk} 
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
          </div>
        )}

        {/* {deleting && (
          <div className="delete-overlay">
            <div className="delete-message">
              <p>Removing anime from bookmarks...</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Bookmark;
