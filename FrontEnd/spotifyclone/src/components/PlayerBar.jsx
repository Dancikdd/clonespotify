import React, { useState, useRef, useImperativeHandle } from "react";

const initialSongs = [
  { id: 1, title: "Song 1", artist: "Artist 1", src: "/assets/frontend-assets/song1.mp3", image: "/assets/frontend-assets/img1.jpg" },
  { id: 2, title: "Song 2", artist: "Artist 2", src: "/assets/frontend-assets/song2.mp3", image: "/assets/frontend-assets/img2.jpg" },
  { id: 3, title: "Song 3", artist: "Artist 3", src: "/assets/frontend-assets/song3.mp3", image: "/assets/frontend-assets/img3.jpg" },
];

const PlayerBar = React.forwardRef(({ likedSongs, toggleLikeStatus }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songs] = useState(initialSongs); // songs list is static here, managed by parent for liking
  const [volume, setVolume] = useState(1); // Volume from 0 to 1
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
      const index = songs.findIndex(song => song.id === songToPlay.id);
      if (index !== -1) {
        setCurrentSongIndex(index);
        // The useEffect for currentSongIndex change will handle the play
        if (!isPlaying) {
           setIsPlaying(true); // Start playing if not already playing
        }
      }
    },
  }));

  // Add keyboard control for spacebar
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the spacebar is pressed and the event target is not an input or textarea
      if (
        (event.code === 'Space' || event.key === ' ') &&
        event.target.tagName !== 'INPUT' &&
        event.target.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]); // Re-run effect if isPlaying changes to ensure togglePlay is up-to-date

   // Log likedSongs prop when it changes
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

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % songs.length;
      // If audio was playing, auto-play the next song
      if (isPlaying && audioRef.current) {
         // The useEffect for currentSongIndex change will handle the play
      }
      return nextIndex;
    });
  };

  const playPreviousSong = () => {
    setCurrentSongIndex((prevIndex) => {
      const prevIndexAdjusted = prevIndex - 1;
      const previousIndex = (prevIndexAdjusted < 0) ? songs.length - 1 : prevIndexAdjusted;
       // If audio was playing, auto-play the previous song
      if (isPlaying && audioRef.current) {
        // The useEffect for currentSongIndex change will handle the play
      }
      return previousIndex;
    });
  };

  // Effect to update audio source and play when currentSongIndex changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].src;
      audioRef.current.load(); // Load the new audio source
      if (isPlaying) {
        audioRef.current.play().catch(error => console.log("Autoplay prevented:", error)); // Auto-play if it was playing before
      }
    }
  }, [currentSongIndex, songs]); // Added songs to dependency array

   // Effect to update volume when volume or isMuted state changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);


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
     toggleLikeStatus(songs[currentSongIndex]); // Call the toggleLikeStatus function passed from parent
  };

   const handleVolumeChange = (e) => {
    if (volumeBarRef.current) {
      const newVolume = e.nativeEvent.offsetX / volumeBarRef.current.offsetWidth;
      setVolume(newVolume);
      setIsMuted(newVolume === 0); // Mute if volume is set to 0
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
     // Note: The useEffect for volume/isMuted handles updating audioRef.current.volume
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


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentSong = songs[currentSongIndex];
  const isCurrentSongFavorited = likedSongs.some(song => song.id === currentSong.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={playNextSong} // Automatically play the next song when the current one ends
      />

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left side - Now playing */}
        <div className="flex items-center space-x-4 w-1/3">
          <img src={currentSong.image} alt="Album cover" className="w-14 h-14 rounded" />
          <div>
            <div className="text-white font-medium">{currentSong.title}</div>
            <div className="text-gray-400 text-sm">{currentSong.artist}</div>
          </div>
          <button className={`hover:text-white ${isCurrentSongFavorited ? 'text-green-500' : 'text-gray-400'}`} onClick={handleToggleFavorite}>
            <img
              src="/assets/frontend-assets/like.png"
              alt="Like"
              className="w-5 h-5"
              style={{ filter: isCurrentSongFavorited ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }} // CSS filter to turn white to green
            />
          </button>
        </div>

        {/* Center - Player controls */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-6 mb-2">
            <button className={`text-gray-400 hover:text-white ${isShuffleActive ? 'text-green-500' : ''}`} onClick={handleShuffleClick}>
              <img src="/assets/frontend-assets/shuffle.png" alt="Shuffle" className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white" onClick={playPreviousSong}>
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
            <button className="text-gray-400 hover:text-white" onClick={playNextSong}>
              <img src="/assets/frontend-assets/next.png" alt="Next" className="w-5 h-5" />
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
              style={{ filter: isMicActive ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }} // CSS filter to turn white to green
            />
          </button>
          <button className={`text-gray-400 hover:text-white ${isQueueActive ? 'text-green-500' : ''}`} onClick={handleQueueClick}>
            <img
              src="/assets/frontend-assets/queue.png"
              alt="Queue"
              className="w-5 h-5"
              style={{ filter: isQueueActive ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)' : 'none' }} // CSS filter to turn white to green
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