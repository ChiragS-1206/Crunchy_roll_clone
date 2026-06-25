
// import "./Smallanime2.css";
import "./Smallanime2_1.css";


const Smallanime2 = ({animelist4}) => {
  return (
    <div className="high">
    <div className='set'>
          <img src={animelist4.img}></img>
          <pre>
            <h2 className="title">{animelist4.title}</h2>
            <div className='hehe'>
               <h4>{animelist4.time}</h4>
               <h4>{animelist4.author}</h4>
   
             </div>
            </pre>
        </div>
        </div>
  )
}

export default Smallanime2
