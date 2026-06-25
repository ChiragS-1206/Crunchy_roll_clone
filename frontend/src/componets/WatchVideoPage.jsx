import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import video_board from "../componets/photos/video_board.jpeg";
import like from "../componets/photos/like.png";
import dislike from "../componets/photos/dislike.png";
import bookmark from "../componets/photos/bookmark.png"
import "./WatchVideoPage.css";
import axios from "axios";
import HLSVideoPlayer from "./HLSVideoPlayer"

const WatchVideoPage = () => {
  const { animeid, episodenumber } = useParams();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamData, setStreamData] = useState(null);
  const [streamLoading, setStreamLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  // Fetch anime data
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await axios.get(
          `/api/anime/${encodeURIComponent(animeid)}`
        );
        setAnime(res.data);
      } catch (error) {
        console.error("Problem fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeid]);

  // Convert to HLS and wait for completion
  const convertAndWaitForHLS = async (initialStreamData) => {
    try {
      setConverting(true);
      console.log('🚀 Starting HLS conversion...');
      
      const response = await axios.post('/api/convert-to-hls', {
        videoPath: initialStreamData.originalUrl,
        animeId: animeid,
        episodeNumber: episodenumber
      });
      
      if (response.data.success) {
        console.log('✅ HLS conversion completed:', response.data);
        setStreamData({
          hlsUrl: response.data.hlsUrl,
          type: 'hls',
          available: true,
          videoId: response.data.videoId
        });
        setConverting(false);
      }
    } catch (error) {
      console.error('❌ Conversion failed:', error);
      setStreamData({
        ...initialStreamData,
        type: 'mp4',
        conversionFailed: true
      });
      setConverting(false);
    }
  };

  // Fetch streaming data
  useEffect(() => {
    const fetchStreamData = async () => {
      if (!animeid || !episodenumber) return;
      
      try {
        setStreamLoading(true);
        const response = await axios.get(
          `/api/anime/${animeid}/episode/${episodenumber}/stream`
        );
        
        console.log('Stream data:', response.data);
        
        // If HLS is already available, use it directly
        if (response.data.type === 'hls' && response.data.available) {
          setStreamData(response.data);
          setStreamLoading(false);
        } 
        // If needs conversion, start conversion process
        else if (response.data.needsConversion) {
          console.log('🔄 Starting conversion process...');
          setStreamLoading(false);
          await convertAndWaitForHLS(response.data);
        } 
        // Fallback to original video
        else {
          setStreamData(response.data);
          setStreamLoading(false);
        }
        
      } catch (error) {
        console.error('Failed to fetch stream data:', error);
        setStreamData({ error: 'Stream not available' });
        setStreamLoading(false);
      }
    };

    fetchStreamData();
  }, [animeid, episodenumber]);

  // Handle play button click
  const handlePlayClick = () => {
    if (streamData && !converting) {
      setVideoStarted(true);
    }
  };

  // Handle video progress tracking
  const handleVideoProgress = (progress) => {
    const progressData = {
      currentTime: progress.currentTime,
      duration: progress.duration,
      progress: progress.progress,
      timestamp: Date.now(),
      animeId: animeid,
      episodeNumber: episodenumber,
      animeTitle: anime?.title
    };
    
    localStorage.setItem(
      `watch_progress_${animeid}_${episodenumber}`,
      JSON.stringify(progressData)
    );

    const continueWatching = JSON.parse(localStorage.getItem('continue_watching') || '[]');
    const existingIndex = continueWatching.findIndex(
      item => item.animeId === animeid && item.episodeNumber === episodenumber
    );

    if (existingIndex >= 0) {
      continueWatching[existingIndex] = { ...continueWatching[existingIndex], ...progressData };
    } else {
      continueWatching.unshift(progressData);
      if (continueWatching.length > 10) {
        continueWatching.pop();
      }
    }

    localStorage.setItem('continue_watching', JSON.stringify(continueWatching));
  };

  // Handle video end (auto-next episode)
  const handleVideoEnd = () => {
    const currentEpNum = parseInt(episodenumber);
    const nextEpisode = anime?.episodes.find(ep => ep.number === currentEpNum + 1);
    
    if (nextEpisode) {
      window.location.href = `/watch/${animeid}/${nextEpisode.number}`;
    }
  };

  if (loading) return (
    <div className="page-loading-container">
      <p>Loading anime details...</p>
    </div>
  );
  
  if (!anime) return (
    <div className="page-error-container">
      <p>❌ Anime not found</p>
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );

  const currentEpNum = parseInt(episodenumber);
  const episode = anime.episodes.find(ep => ep.number === currentEpNum);

  if (!episode) return (
    <div className="page-error-container">
      <p>❌ Episode not found</p>
      <Link 
        to={`/anime/${animeid}`} 
        className="back-link"
      >
        ← Back to Anime Details
      </Link>
    </div>
  );

  return (
    <div>
      {/* Video Player Section */}
      <div className="video-player-section">
        {streamLoading ? (
          // Initial loading
          <div className="video-loading-state">
            <div className="video-loading-content">
              <div className="video-loading-spinner"></div>
              <p>Loading stream...</p>
            </div>
          </div>
        ) : converting ? (
          // Show conversion progress
          <div className="video-loading-state">
            <div className="video-loading-content">
              <div className="video-loading-spinner"></div>
              <p>Preparing HD video...</p>
              <p className="video-loading-subtitle">
                This may take a few moments
              </p>
            </div>
          </div>
        ) : !videoStarted && streamData && !streamData.error ? (
          // Poster with Play Button
          <div 
            className="video-poster"
            style={{
              backgroundImage: `url(${episode.image})`
            }}
            onClick={handlePlayClick}
          >
            {/* Dark overlay */}
            <div className="video-poster-overlay"></div>
            
            {/* Play Button */}
            <div className="video-play-button">
              {/* Play Triangle */}
              <div className="video-play-triangle"></div>
            </div>
            
            {/* Episode Info Overlay */}
            <div className="video-episode-info">
              <h3 className="video-episode-title">
                Episode {episode.number}: {episode.title}
              </h3>
              <p className="video-episode-subtitle">
                {anime.title} • {anime.UA}
              </p>
            </div>
            
            {/* Quality Badge */}
            <div className={`video-quality-badge ${streamData.type === 'hls' ? 'hls-quality' : 'standard-quality'}`}>
              {streamData.type === 'hls' ? '4K HD' : 'HD'}
            </div>
          </div>
        ) : videoStarted && streamData && !streamData.error ? (
          // Actual Video Player
          streamData.type === 'hls' ? (
            <HLSVideoPlayer
              streamUrl={`${window.location.origin}${streamData.hlsUrl}`}
              
              title={`${anime.title} - Episode ${episode.number}: ${episode.title}`}
              onTimeUpdate={handleVideoProgress}
              onVideoEnd={handleVideoEnd}
              onError={(error) => console.error('HLS Error:', error)}
              autoPlay={true}
              className="main-video-player"
            />
          ) : (
            <div className="fallback-video-container">
              <video
                key={episode.video}
                width="100%"
                height="420px"
                controls
                autoPlay
                poster={episode.image}
                src={episode.video || streamData.originalUrl}
                onTimeUpdate={(e) => handleVideoProgress({
                  currentTime: e.target.currentTime,
                  duration: e.target.duration,
                  progress: e.target.currentTime / (e.target.duration || 1)
                })}
                onEnded={handleVideoEnd}
                className="fallback-video-element"
              >
                Your browser does not support the video tag.
              </video>
              
              {streamData.conversionFailed && (
                <div className="conversion-failed-badge">
                  ⚠️ Playing original quality
                </div>
              )}
            </div>
          )
        ) : (
          // Error State
          <div className="video-error-state">
            <div>
              <p className="video-error-title">
                ❌ Stream not available
              </p>
              <p className="video-error-subtitle">
                Please try again later or contact support
              </p>
            </div>
          </div>
        )}
      </div>

      {/* All Your Existing Content - UNCHANGED */}
      <div className="video_container_1">
        <div className="video_container_1_1">
          <img src={video_board} className="video_board" alt="Premium" />
        </div>
        <button className="video_cont_button">🜲 TRY PREMIUM FREE</button>
        <div className="video_container_1_2">
          <p>Want to watch without ads?</p>
          <p>Try Premium free for 7 days, cancel any time.</p>
        </div>
      </div>

      <div className="video_container_2">
        <div className="video_container_2_1">
          <div className="video_container_2_1_1">
            <p>
              {anime.title} {anime.rating}
            </p>
            <img className="eps_bookmark" src={bookmark} alt="Bookmark" />
          </div>
          <p>
            Episode {episode.number}: {episode.title}
          </p>
          <p>
            {anime.UA} • {anime.subtitle}
          </p>

          <div className="video_container_2_1_2">
            <div className="thumb-box1">
              <img className="like_dis_size" src={like} alt="like" />
              <div
                className="color-fill"
                style={{
                  WebkitMaskImage: `url(${like})`,
                  maskImage: `url(${like})`,
                }}
              ></div>
            </div>

            <div className="thumb-box2">
              <img className="like_dis_size" src={dislike} alt="dislike" />
              <div
                className="color-fill"
                style={{
                  WebkitMaskImage: `url(${dislike})`,
                  maskImage: `url(${dislike})`,
                }}
              ></div>
            </div>
          </div>

          <p>{anime.desc}</p>
          <br />

          <div className="video_container_2_1_1">
            <p>Audio</p>
            <p>{anime.Audio}</p>
          </div>
          <hr />
          <br />

          <div className="video_container_2_1_1">
            <p>Subtitles</p>
            <p>{anime.subtitle_lang}</p>
          </div>
          <hr />
          <br />

          <div className="video_container_2_1_1">
            <p>Content Advisory</p>
            <p>
              {anime.UA} {anime.content_advisory}
            </p>
          </div>
          <hr />
          <br />
        </div>

        <div className="video_container_2_2">
          <p>ALL EPISODES</p>

          <div className="all-episodes-container">
            {anime.episodes.map((ep) => (
              <div 
                key={ep.number} 
                className={`episode-preview ${ep.number === currentEpNum ? 'current-episode' : ''}`}
              >
                <Link to={`/watch/${animeid}/${ep.number}`}>
                  <img
                    className="episode-preview-image"
                    src={ep.image}
                    alt={`Episode ${ep.number}`}
                    style={{ 
                      border: ep.number === currentEpNum ? '2px solid #ff6b35' : 'none'
                    }}
                  />
                  {ep.number === currentEpNum && (
                    <div className="currently-watching-badge">
                      ▶️ WATCHING
                    </div>
                  )}
                </Link>
                <div className="episode-preview-text">
                  <p>{ep.number} - {ep.title}</p>
                  <p>{anime.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - UNCHANGED */}
      <div className="watch_video_last_container">
        <div className="footerinfo">
          <div className="foot1">
            Navigation
            <br />
            <div className="listi">
              <p className="mar">Browse Popular</p>
              <p className="mar">Browse Simulcasts</p>
              <p className="mar">Release Calendar</p>
              <p className="mar">News</p>
              <p className="mar">Games</p>
            </div>
          </div>

          <div className="foot1">
            Connect With Us
            <br />
            <div className="listi">
              <p className="mar">Youtube</p>
              <p className="mar">Facebook</p>
              <p className="mar">X</p>
              <p className="mar">Instagram</p>
              <p className="mar">TikTok</p>
            </div>
          </div>

          <div className="foot1">
            Crunchyroll
            <br />
            <div className="listi">
              <p className="mar">Start a Free Trial</p>
              <p className="mar">About</p>
              <p className="mar">Help Center</p>
              <p className="mar">Terms of Use</p>
              <p className="mar">Privacy Policy</p>
              <p className="mar">AdChoices</p>
              <p className="mar">
                Do Not Sell or Share My Personal Information
              </p>
              <p className="mar">Cookie Consent Tool</p>
              <p className="mar">Press Inquiries</p>
              <p className="mar">Advertising Inquiries</p>
              <p className="mar">Get the Apps</p>
              <p className="mar">Redeem Gift Card</p>
              <p className="mar">Jobs</p>
            </div>
          </div>

          <div className="foot1">
            Account
            <br />
            <div className="listi">
              <p className="mar">Create Account</p>
              <p className="mar">Log In</p>
            </div>
          </div>
        </div>

        <div className="footinfo2">
          <br />
          <hr />
          <br />
          <div className="INROW">
            <h4 className="tag_create">SONY PICTURES | © Crunchyroll, LLC</h4>
            <h4>
              <select>
                <option>ENGLISH (US)</option>
                <option>FRENCH</option>
                <option>GERMAN</option>
                <option>RUSSIAN</option>
                <option>JAPANESE</option>
                <option>KOREAN</option>
                <option>ITALIAN</option>
                <option>MEXICAN</option>
              </select>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchVideoPage;
