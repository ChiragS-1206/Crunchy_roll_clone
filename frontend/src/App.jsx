import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App1.css';
import Navbar from './componets/Navbar';
import ImageSlider from './componets/ImageSlider';
import AnimeGallery from './componets/AnimeGallery';
import Smallanime from './componets/Smallanime';
import Smallanime2 from './componets/Smallanime2';
import Smallanime4 from './componets/Smallanime4';
import ContinueWatching from './componets/ContinueWatching';

import spyImage from './componets/photos/spy.jpeg';
import fire from './componets/photos/fire.jpeg';
import blue from './componets/photos/blue.jpeg';
import board1 from './componets/photos/board1.png';
import board2 from './componets/photos/board2.png';
import board3 from './componets/photos/board3.png';
import board4 from './componets/photos/board4.png';
import board5 from './componets/photos/board5.png';
import krdunga from './componets/photos/krdunga.png';
import krdunga2 from './componets/photos/krdunga2.png';
import cat from './componets/photos/billa2.png';
import cc from './componets/photos/cc.png';

import animeData from './componets/animeData';
import smallanime4Data from "./componets/Smallanime4Data";
import smallanimedata from "./componets/smallanimedata";
import smallanime2data from "./componets/smallanime2data";

function App() {
  const imgList = [spyImage, fire, blue];
  
  // State for continue watching
  const [username, setUsername] = useState('');
  const [continueWatchingAnime, setContinueWatchingAnime] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication and fetch continue watching data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authResponse = await axios.get('/verify-auth', {
          withCredentials: true
        });
        
        if (authResponse.data.authenticated) {
          setUsername(authResponse.data.username);
          
          try {
            const continueWatchingResponse = await axios.get('/api/continue-watching', {
              withCredentials: true
            });
            setContinueWatchingAnime(continueWatchingResponse.data.continueWatching);
          } catch (error) {
            console.log('No continue watching data');
            setContinueWatchingAnime([]);
          }
        }
      } catch (error) {
        console.log('User not authenticated');
        setUsername('');
        setContinueWatchingAnime([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  // Function to add anime to continue watching
  const addToContinueWatching = async (animeId) => {
    if (!username) return;
    
    try {
      await axios.post('/api/continue-watching/add', {
        animeId: animeId
      }, {
        withCredentials: true
      });
      
      const response = await axios.get('/api/continue-watching', {
        withCredentials: true
      });
      setContinueWatchingAnime(response.data.continueWatching);
      
      console.log('Added to continue watching:', animeId);
    } catch (error) {
      console.error('Error adding to continue watching:', error);
    }
  };

  // Function to remove from continue watching
  const removeFromContinueWatching = async (animeId) => {
    setDeleting(animeId);
    
    try {
      await axios.post('/api/continue-watching/remove', {
        Animeid: animeId
      }, {
        withCredentials: true
      });

      setContinueWatchingAnime(prev => 
        prev.filter(anime => anime.id !== animeId)
      );
    } catch (error) {
      console.error('Error removing from continue watching:', error);
      alert('Failed to remove from continue watching');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <ImageSlider images={imgList} />

      {/* Continue Watching Section - Only shows if user is logged in and has data */}
      {username && (
        <ContinueWatching 
          continueWatchingAnime={continueWatchingAnime}
          onRemove={removeFromContinueWatching}
          deleting={deleting}
        />
      )}

      <div className='base2'>
        <h1 className='tag'>Kickstart Your Anime Journey For Free!</h1>
        <h4 className='tag2'>Welcome to the amazing world of anime</h4>
        <AnimeGallery 
          animeList={animeData.slice(0,8)} 
          onAnimeClick={addToContinueWatching}
        />
      </div>
      
      <div className='base'>
      </div>

      <div className='base2'>
        <h1 className='tag'>April 2025 Seasonal Sampler</h1>
        <h4 className='tag2'>Check out the first few episodes of these new shows for free!</h4>
        <AnimeGallery 
          animeList={animeData.slice(5,13)} 
          onAnimeClick={addToContinueWatching}
        />
      </div>
      
      <div className='base'>
        <br></br><br></br><br></br>
        <div className='INROW'>        
          <h1 className='tag3'>New Episodes</h1>
          <h4 className='tag4'>VIEW RELEASE CALENDAR</h4>
        </div><br></br>
        <h2 className='tag'>Today</h2><br></br><hr></hr><br></br>
        <Smallanime animelist3={smallanimedata[0]} />
        <Smallanime animelist3={smallanimedata[0]} />
        <h2 className='tag'>Yesterday</h2><br></br><hr></hr><br></br>
        <div className='inline'> 
          <Smallanime animelist3={smallanimedata[1]} />
          <Smallanime animelist3={smallanimedata[2]} />
          <Smallanime animelist3={smallanimedata[3]} />
          <Smallanime animelist3={smallanimedata[3]} />
        </div>
        <h3 className='showmore'>SHOW MORE</h3>
        <img src={board2} className='board2'></img><br></br><br></br>
      </div>
      
      <div className='base2'>
        <h1 className='tag'>Most Popular Free Animes</h1>
        <h4 className='tag2'>Stream these most popular titles for free!</h4>
        <AnimeGallery 
          animeList={animeData.slice(10,18)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>Watch Hindi Dubs For Free</h1>
        <h4 className='tag2'>Check out these great Hindi dubs!</h4>
        <AnimeGallery 
          animeList={animeData.slice(15,23)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>Free Tamil & Telugu Dubbed Shows</h1>
        <AnimeGallery 
          animeList={animeData.slice(20,28)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>Free Anime Like The Aporthecary Diaries</h1>
        <AnimeGallery 
          animeList={animeData.slice(25,33)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>Top Picks For Solo Leveling Fans!</h1>
        <AnimeGallery 
          animeList={animeData.slice(30,38)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>Broken Heroes</h1>
        <h4 className='tag2'>They're imperfectly perfect</h4>
        <AnimeGallery 
          animeList={animeData.slice(35,43)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
      </div>
      
      <div className='base'>
        <img src={board3} className='board3'></img><br></br><br></br>
      </div>
      
      <div className='break'>
        <div className='base1'>
          <div className='INROW'>        
            <h1 className='tag3'>Crunchyroll News</h1>
            <h4 className='tag4'>VIEW ALL</h4>
          </div><br></br>
          <div className='set'> 
            <div className='hori'>
              TOP NEWS
              <img src={krdunga} className='krdunga'></img>
              <img src={krdunga2} className='krdunga'></img>
            </div>
            <div className='hori'>
              Latest
              <Smallanime2 animelist4={smallanime2data[0]} />
              <Smallanime2 animelist4={smallanime2data[1]} />
              <Smallanime2 animelist4={smallanime2data[2]} />
              <Smallanime2 animelist4={smallanime2data[3]} />
            </div>
          </div>
        </div>
        <img className='extra'  src={cc}/>
      </div>
      
      <div className='base'>
        <Smallanime4 animelist2={smallanime4Data[0]} />     
        <Smallanime4 animelist2={smallanime4Data[1]} />
      </div>
      
      <div className='base2'>
        <h1 className='tag'>Hidden Gems</h1>
        <h4 className='tag2'>The handpicked collection of fascinating titles for the fans!</h4>
        <AnimeGallery 
          animeList={animeData.slice(40,48)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>Kickstart Your Anime Journey For Free!</h1>
        <h4 className='tag2'>Welcome to the amazing world of anime</h4>
        <AnimeGallery 
          animeList={animeData.slice(45,53)} 
          onAnimeClick={addToContinueWatching}
        />
      </div>
      
      <div className='base'>
        <br></br><br></br>
        <img src={board4} className='board3'></img><br></br><br></br>
        <Smallanime4 animelist2={smallanime4Data[2]} />
      </div><br></br><br></br>
      
      <div className='base2'>
        <h1 className='tag'>Free Anime Classics</h1>
        <h4 className='tag2'>Watch some of the most iconic anime for free!</h4>
        <AnimeGallery 
          animeList={animeData.slice(50,58)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>The Ultimate Isekai Watchlist</h1>
        <h4 className='tag2'>Welcome to your journey to another world!</h4>
        <AnimeGallery 
          animeList={animeData.slice(55,63)} 
          onAnimeClick={addToContinueWatching}
        />
      </div>
      
      <div className='base'>
        <br></br><br></br>
        <img src={board5} className='board3'></img><br></br><br></br>
        <Smallanime4 animelist2={smallanime4Data[3]} />
      </div><br></br><br></br>
      
      <div className='base2'>
        <h1 className='tag'>Romance!</h1>
        <h4 className='tag2'>Love and Slice of Life</h4>
        <AnimeGallery 
          animeList={animeData.slice(60,68)} 
          onAnimeClick={addToContinueWatching}
        /><br></br><br></br>
        
        <h1 className='tag'>Sample These Popular Anime For Free!</h1>
        <AnimeGallery 
          animeList={animeData.slice(62,70)} 
          onAnimeClick={addToContinueWatching}
        />
      </div><br></br><br></br><br></br><br></br>
      
      <div className='base'>
        <img src={cat} className='cat'></img>
        <div className='cattext'><br></br>
          <h3>Still looking for something to watch?</h3>
          <h3> Check out our full library</h3>
        </div><br></br>
        <h3 className='VIEW'>VIEW ALL</h3><br></br><br></br><br></br><br></br>
      </div>
      
      <div className='lastbox'>
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
        <div className='footinfo2'>
          <br></br>
          <hr></hr>
          <br></br>
          <div className='INROW'>        
            <h4 className='tag_create'> SONY PICTURES | © Crunchyroll, LLC</h4>
            <h4>
              <select >
                <option>ENGLISH(US)</option>
                <option>FRENCH</option>
                <option>GERMAN</option>
                <option>RUSSIAN</option>
                <option>JAPANESSE</option>
                <option>KOREAN</option>
                <option>ITALIAN</option>
                <option>MAXICAN</option>
              </select>
            </h4>
          </div><br></br>
          <hr ></hr>
          <br></br>
          <div className='INROW2'>
            <div className='footer_txt'>     
              <h4 className='tag6'> 
                Welcome to Crunchyroll, your ultimate destination\n for streaming the best in anime entertainment. Whether you're a lifelong fan or just starting your anime journey, Crunchyroll offers an extensive library of top-tier anime series and movies. From action-packeadventures like Naruto and One Piece to fan-favorites such as Demon SlayeranAttack on Titan, we bring the world of anime right to your screen. With
              </h4>
            </div>   
            <div className='footer_txt'>
              <h4 className='tag6'>With simulcasts straight from Japan, you'll never miss a moment of the latest and greatest anime releases. Our selection goes beyond just series—enjoy a handpicked selection of anime movies that showcase the best in animation and storytelling. Watch anytime, anywhere, with the Crunchyroll app available across all your devices.</h4>
            </div>
          </div><br></br>
          <h4 className='lastword'> MORE DETAILS</h4>
        </div>
      </div>
    </>
  );
}

export default App;
