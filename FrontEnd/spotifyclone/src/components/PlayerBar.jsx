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

const recordRecentlyPlayed = async (songId) => {
  const token = localStorage.getItem("token");
  await fetch("http://localhost:5050/api/songs/recently-played", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ songId })
  });
};

const PlayerBar = React.forwardRef(({ 
  likedSongs, 
  setLikedSongs, // Add this prop to update liked songs state
  currentSong, 
  currentPlaylist, // Array of songs in current playlist
  currentSongIndex, // Index of current song in playlist
  onSongChange, // Callback to update current song and index
  allSongs // Array of all available songs for random selection
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isQueueActive, setIsQueueActive] = useState(false);
  const [playHistory, setPlayHistory] = useState([]); // Track play history

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
        audioRef.current.play().catch(e => console.error("Play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Play the currentSong when it changes
  React.useEffect(() => {
    if (currentSong && audioRef.current) {
      const songSrc = getSongSrc(currentSong);
      console.log("Loading song:", currentSong.title, "src:", songSrc);
      
      audioRef.current.src = songSrc;
      audioRef.current.load();
      
      // Only auto-play if we have a valid source
      if (songSrc) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.error("Auto-play failed:", e);
          setIsPlaying(false);
        });
      }
      
      // Add to play history
      setPlayHistory(prev => {
        const newHistory = [...prev];
        // Remove current song if it exists in history
        const existingIndex = newHistory.findIndex(song => (song.id || song._id) === (currentSong.id || currentSong._id));
        if (existingIndex !== -1) {
          newHistory.splice(existingIndex, 1);
        }
        // Add current song to beginning of history
        newHistory.unshift(currentSong);
        // Keep only last 50 songs in history
        return newHistory.slice(0, 50);
      });

      // Record recently played song
      recordRecentlyPlayed(currentSong.id || currentSong._id);
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (duration > 0) {
      const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }
  };

  // Fixed like/unlike functionality
  const toggleLikeStatus = async (song) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const songId = song.id || song._id;
      const isLiked = likedSongs.some(s => (s.id || s._id) === songId);
      const url = `http://localhost:5050/api/songs/${songId}/like`;
      
      console.log(`${isLiked ? 'Unliking' : 'Liking'} song:`, song.title);

      if (isLiked) {
        // Unlike the song
        const response = await fetch(url, {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Remove from likedSongs state
          setLikedSongs(prev => prev.filter(s => (s.id || s._id) !== songId));
          console.log("Song unliked successfully");
        } else {
          console.error("Failed to unlike song:", response.statusText);
        }
      } else {
        // Like the song
        const response = await fetch(url, {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Add to likedSongs state
          setLikedSongs(prev => [...prev, song]);
          console.log("Song liked successfully");
        } else {
          console.error("Failed to like song:", response.statusText);
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleToggleFavorite = () => {
    if (currentSong) {
      toggleLikeStatus(currentSong);
    }
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

  // Get random song from all available songs
  const getRandomSong = () => {
    if (!allSongs || allSongs.length === 0) return null;
    
    // Filter out current song to avoid playing the same song
    const availableSongs = allSongs.filter(song => (song.id || song._id) !== (currentSong?.id || currentSong?._id));
    if (availableSongs.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    return availableSongs[randomIndex];
  };

  // Handle next song
  const handleNext = () => {
    console.log("Next button clicked");
    console.log("Current playlist:", currentPlaylist);
    console.log("Current song index:", currentSongIndex);
    console.log("Shuffle active:", isShuffleActive);
    console.log("Repeat active:", isRepeatActive);
    
    if (!currentSong) {
      console.log("No current song");
      return;
    }

    let nextSong = null;
    let nextIndex = -1;

    if (isShuffleActive) {
      // If shuffle is active, play random song
      if (currentPlaylist && currentPlaylist.length > 1) {
        // Random from current playlist
        const availablePlaylistSongs = currentPlaylist.filter(song => (song.id || song._id) !== (currentSong.id || currentSong._id));
        if (availablePlaylistSongs.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePlaylistSongs.length);
          nextSong = availablePlaylistSongs[randomIndex];
          nextIndex = currentPlaylist.findIndex(song => (song.id || song._id) === (nextSong.id || nextSong._id));
        }
      } else {
        // Random from all songs
        nextSong = getRandomSong();
        nextIndex = -1; // Not in playlist context
      }
    } else if (currentPlaylist && currentPlaylist.length > 0 && currentSongIndex !== -1) {
      // If in playlist, play next song in playlist
      if (currentSongIndex < currentPlaylist.length - 1) {
        nextIndex = currentSongIndex + 1;
        nextSong = currentPlaylist[nextIndex];
      } else if (isRepeatActive) {
        // If repeat is active and at end of playlist, go to beginning
        nextIndex = 0;
        nextSong = currentPlaylist[0];
      } else {
        // At end of playlist and no repeat, play random song
        nextSong = getRandomSong();
        nextIndex = -1;
      }
    } else {
      // Not in playlist, play random song
      nextSong = getRandomSong();
      nextIndex = -1;
    }

    console.log("Next song selected:", nextSong?.title, "at index:", nextIndex);

    if (nextSong && onSongChange) {
      onSongChange(nextSong, nextIndex);
    } else {
      console.log("No next song found or onSongChange not provided");
    }
  };

  // Handle previous song
  const handlePrevious = () => {
    console.log("Previous button clicked");
    console.log("Current time:", currentTime);
    console.log("Current playlist:", currentPlaylist);
    console.log("Current song index:", currentSongIndex);
    
    if (!currentSong) {
      console.log("No current song");
      return;
    }

    // If more than 3 seconds into current song, restart current song
    if (currentTime > 3) {
      console.log("Restarting current song");
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }

    let prevSong = null;
    let prevIndex = -1;

    if (currentPlaylist && currentPlaylist.length > 0 && currentSongIndex > 0) {
      // If in playlist and not at beginning, play previous song in playlist
      prevIndex = currentSongIndex - 1;
      prevSong = currentPlaylist[prevIndex];
      console.log("Playing previous song from playlist:", prevSong.title);
    } else if (playHistory.length > 1) {
      // Play from history (skip current song which is at index 0)
      prevSong = playHistory[1];
      prevIndex = -1; // History doesn't maintain playlist context
      console.log("Playing from history:", prevSong.title);
    } else if (currentPlaylist && currentPlaylist.length > 0 && isRepeatActive) {
      // If repeat is active and at beginning of playlist, go to end
      prevIndex = currentPlaylist.length - 1;
      prevSong = currentPlaylist[prevIndex];
      console.log("Repeat active, going to end of playlist:", prevSong.title);
    } else {
      // Play random song as fallback
      prevSong = getRandomSong();
      prevIndex = -1;
      console.log("Playing random song as fallback:", prevSong?.title);
    }

    if (prevSong && onSongChange) {
      onSongChange(prevSong, prevIndex);
    } else {
      console.log("No previous song found or onSongChange not provided");
    }
  };

  // Handle song end (auto play next)
  const handleSongEnd = () => {
    console.log("Song ended");
    if (isRepeatActive && (!currentPlaylist || currentPlaylist.length === 0)) {
      // If repeat is active and not in playlist, repeat current song
      console.log("Repeating current song");
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // Play next song
      console.log("Auto-playing next song");
      handleNext();
    }
  };

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null; // Don't render the player if there's no song
  }

  const isCurrentSongFavorited = likedSongs.some(
    s => String(s.id || s._id) === String(currentSong?.id || currentSong?._id)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleSongEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left side - Now playing */}
        <div className="flex items-center space-x-4 w-1/3">
            <img 
              src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1" 
              alt="Album cover" 
              className="w-14 h-14 rounded" 
            />          
            <div>
            <div className="text-white font-medium">{currentSong.title}</div>
            <div className="text-gray-400 text-sm">{currentSong.artist}</div>
          </div>
          <button 
            className={`hover:text-white transition-colors transition-transform hover:scale-125 ${isCurrentSongFavorited ? 'text-green-500' : 'text-gray-400'}`} 
            onClick={handleToggleFavorite}
          >
            <img
              src="/assets/frontend-assets/like.png"
              alt="Like"
              className="w-5 h-5"
              style={{ 
                filter: isCurrentSongFavorited 
                  ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' 
                  : 'none' 
              }}
            />
          </button>
        </div>

        {/* Center - Player controls */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-6 mb-2">
            <button className={`text-gray-400 hover:text-white ${isShuffleActive ? 'text-green-500' : ''}`} onClick={handleShuffleClick}>
              <img 
                src="/assets/frontend-assets/shuffle.png" 
                alt="Shuffle" 
                className="w-5 h-5"
                style={{ filter: isShuffleActive ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }}
              />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-transform hover:scale-125"
              onClick={handlePrevious}
            >
              <img src="/assets/frontend-assets/prev.png" alt="Previous" className="w-5 h-5" />
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
            <button
              className="text-gray-400 hover:text-white transition-transform hover:scale-125"
              onClick={handleNext}
            >
              <img src="/assets/frontend-assets/next.png" alt="Next" className="w-5 h-5" />
            </button>
            <button className={`text-gray-400 hover:text-white ${isRepeatActive ? 'text-green-500' : ''}`} onClick={handleRepeatClick}>
              <img 
                src="/assets/frontend-assets/loop.png" 
                alt="Repeat" 
                className="w-5 h-5"
                style={{ filter: isRepeatActive ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }}
              />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center space-x-2 w-full group">
            <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
            <div
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer transition-all duration-200 group-hover:h-3"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
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
          <div className="flex items-center space-x-2 group">
            <button className="text-gray-400 hover:text-white" onClick={toggleMute}>
              <img src="/assets/frontend-assets/speaker.png" alt="Volume" className="w-5 h-5" />
            </button>
            <div
              ref={volumeBarRef}
              className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer transition-all duration-200 group-hover:h-3"
              onClick={handleVolumeChange}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PlayerBar;