import React from 'react'
import "./Premium_nav.css"
import AnimeGallery2 from '../componets/AnimeGallery2'
import animeData from '../componets/animeData'





import connection from "../componets/photos/connection.png"
import prem_clock from "../componets/photos/pre_clock.png"
import exclamation from "../componets/photos/exclamation.png"
import plane from "../componets/photos/plane.png"
import pc from "../componets/photos/pc.png"
import prem_board4 from "../componets/photos/prem_board4.jpeg"

// import premium from "../componets/photos/premiumboard.jpej"

const Premium_nav = () => {
  return (
    <div className='prem_container_orig'>
        <div className='prem_contianer1'>
            <nav className='prem_nav'>
                 <div className="logo-container">
                          <img src={connection} className="logo" alt="Crunchyroll" />
                          <span className="brand-name">Crunchyroll</span>
                </div>
                <div className='prem_nav2'>
                    <button className='prem_navbut1'>LOG IN</button>
                    <button className='prem_navbut2'>EXPLORE</button>
                </div>



            </nav>
            <div className='prem_contianer2'>
            <div className='prem_cont2_1'>
            <p>Upgrade Your Anime Experience </p>
            <p>with Premium</p>
            </div>
            <button className='prem_contbut1'>  🜲 Try Mega Fan Free For  7 Days </button>
            <p>After your free Crunchyroll Premium: Mega Fan trial, your account will automatically renew at ₹99.00 per month. You may cancel at any time.</p>
            <h4 className='pre_orange'>COMPARE ALL PLANS 🡫 </h4>
            </div>
            <div className='prem_cont2_2'>
            <p className='pre_big'>Get More with Premium</p>
            <h4 className='pre_orange'>COMPARE ALL PLANS 🡫 </h4>
            </div>




        </div>
        <div className='prem_contianer3'>
          <div className=' prem_box'>
            <div className='prem_contianer3_1'>
              <div className='prem_contianer3_1_1'>
                <img className='prem_image1'  src={prem_clock}></img>
                
                <p className='prem_centext'>New episodes shortly after airing in Japan</p>
              </div>
              <div className='prem_contianer3_1_1'>
                <img className='prem_image1'  src={exclamation}></img>
                
                <p className='prem_centext' >Ad-free anime</p>
              </div>

            </div>
            <div className='prem_contianer3_2'>
              <div className='prem_contianer3_1_1'>
                <img className='prem_image1'  src={plane}></img>
                
                <p className='prem_centext'>Offline Viewing</p>
              </div>
              <div className='prem_contianer3_1_1'>
                <img className='prem_image1'  src={pc}></img>
                
                <p className='prem_centext'>Simultaneously stream on multiple devices*</p>
              </div>


            </div>







          </div>

        </div>
        <div className='prem_contianer4'>
          <div className='prem_contianer4_1'>
            <p className='premboard4_title'>Pick Your Premium</p>
            <div className='prem_contianer4_1_1'>
              <div className='prem_contianer4_1_1_1'>
                <p>FAN</p>
                <p>₹79.00/mo</p>
                <p>VAT INCLUSIVE</p>
                <button className='prem_board3_but_1'> START 7-DAY FREE TRAIL</button>
                <p>SKIP FREE TRAIL</p>
                <p>Stream the entire Crunchyroll library ad-free and watch new episodes shortly after Japan*</p>
                <p>----------------------PLUS---------------------</p>
                <p>🔥Stream on 1 device at a time</p>
                
              </div>

              <div className='prem_contianer4_1_1_2'>
                <h3>MOST POPULAR</h3>
                <p> MEGA FAN</p>
                <p>₹99.00/mo</p>
                <p>VAT INCLUSIVE</p>
                <button className='prem_board3_but_1'> START 7-DAY FREE TRAIL</button>
                <p>SKIP FREE TRAIL</p>
                <p>Stream the entire Crunchyroll library ad-free and watch new episodes shortly after Japan*</p>
                <p>----------------------PLUS---------------------</p>
                <p>🔥Stream on 4 device at a time</p>
                <p>🔥Offline Viewing</p>
                <p>🔥Access Crunchyroll Game Vault, a catalog of free games</p>


              </div>

              <div className='prem_contianer4_1_1_2'>
                <p> MEGA FAN</p>
                <p>₹999.00/yr</p>
                <p>VAT INCLUSIVE</p>
                <button className='prem_board3_but_1'> START 7-DAY FREE TRAIL</button>
                <p>SKIP FREE TRAIL</p>
                <p>Stream the entire Crunchyroll library ad-free and watch new episodes shortly after Japan*</p>
                <p>----------------------PLUS---------------------</p>
                <p>🔥Stream on 4 device at a time</p>  
                <p>🔥Offline Viewing</p>  
                <p>🔥Access Crunchyroll Game Vault, a catalog of free games</p>  
                <p>🔥16% discount on Monthly Plan (billed every 12-months)</p>  

              </div>

            </div>
            <p className='premboard4_content'>Free trial offer valid for new and eligible subscribers. Plan automatically renews after trial period at the price selected in the plan comparison. You may cancel at any time. Restrictions and other terms apply, including changes to prices, discounts, content and features.</p>


          
          
          
          
          
          
          
          </div>


        </div>
        <div className='prem_container5'>
          <p>Be the First to Watch</p>
          <p>Stream full seasons of the top anime, simulcasts, Crunchyroll Originals, and more!</p>
          <div  className='prem_container5_1'>
            <AnimeGallery2 animeList2={animeData.slice(21, 25)} />

          </div>

        </div>
        <div className='prem_container6'>
          <img className='prem_container6_1' src={prem_board4}></img>
          <div className='prem_container6_2'>
            <p>✈︎ Offline Watching</p>
            <p>Keep watching all your favourite shows on the road with</p>
            <p>Mega and Ultimate Fans and unlock Offline Viewing.</p>
          </div>




        </div>
        <div className='prem_container7'>
          <div className='prem_container7_1'>          
            <p>Questions?</p>
            <p>Visit our <span>Help Center</span> to learn more.</p>

          </div  >
          <p className='prem_container7_3'>*Device and content availability vary by country or region.</p>
          <div className='prem_container7_2'>
          <p>Terms of Use</p>|
          <p>Privacy Policy</p>|
          <p>Cookie Consent Tool</p>
          <p>AdChoices</p>|
          <p>Your Privacy Choices</p>
          </div>
          <hr className='prem_container7_hr'></hr>
          

          <div className='INROW7'>        
                  <h4 className='tag_create7'> SONY PICTURES | © Crunchyroll, LLC</h4>
                  {/* <h4 className='tag5'>ENGLISH(US)</h4> */}
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
              
              </div>


        </div>







      
    </div>
  )
}

export default Premium_nav
