import React, { useState } from 'react'
import giftcard from "../componets/photos/giftcard.png"
import "./Giftcard.css"
import gift_board from "../componets/photos/gift_board.jpeg"



const Giftcard = () => {
    const [giftcardsearch, setgiftcardsearch] = useState("")
  return (
    <div>
        <div className='gift_container2'>
            <img className='giftcard_image'   src={giftcard}></img>
            <div className='gift_container1_2'>
                <h1 >Redeem Your Gift Card</h1>
                <p className='gift_p'>Binge-worthy anime and exclusive games. It’s all here.</p>
                <div className='Search_bar2'>
            <input
            className='search_input2'
            type='text'
            value={giftcardsearch}
            placeholder='Enter Gift Card Code'
            onChange={e=>setgiftcardsearch(e.target.value)}

            
            
            
            
            
            >
         </input>
         </div>
            <p className='gift_help'>NEED HELP?</p>
            <button className='gift_continue'> CONTINUE</button>



            </div>




        </div>
        <div className='image2_container'>
          <img className='giftcard_image2' src={gift_board}></img>
          <div className='image2_text'>
            <p>Surprise an Anime Fan With Premium Today </p>
            <p>Give the gift of ad-free anime, offline viewing and <span>more</span> on Crunchyroll.</p>
            <button className='image2_button'>SHOPS GIFT CARDS</button>

          </div>
        </div>
        <div className='gift_last'>
          <div className='gift_last2'>
         
         <div className='gift_lasttext'>
          <p className='gift_lasttext2'>Terms of Use</p>|
          <p className='gift_lasttext2'>Privacy Policy</p>|
          <p className='gift_lasttext2'>Cookie Consent Tool</p>|
          <p className='gift_lasttext2'>AdChoices</p>|
          <p className='gift_lasttext2'>Do Not Sell or Share My Personal Information</p>
         </div><hr className='gift_hr'></hr>
         <div className='INROW'>        
                  <h4 className='tag_create'> SONY PICTURES | © Crunchyroll, LLC</h4>
                  {/* <h4 className='tag5'>ENGLISH(US)</h4> */}
                  <h4>
                    <select >
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
    </div>
  )
}

export default Giftcard
