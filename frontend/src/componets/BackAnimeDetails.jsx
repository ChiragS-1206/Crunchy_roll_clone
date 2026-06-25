import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./BackAnimeDetails.css";
import orangebook from "../componets/photos/bookorange.png";
import watchboard from "../componets/photos/watch_board.png"
import plus from "../componets/photos/plus.png"
import share from "../componets/photos/share.png"
import more_option from "../componets/photos/more_option.png"
import Watchvideocard from "./Watchvideocard";
import AnimeGallery from "./AnimeGallery";
import animeData from "./animeData";

const BackAnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const toggleDetails = () => {
    setExpanded((prev) => !prev);
  };

  // useState add karo
const [isBookmarked, setIsBookmarked] = useState(false);

// Bookmark handler function
// REPLACE YOUR handleBookmarkClick FUNCTION WITH THIS:
const handleBookmarkClick = async () => {
  try {
    const response = await axios.post('/api/bookmark', {
      animeId: id
    }, {
      withCredentials: true
    });

    if (response.status === 200) {
      setIsBookmarked(true);
      console.log('Bookmark added successfully!');
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    if (error.response?.status === 401) {
      Console.log('Please login to bookmark anime');
    } else {
      Console.log('Failed to add bookmark');
    }
  }
};





  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get(
          `/api/anime/${encodeURIComponent(id)}`
        );
        setAnime(response.data);
      } catch (error) {
        console.error(
          "Error fetching anime:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  let RandomNumber = Math.floor(Math.random()*63)+1;
  let FirstNo =  RandomNumber
  let SecondNo = FirstNo+7

  if (loading) return <p>Loading...</p>;
  if (!anime) return <p>Anime not found</p>;

  return (
    <div className="anime-details">
      <div className="watch_container_1">
        <img src={anime.image} alt={anime.title} className="back-anime-image" />
        <div className="watch_container_1_1">
          <h1 className="watch_title">{anime.title}</h1>
          <h3 className="watch_subtitle">
            {anime.UA}, {anime.subtitle} {anime.genre?.join(", ")}
          </h3>

          {/* FIXED STAR RATING - First star alone, then 4 stars in next line */}
          <div className="star-rating">
            <div className="star-line-1">
              <span
                className="star_custom"
                style={{
                  fontSize: "38px",
                  color: 1 <= (hoverRating || userRating) ? "#f47521" : "lightgray",
                  cursor: "pointer",
                }}
                onClick={() => setUserRating(1)}
                onMouseOver={() => setHoverRating(1)}
                onMouseOut={() => setHoverRating(0)}
              >
                ★
              </span>
            </div>
            <div className="star-line-2">
              {[2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star_custom"
                  style={{
                    fontSize: "38px",
                    color: star <= (hoverRating || userRating) ? "#f47521" : "lightgray",
                    cursor: "pointer",
                  }}
                  onClick={() => setUserRating(star)}
                  onMouseOver={() => setHoverRating(star)}
                  onMouseOut={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
              <p className="star_mes">Rating: {anime.rating}</p>
            </div>
          </div>

          <div className="watch_button_1">
            <img className="orangebook1" src={orangebook} onClick={handleBookmarkClick} alt="orange book" />
            <img className="plusbook1" src={plus} />
            <img className="sharebook1" src={share}  />
            <img className="more_optionbook1" src={more_option}  />
            <button className="watch1">▷ START WATCHING E1</button>
          </div>

          <div className="description-container">
            <div className="watch_container_2">
              <div
                className={`watch_container_2_1 ${
                  expanded ? "expanded" : "collapsed"
                }`}
              >
                <p>{anime.desc}</p>
              </div>
              <div className="watch_container_2_2">
                <p>Audio: {anime.Audio}</p>
                <p>Subtitle: {anime.subtitle_lang}</p>
                <p>
                  Content Advisory: {anime.UA}, {anime.content_advisory}
                </p>
                <p>Genre: {anime.genre?.join(", ")}</p>
                <p>{anime.project}</p>
              </div>
            </div>

            <span className="toggle-button" onClick={toggleDetails}>
              {expanded ? "FEWER DETAILS" : "MORE DETAILS"}
            </span>
          </div>

          <hr />
          <div className="watch_board_conatainer">
            <img className="watch_board_1" src={watchboard}></img>
            {/* <button className="watch_board_button">🜲 START FREE TRAIL</button> */}
          </div>

          <div className="watch_eps">
            <div className="watch_eps_1">
              <p className="wacth_ep-title">{anime.title}</p>
              <div className="watch2_inrow">
                <p>☰ OLDEST</p>
                <p>⋮ OPTIONS</p>
              </div>
            </div>
          </div>
          
          <div>
            {anime.episodes &&
              [...Array(Math.ceil(anime.episodes.length / 4))].map((_, rowIndex) => (
                <div className="watch_videocard" key={rowIndex}>
                  {anime.episodes
                    .slice(rowIndex * 4, rowIndex * 4 + 4)
                    .map((ep) => (
                      <Watchvideocard
                        key={ep.number}
                        id ={anime.id}
                        number={ep.number}
                        title={ep.title}
                        image={ep.image}
                        name ={anime.title}
                      />
                    ))}
                </div>
              ))}
          </div>

          <button className="watch_showmore">SHOW MORE</button>

          <div className="watch_gallery">
            <AnimeGallery animeList={animeData.slice(FirstNo, SecondNo)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackAnimeDetails;