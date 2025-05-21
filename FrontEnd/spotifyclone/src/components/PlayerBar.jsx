import React, { useState, useRef, useImperativeHandle } from "react";

const getSongSrc = (song) => {
  if (!song) return "";
  if (song.src) {
    return song.src.startsWith("http") ? song.src : `http://localhost:5050${song.src}`;
  }
  if (song.audio_url) {
    return song.audio_url.startsWith("http") ? song.audio_url : `http://localhost:5050${song.audio_url}`;
  }
  return "";
};

const PlayerBar = React.forwardRef(({ likedSongs, toggleLikeStatus, currentSong }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isQueueActive, setIsQueueActive] = useState(false);

  const audioRef = useRef(null);
  const volumeBarRef = useRef(null);

  // Expose functions to parent component via ref
  useImperativeHandle(ref, () => ({
    setPlayingSong: (songToPlay) => {
      // No-op, handled by currentSong prop now
    },
  }));

  // Add keyboard control for spacebar
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.code === 'Space' || event.key === ' ') &&
        event.target.tagName !== 'INPUT' &&
        event.target.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  React.useEffect(() => {
    console.log("Liked Songs updated in PlayerBar:", likedSongs);
  }, [likedSongs]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Play the currentSong when it changes
  React.useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = getSongSrc(currentSong);
      audioRef.current.load();
      audioRef.current.play().catch(e => {});
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleToggleFavorite = () => {
    if (currentSong) toggleLikeStatus(currentSong);
  };

  const handleVolumeChange = (e) => {
    if (volumeBarRef.current) {
      const newVolume = e.nativeEvent.offsetX / volumeBarRef.current.offsetWidth;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleShuffleClick = () => {
    setIsShuffleActive(!isShuffleActive);
    console.log("Shuffle button clicked! Active:", !isShuffleActive);
  };

  const handleRepeatClick = () => {
    setIsRepeatActive(!isRepeatActive);
    console.log("Repeat button clicked! Active:", !isRepeatActive);
  };

  const handleMicClick = () => {
    setIsMicActive(!isMicActive);
    console.log("Microphone button clicked! Active:", !isMicActive);
  };

  const handleQueueClick = () => {
    setIsQueueActive(!isQueueActive);
    console.log("Queue button clicked! Active:", !isQueueActive);
  };

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null; // Don't render the player if there's no song
  }

  const isCurrentSongFavorited = likedSongs.some(song => song.id === currentSong.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left side - Now playing */}
        <div className="flex items-center space-x-4 w-1/3">
          <img src={currentSong.image || "/assets/frontend-assets/default_song_thumbnail.png"} alt="Album cover" className="w-14 h-14 rounded" />
          <div>
            <div className="text-white font-medium">{currentSong.title}</div>
            <div className="text-gray-400 text-sm">{currentSong.artist}</div>
          </div>
          <button className={`hover:text-white ${isCurrentSongFavorited ? 'text-green-500' : 'text-gray-400'}`} onClick={handleToggleFavorite}>
            <img
              src="/assets/frontend-assets/like.png"
              alt="Like"
              className="w-5 h-5"
              style={{ filter: isCurrentSongFavorited ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }}
            />
          </button>
        </div>

        {/* Center - Player controls */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-6 mb-2">
            <button className={`text-gray-400 hover:text-white ${isShuffleActive ? 'text-green-500' : ''}`} onClick={handleShuffleClick}>
              <img src="/assets/frontend-assets/shuffle.png" alt="Shuffle" className="w-5 h-5" />
            </button>
            {/* Previous/Next disabled since no playlist */}
            <button className="text-gray-400 hover:text-white" disabled>
              <img src="/assets/frontend-assets/prev.png" alt="Previous" className="w-5 h-5 opacity-50" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-[#1DB954] rounded-full p-2 hover:scale-105 transition-transform"
            >
              <img
                src={isPlaying ? "/assets/frontend-assets/pause.png" : "/assets/frontend-assets/play.png"}
                alt={isPlaying ? "Pause" : "Play"}
                className="w-6 h-6"
              />
            </button>
            <button className="text-gray-400 hover:text-white" disabled>
              <img src="/assets/frontend-assets/next.png" alt="Next" className="w-5 h-5 opacity-50" />
            </button>
            <button className={`text-gray-400 hover:text-white ${isRepeatActive ? 'text-green-500' : ''}`} onClick={handleRepeatClick}>
              <img src="/assets/frontend-assets/loop.png" alt="Repeat" className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
            <div
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right side - Volume and queue */}
        <div className="flex items-center justify-end space-x-4 w-1/3">
          <button className={`text-gray-400 hover:text-white ${isMicActive ? 'text-green-500' : ''}`} onClick={handleMicClick}>
            <img
              src="/assets/frontend-assets/mic.png"
              alt="Microphone"
              className="w-5 h-5"
              style={{ filter: isMicActive ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }}
            />
          </button>
          <button className={`text-gray-400 hover:text-white ${isQueueActive ? 'text-green-500' : ''}`} onClick={handleQueueClick}>
            <img
              src="/assets/frontend-assets/queue.png"
              alt="Queue"
              className="w-5 h-5"
              style={{ filter: isQueueActive ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }}
            />
          </button>
          <button className="text-gray-400 hover:text-white" onClick={toggleMute}>
            <img src="/assets/frontend-assets/speaker.png" alt="Volume" className="w-5 h-5" />
          </button>
          <div ref={volumeBarRef} className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer" onClick={handleVolumeChange}>
            <div className="h-full bg-white rounded-full" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default PlayerBar;