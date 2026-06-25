import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import './HLSVideoPlayer.css';

const HLSVideoPlayer = ({ 
  streamUrl, 
  posterUrl,
  title, 
  onTimeUpdate,
  onError,
  autoPlay = false,
  onVideoEnd,
  className = ""
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Detect mobile device and screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Loading HLS stream:', streamUrl);

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        startLevel: -1,
        debug: false,
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log('✅ HLS manifest loaded, found ' + data.levels.length + ' quality levels');
        setQualities(data.levels);
        setIsLoading(false);
        setError(null);
        
        if (autoPlay) {
          video.play().catch(err => {
            console.log('Autoplay prevented:', err);
            setError('Please click play to start the video');
          });
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = data.level;
        const levelInfo = hls.levels[level];
        console.log(`Quality switched to: ${levelInfo.height}p (${Math.round(levelInfo.bitrate / 1000)}kbps)`);
        setCurrentQuality(level);
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        updateBufferInfo();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, attempting recovery...');
              setError('Network error. Retrying...');
              setTimeout(() => {
                hls.startLoad();
                setError(null);
              }, 1000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, attempting recovery...');
              setError('Media error. Recovering...');
              hls.recoverMediaError();
              setTimeout(() => setError(null), 2000);
              break;
            default:
              setError('Fatal streaming error occurred');
              if (onError) onError(data);
              break;
          }
        }
      });

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('Using native HLS support');
      video.src = streamUrl;
      setIsLoading(false);
    } else {
      setError('HLS streaming is not supported in this browser');
    }
  }, [streamUrl, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration || 0;
      
      setCurrentTime(currentTime);
      updateBufferInfo();
      
      if (onTimeUpdate) {
        onTimeUpdate({
          currentTime: currentTime,
          duration: duration,
          progress: duration > 0 ? (currentTime / duration) : 0
        });
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setBuffering(false);
      setError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setBuffering(true);
    };

    const handleCanPlay = () => {
      setBuffering(false);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleError = (e) => {
      console.error('Video element error:', e);
      setError('Video playback error occurred');
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('error', handleError);
    };
  }, [onTimeUpdate, onVideoEnd]);

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let hideControlsTimeout;
    
    if (isFullscreen && isPlaying) {
      hideControlsTimeout = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }

    return () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
    };
  }, [isFullscreen, isPlaying, showControls]);

  const updateBufferInfo = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0) {
      const ranges = [];
      for (let i = 0; i < video.buffered.length; i++) {
        ranges.push({
          start: video.buffered.start(i),
          end: video.buffered.end(i)
        });
      }
      setBuffered(ranges);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => {
        console.error('Play failed:', err);
        setError('Failed to play video');
      });
    } else {
      video.pause();
    }
  };

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(video.currentTime + 10, video.duration);
    video.currentTime = newTime;
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(video.currentTime - 10, 0);
    video.currentTime = newTime;
  };

  const handleQualityChange = (level) => {
    if (hlsRef.current && hlsRef.current.levels) {
      const newLevel = parseInt(level);
      hlsRef.current.currentLevel = newLevel;
      setCurrentQuality(newLevel);
      setShowSettings(false); // Close settings after selection
      
      const levelInfo = hlsRef.current.levels[newLevel === -1 ? hlsRef.current.currentLevel : newLevel];
      console.log('Quality changed to:', newLevel === -1 ? 'Auto' : `${levelInfo?.height}p`);
    }
  };

  const handleVolumeChange = (newVolume) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityText = () => {
    if (currentQuality === -1) return 'Auto';
    if (qualities[currentQuality]) {
      return `${qualities[currentQuality].height}p`;
    }
    return 'Auto';
  };

  // Handle double-tap on mobile for fullscreen
  const handleDoubleTap = () => {
    if (isMobile) {
      toggleFullscreen();
    }
  };

  const handleMouseMove = () => {
    if (isFullscreen) {
      setShowControls(true);
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = () => {
    if (isMobile) {
      setShowControls(true);
    }
  };

  if (error && isLoading) {
    return (
      <div className={`hls-player error ${className}`}>
        <div className="error-container">
          <h3>⚠️ Playback Error</h3>
          <p>{error}</p>
          <button 
            className="reload-button"
            onClick={() => window.location.reload()}
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`hls-player ${className} ${isFullscreen ? 'fullscreen' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div 
        ref={containerRef}
        className="video-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => !isFullscreen && !isMobile && setShowControls(false)}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleTap}
      >
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading anime episode...</p>
          </div>
        )}
        
        <video
          ref={videoRef}
          poster={posterUrl}
          preload="metadata"
          className="video-element"
          onClick={handlePlayPause}
          playsInline
          controls={false}
        />
        
        {buffering && !isLoading && (
          <div className="buffering-overlay">
            <div className="buffering-spinner"></div>
            <p>Buffering...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="error-overlay">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Settings Menu for Mobile */}
        {showSettings && isMobile && qualities.length > 1 && (
          <div className="mobile-settings-menu">
            <div className="settings-header">
              <h3>Video Quality</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="close-settings"
              >
                ✕
              </button>
            </div>
            <div className="quality-options">
              <button 
                onClick={() => handleQualityChange(-1)}
                className={`quality-option ${currentQuality === -1 ? 'active' : ''}`}
              >
                <span>Auto</span>
                {currentQuality === -1 && <span className="checkmark">✓</span>}
              </button>
              {qualities.map((quality, index) => (
                <button 
                  key={index}
                  onClick={() => handleQualityChange(index)}
                  className={`quality-option ${currentQuality === index ? 'active' : ''}`}
                >
                  <span>{quality.height}p ({Math.round(quality.bitrate / 1000)}k)</span>
                  {currentQuality === index && <span className="checkmark">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Controls */}
        <div className={`controls-container ${showControls ? 'visible' : 'hidden'}`}>
          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-bar">
              {buffered.map((range, index) => (
                <div
                  key={index}
                  className="buffer-indicator"
                  style={{
                    left: `${(range.start / duration) * 100}%`,
                    width: `${((range.end - range.start) / duration) * 100}%`
                  }}
                />
              ))}
              
              <div
                className="progress-indicator"
                style={{
                  width: `${(currentTime / duration) * 100}%`
                }}
              />
              
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="progress-input"
              />
            </div>
          </div>

          <div className="controls-bottom">
            <button 
              onClick={handlePlayPause}
              className="play-pause-button"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            {/* Skip buttons in controls bar */}
            <button 
              onClick={skipBackward}
              className="skip-control-button"
              title="Skip backward 10 seconds"
            >
              ⏪10
            </button>
            
            <button 
              onClick={skipForward}
              className="skip-control-button"
              title="Skip forward 10 seconds"
            >
              10⏩
            </button>

            {!isMobile && (
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            )}

            {/* Quality selector for desktop */}
            {qualities.length > 1 && !isMobile && (
              <div className="quality-selector-container">
                <select
                  value={currentQuality}
                  onChange={(e) => handleQualityChange(e.target.value)}
                  className="quality-selector"
                  title="Video Quality"
                >
                  <option value={-1}>Auto</option>
                  {qualities.map((quality, index) => (
                    <option key={index} value={index}>
                      {quality.height}p ({Math.round(quality.bitrate / 1000)}k)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Settings button for mobile */}
            {qualities.length > 1 && isMobile && (
              <button 
                onClick={toggleSettings}
                className="mobile-settings-button"
                title="Video Settings"
              >
                <span className="settings-icon">⚙️</span>
                <span className="quality-text">{getQualityText()}</span>
              </button>
            )}

            {!isMobile && (
              <div className="volume-controls">
                <span className="volume-icon" title="Volume">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="volume-slider"
                  title="Volume"
                />
              </div>
            )}

            <button 
              onClick={toggleFullscreen}
              className="fullscreen-button"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? '⛶' : '⛶'}
            </button>

            {!isFullscreen && !isMobile && (
              <div className="title-display">
                {title}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HLSVideoPlayer;
