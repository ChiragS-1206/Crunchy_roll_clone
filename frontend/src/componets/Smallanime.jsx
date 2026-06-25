import React from 'react'
// import sample1 from './photos/sample1.png';
// import sample2 from './photos/dragonballsample.png';
// import sample3 from './photos/300slimesample.png';
// import sample4 from './photos/anneshirleysample.png';
// import "./Smallanime.css";
import "./Smallanime1.css";

const Smallanime = ({ animelist3 }) =>  {
  return (
   <div className='new'>
           <img src={animelist3.img} className='sample1'></img>
           <div className='neweptext'>
           <pre>
             {animelist3.title}
                  <pre className='pre2'>{animelist3.episodes}</pre> 
             <div className='today'>
               <h6>SUB | DUB</h6>
               <h6>{animelist3.time}</h6>
   
             </div>
             
    
   
           </pre>
           </div>
           </div>
 
  )
}

export default Smallanime
