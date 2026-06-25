import React from 'react'
import Animecard2 from '../componets/Animecard2'
import { useNavigate } from 'react-router-dom'
import AnimeGallery2 from '../componets/AnimeGallery2'
import "./New_navbar.css"
import animeData from '../componets/animeData'

const Popular_navbar = () => {
  // Combine all anime data into one array for unified grid
  const combinedAnimeData = [
    ...animeData.slice(19, 31),
    ...animeData.slice(35, 45), 
    ...animeData.slice(50, 60),
    ...animeData.slice(60, 70)
  ];

  return (
    <div>
      <div className='new_nav'>
        <div className='new_nav2'>
          <div>
            <h1>Most Popular Anime</h1>
          </div>
          <div className='inline_1'>
            <h2 className='h2-hover'>☰Newest</h2>
            <h2 className='h2-hover'>🔍Filter</h2>
          </div>
        </div>
        <br />
        <h3>Popular</h3>
      </div>
      
      <div className='anime-cards'>
        {/* Single gallery with all combined data for proper 6-column grid */}
        <AnimeGallery2 animeList2={combinedAnimeData} />
      </div>
      
      <br /><br /><br /><br /><br />
      
      {/* Footer Section */}
      <div className='lastbox'>
        <div className='footerinfo'>
          <div className='foot1'>
            Navigation<br />
            <div className='listi'>
              <p className='mar'>Browse Popular</p>
              <p className='mar'>Browse Simulcasts</p>
              <p className='mar'>Release Calendar</p>
              <p className='mar'>News</p>
              <p className='mar'>Games</p>
            </div>
          </div>
          <div className='foot1'>
            Connect With Us<br />
            <div className='listi'>
              <p className='mar'>Youtube</p>
              <p className='mar'>Facebook</p>
              <p className='mar'>X</p>
              <p className='mar'>Instagram</p>
              <p className='mar'>TikTok</p>
            </div>
          </div>
          <div className='foot1'>
            Crunchyroll<br />
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
            Account<br />
            <div className='listi'>
              <p className='mar'>Create Account</p>
              <p className='mar'>Log In</p>
            </div>
          </div>
        </div>
        
        <div className='footinfo2'>
          <br />
          <hr />
          <br />
          <div className='INROW'>        
            <h4 className='tag_create'>SONY PICTURES | © Crunchyroll, LLC</h4>
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
          <br />
          <hr />
          <br />
          <div className='INROW2'>        
            <h4 className='tag6'> 
              Welcome to Crunchyroll, your ultimate destination for streaming the best in anime entertainment. Whether you're a lifelong fan or just starting your anime journey, Crunchyroll offers an extensive library of top-tier anime series and movies. From action-packed adventures like Naruto and One Piece to fan-favorites such as Demon Slayer and Attack on Titan, we bring the world of anime right to your screen.
            </h4>
            <h4 className='tag6'>
              With simulcasts straight from Japan, you'll never miss a moment of the latest and greatest anime releases. Our selection goes beyond just series—enjoy a handpicked selection of anime movies that showcase the best in animation and storytelling. Watch anytime, anywhere, with the Crunchyroll app available across all your devices.
            </h4>
          </div>
          <br />
          <h4 className='lastword'>MORE DETAILS</h4>
        </div>
      </div>
    </div>
  )
}

export default Popular_navbar
