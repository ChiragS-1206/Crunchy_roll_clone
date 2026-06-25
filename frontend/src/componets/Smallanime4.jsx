import React from 'react';
import orangebook from './photos/bookorange.png';
// import './Smallanime4.css';
import './Smallanime4_1.css';

const Smallanime4 = ({ animelist2 }) => {
  if (!animelist2) return <div>Loading...</div>;

  return (
    <div className='set2'>
      <img src={animelist2.image} className='exclusive' alt={animelist2.title} />
      <div className='text1'>
        <h1 className='title20'>{animelist2.title}</h1><br />
        <h4 className='tag2'>SUB | DUB</h4><br />
        <p>{animelist2.description}</p><br />
        <div className='box2'>
          <button className='watch3'>▶ START FREE TRIAL</button>
          <div className='line1'>
            <img className='orangebook2' src={orangebook} alt="Add to Watchlist" />
            <h3 className='hi'>ADD TO WATCHLIST</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smallanime4;
