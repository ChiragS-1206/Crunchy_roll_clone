// import React, { useState } from 'react';
// // import "./ImageSlider.css"
// import "./ImageSlider1.css"
// import lessthan from './photos/lessthan.png';
// import great from './photos/great.png';
// import orangebook from './photos/bookorange.png';


// const ImageSlider = ({ images }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const goToPrevious = () => {
//     setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
//   };

//   const goToNext = () => {
//     setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
//   };

//   return (
//     <div>
//       <img className='spy' src={images[currentIndex]}  />
//       <div>
//         {/* <button className='pre' onClick={goToPrevious}> */}
//           <img className='less'  src={lessthan} onClick={goToPrevious} />
          

//         {/* </button> */}
//         {/* <button className='next' onClick={goToNext}> */}
//         <img className='great'  src={great} onClick={goToNext}   />

//         {/* </button> */}

//         <button className='watch'>▷ START WATCHING S1 E1</button>
//         {/* <button> */}
//         <img className='orangebook'  src={orangebook} />

//         {/* </button> */}

//       </div>
//     </div>
//   );
// };

// export default ImageSlider;
import React, { useState } from 'react';
import "./ImageSlider1.css"
// import "./ImageSlider.css"
import lessthan from './photos/lessthan.png';
import great from './photos/great.png';
import orangebook from './photos/bookorange.png';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="slider-container">
      <div className="spy">
        <img src={images[currentIndex]} alt="Slider" />
        <img className="less" src={lessthan} onClick={goToPrevious} alt="Previous" />
        <img className="great" src={great} onClick={goToNext} alt="Next" />

        <div className="slider-controls-bottom">
          <button className="watch">▷ START WATCHING S1 E1</button>
          <img className="orangebook" src={orangebook} alt="Bookmark" />
        </div>

      </div>
    </div>
  );
};

export default ImageSlider;
