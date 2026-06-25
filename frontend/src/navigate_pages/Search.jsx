import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "./Search.css"

const Search = () => {
  const [searchtext, setsearchtext] = useState("");
  const [animeResults, setAnimeResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize navigation hook
  const navigate = useNavigate();

  // Debounce function to avoid excessive API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Function to search anime from backend
  const searchAnime = async (query) => {
    if (!query.trim()) {
      setAnimeResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/anime/search', {
        params: {
          q: query,
          limit: 8
        }
      });
      
      setAnimeResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search anime');
      setAnimeResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search with 300ms delay
  const debouncedSearch = useCallback(
    debounce(searchAnime, 300),
    []
  );

  // Effect to search when searchtext changes
  useEffect(() => {
    debouncedSearch(searchtext);
  }, [searchtext, debouncedSearch]);

  // Handle suggestion click - Navigate to anime page
  const handleSuggestionClick = (anime) => {
    const animeTitle = anime.title || anime.name;
    setsearchtext(animeTitle);
    
    // Clear suggestions after navigation
    setTimeout(() => {
      setsearchtext("");
      setAnimeResults([]);
    }, 100);
    
    // Navigate to anime page using anime.id
    navigate(`/anime/${anime.id}`);
    
    console.log("Navigating to:", `/anime/${anime.id}`);
  };

  // Handle Enter key press for first suggestion
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && animeResults.length > 0) {
      e.preventDefault();
      handleSuggestionClick(animeResults[0]);
    }
    
    if (e.key === 'Escape') {
      setsearchtext("");
      setAnimeResults([]);
    }
  };

  return (
    <div>
      {/* Search wrapper */}
      <div className="search-wrapper">
        {/* Search Bar */}
        <div className='Search_bar'>
          <input
            className='search_input'
            type='text'
            value={searchtext}
            placeholder='Search Anime...'
            onChange={(e) => setsearchtext(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        </div>

        {/* Suggestions dropdown */}
        {searchtext && (
          <div className="suggestions">
            {loading && (
              <div className="suggestion-item loading">
                <span className="loading-icon">🔍</span> 
                <span>Searching anime...</span>
              </div>
            )}
            
            {error && !loading && (
              <div className="suggestion-item error">
                <span className="error-icon">❌</span> 
                <span>{error}</span>
              </div>
            )}
            
            {!loading && !error && animeResults.length > 0 ? (
              animeResults.map((anime, index) => (
                <div 
                  key={anime.id || index}
                  className="suggestion-item clickable"
                  onClick={() => handleSuggestionClick(anime)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSuggestionClick(anime);
                    }
                  }}
                >
                  <div className="anime-info">
                    <span className="anime-title">
                      {anime.title || anime.name}
                    </span>
                    
                  </div>
                  
                </div>
              ))
            ) : !loading && searchtext && !error && (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <span>No anime found for "{searchtext}"</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='lastbox2'>
        <div className='footerinfo'>
          <div className='foot1'>
            Navigation<br></br>
            <div className='listi'>
              <p className='mar'>Browse Popular</p>
              <p className='mar'>Browse Simulcasts</p>
              <p className='mar'>Release Calendar</p>
              <p className='mar'>News</p>
              <p className='mar'>Games</p>
            </div>
          </div>
          <div className='foot1'>
            Connect With Us<br></br>
            <div className='listi'>
              <p className='mar'>Youtube</p>
              <p className='mar'>Facebook</p>
              <p className='mar'>X</p>
              <p className='mar'>Instagram</p>
              <p className='mar'>TikTok</p>
            </div>
          </div>
          <div className='foot1'>
            Crunchyroll<br></br>
            <div className='listi'>
              <p className='mar'>Start a Free Trial</p>
              <p className='mar'>About</p>
              <p className='mar'>Help Center</p>
              <p className='mar'>Terms of Use</p>
              <p className='mar'>Privacy Policy</p>
              <p className='mar'>AdChoices</p>
              <p className='mar'>Privacy Policy</p>
              <p className='mar'>Do Not Sell or Share My Personal Information</p>
              <p className='mar'>Cookie Consent Tool</p>
              <p className='mar'>Press Inquiries</p>
              <p className='mar'>Advertising Inquiries</p>
              <p className='mar'>Get the Apps</p>
              <p className='mar'>Redeem Gift Card</p>
              <p className='mar'>Jobs</p>
            </div>
          </div>
          <div className='foot1'>
            Account<br></br>
            <div className='listi'>
              <p className='mar'>Create Account</p>
              <p className='mar'>Log In</p>
            </div>
          </div>
        </div>
        <hr className='search_hr'></hr>

        <div className='INROW'>
          <h4 className='tag_create2'> SONY PICTURES | © Crunchyroll, LLC</h4>
          <h4>
            <select>
              <option>FRENCH</option>
              <option>ENGLISH(US)</option>
              <option>GERMAN</option>
              <option>RUSSIAN</option>
              <option>JAPANESSE</option>
              <option>KOREAN</option>
              <option>ITALIAN</option>
              <option>MAXICAN</option>
            </select>
          </h4>
        </div>
      </div>
    </div>
  )
}

export default Search
