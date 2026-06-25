import React from 'react'
import "./Watchvideocard.css";
import { Link } from 'react-router-dom';
// import blackclover_1 from "../componets/ep_photos/blackclover_1.png"

const Watchvideocard = ({id, name,title,number,image }) => {
  return (
    <Link to={`/watch/${id}/${number}`}   >
    <div className='full_card'>

        <div className='episodes_anime'>
            <img src={image} alt={`Episode ${number}`} className="eps_image" />
            
            <p>{name}</p>
            
            <p className="watch_card_title">Episode {number}: {title}</p>
            <p>Dub | Sub</p>
           
        </div>

    </div>
    </Link>
  )
}

export default Watchvideocard
