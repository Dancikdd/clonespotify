import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import RightSidebar from "./RightSidebar";
import PlayerBar from "./PlayerBar";
import { useNavigate, useLocation } from 'react-router-dom';
import SearchResults from "./SearchResults";
import SongResult from "./SongResult";
import SongNotFound from "./SongNotFound";
import ShowPlaylist from "./ShowPlaylist";

const HomePage = ({ 
  isAuthenticated, 
  isAdmin, 
  userName, 
  onLogout,
  onSearch,      
  results        
}) => {
  const [likedSongs, setLikedSongs] = useState([]);
  const playerBarRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentSong, setCurrentSong] = useState(null); // The song that's playing
  const [selectedSong, setSelectedSong] = useState(null); // The song whose details are shown
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlayingFromPlaylist, setIsPlayingFromPlaylist] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const safeResults = Array.isArray(results) ? results : [];

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentPage("home");
    }
  }, [location.pathname]);

  // Set showSearchResults when results come in
  useEffect(() => {
    if (safeResults.length > 0) {
      setShowSearchResults(true);
    }
  }, [safeResults]);

  const toggleLikeStatus = (song) => {
    setLikedSongs(prevLikedSongs => {
      const isLiked = prevLikedSongs.some(likedSong => likedSong.id === song.id);
      if (isLiked) {
        return prevLikedSongs.filter(likedSong => likedSong.id !== song.id);
      } else {
        return [...prevLikedSongs, song];
      }
    });
  };

  // When searching, show search results but don't hide the currently playing song
  const handleSearch = (query) => {
    setSearchTerm(query);
    setShowSearchResults(true);
    setSelectedSong(null); // Clear selected song details
    if (onSearch) {
      onSearch(query);
    }
  };
  
  // Handle navigation to home without affecting music playback
  const handleHomeClick = () => {
    setShowSearchResults(false);
    setSelectedSong(null);
    setCurrentPage('home');
    setCurrentPlaylist(null);
  };

  // When you click a song in search results, show its details
  const handleSongClick = (song) => {
    setSelectedSong(song);
    setShowSearchResults(false);
  };

  // When you press play in SongResult, play the song
  const playSong = (songToPlay) => {
    setCurrentSong(songToPlay);

    // If playing from a playlist, update index and flag
    if (currentPlaylist && playlistSongs.length > 0) {
      const idx = playlistSongs.findIndex(s => s.id === songToPlay.id);
      if (idx !== -1) {
        setCurrentSongIndex(idx);
        setIsPlayingFromPlaylist(true);
      } else {
        setIsPlayingFromPlaylist(false);
        setCurrentSongIndex(-1);
      }
    } else {
      setIsPlayingFromPlaylist(false);
      setCurrentSongIndex(-1);
    }

    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (playerBarRef.current && playerBarRef.current.setPlayingSong) {
      playerBarRef.current.setPlayingSong(songToPlay);
    }
  };

  const handleOpenPlaylist = async (playlist) => {
    setCurrentPlaylist(playlist);
    setSelectedSong(null);
    setShowSearchResults(false);
  
    // Fetch songs for the playlist
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5050/api/playlists/${playlist.id || playlist._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPlaylistSongs(data.songs || []);
    setIsPlayingFromPlaylist(false); // Not playing yet, just viewing
    setCurrentSongIndex(-1);
  };

  const renderMainContent = () => {
    if (selectedSong) {
      return (
        <SongResult
          song={selectedSong}
          onBack={() => setSelectedSong(null)}
          onPlay={playSong}
        />
      );
    } else if (showSearchResults) {
      return (
        <SearchResults 
          results={safeResults} 
          onSongClick={handleSongClick}
          searchTerm={searchTerm} 
        />
      );
    } else {
      return (
        <MainContent
          currentPage={currentPage}
          likedSongs={likedSongs}
          playSong={playSong}
          isAuthenticated={isAuthenticated}
          openPlaylist={handleOpenPlaylist} // <-- pass this function
        />
      );
    }
  };

  const renderSearchResults = () => {
    return (
      <SearchResults 
        results={safeResults} 
        onSongClick={handleSongClick}
        searchTerm={searchTerm} 
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        isAdmin={isAdmin}
        userName={userName}
        onLogout={onLogout} 
        onSearch={handleSearch}
        onHomeClick={handleHomeClick}   
      />
      <div className="flex flex-1 overflow-x-hidden">
        <Sidebar
          likedSongs={likedSongs}
          playSong={playSong}
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
          setShowAuthModal={setShowAuthModal}
          onHomeClick={handleHomeClick}
          openPlaylist={handleOpenPlaylist} // <-- add this
        />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Only this part changes based on selectedSong, etc. */}
          {selectedSong ? (
            <SongResult
              song={selectedSong}
              onBack={() => {
                setSelectedSong(null);
                setShowSearchResults(true); // Show search results when going back
              }}
              onPlay={playSong}
            />
          ) : showSearchResults ? (
            renderSearchResults()
          ) : currentPlaylist ? (
            <ShowPlaylist
              playlist={currentPlaylist}
              onBack={() => setCurrentPlaylist(null)}
              playSong={playSong}
            />
          ) : (
            renderMainContent()
          )}
        </div>
        {isAuthenticated && (
          <div className="w-70 flex-shrink-0 hidden lg:block">
            <RightSidebar
              currentSong={currentSong}
              queue={isPlayingFromPlaylist && currentSongIndex > -1 ? playlistSongs.slice(currentSongIndex + 1) : []}
              showQueue={isPlayingFromPlaylist}
              onPlayQueueSong={playSong}
              recentlyPlayed={recentlyPlayed} // <-- add this
            />
          </div>
        )}
      </div>
      <Footer />
      {isAuthenticated && (
        <PlayerBar
          ref={playerBarRef}
          likedSongs={likedSongs}
          toggleLikeStatus={toggleLikeStatus}
          currentSong={currentSong}
        />
      )}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-blue-500 p-6 rounded-lg text-white relative max-w-sm text-center">
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-200 text-2xl"
              onClick={() => setShowAuthModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Create a playlist</h2>
            <p className="text-sm mb-6">Log in to create and share playlists.</p>
            <div className="flex justify-center items-center space-x-4">
              <button className="text-white text-sm font-bold py-2 px-4 hover:underline" onClick={() => setShowAuthModal(false)}>Not now</button>
              <button className="bg-white text-blue-500 text-sm font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform" onClick={() => { navigate('/login'); setShowAuthModal(false); }}>Log in</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;