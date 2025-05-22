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
import LikedSongs from "./LikedSongs";

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
  
  // NEW: State for all songs (needed for random selection)
  const [allSongs, setAllSongs] = useState([]);

  // NEW: State for recommended stations
  const [recommendedStations, setRecommendedStations] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  const safeResults = Array.isArray(results) ? results : [];

  // Fetch all songs when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAllSongs = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("http://localhost:5050/api/songs", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          // Fix: Use the correct property name from your backend response
          setAllSongs(data.data || []);
        } catch (error) {
          console.error("Error fetching all songs:", error);
        }
      };
      fetchAllSongs();
    }
  }, [isAuthenticated]);

  // Fetch recommended stations
  const refreshRecommendedStations = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5050/api/songs/recommended", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecommendedStations(data.songs || []);
    } catch (error) {
      console.error("Error fetching recommended stations:", error);
    }
  };

  // Call refreshRecommendedStations once on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshRecommendedStations();
    }
  }, [isAuthenticated]);

  // FIXED: Fetch liked songs with correct endpoint
  useEffect(() => {
    if (isAuthenticated) {
      const fetchLikedSongs = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("http://localhost:5050/api/songs/user/liked", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            // Use the correct property from your backend response
            setLikedSongs(data.songs || []);
          } else {
            console.error("Failed to fetch liked songs:", res.statusText);
          }
        } catch (error) {
          console.error("Error fetching liked songs:", error);
        }
      };
      fetchLikedSongs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchRecentlyPlayed = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("http://localhost:5050/api/songs/recently-played", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setRecentlyPlayed(data.songs || []);
          }
        } catch (error) {
          console.error("Failed to fetch recently played:", error);
        }
      };
      fetchRecentlyPlayed();
    }
  }, [isAuthenticated]);

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

  // Toggle like status for a song
  const toggleLikeStatus = async (song) => {
    const token = localStorage.getItem("token");
    const isLiked = likedSongs.some(s => (s.id || s._id) === (song.id || song._id));
    const url = `http://localhost:5050/api/songs/${song.id || song._id}/like`;
    try {
      if (isLiked) {
        await fetch(url, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikedSongs(likedSongs.filter(s => (s.id || s._id) !== (song.id || song._id)));
      } else {
        await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikedSongs([...likedSongs, song]);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // When searching, show search results but don't hide the currently playing song
  const handleSearch = (query) => {
    setSearchTerm(query);
    setShowSearchResults(true);
    setSelectedSong(null); // Clear selected song details
    setCurrentPage('search'); // Set current page to search
    setCurrentPlaylist(null); // Clear current playlist
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

  // FIXED: Handle navigation to liked songs - this is the key fix
  const handleShowLikedSongs = () => {
    console.log("Navigating to liked songs");
    setCurrentPage('likedsongs');
    setSelectedSong(null);
    setShowSearchResults(false);
    setCurrentPlaylist(null);
  };

  // When you click a song in search results, show its details
  const handleSongClick = (song) => {
    setSelectedSong(song);
    // Don't hide search results immediately - we need to know we came from search
    // setShowSearchResults(false); // Remove this line
    // Don't reset currentPage or currentPlaylist - maintain context
  };

  // Play single song (not from playlist)
  const playSong = (songToPlay) => {
    console.log("Playing single song:", songToPlay.title);
    setCurrentSong(songToPlay);
    setIsPlayingFromPlaylist(false);
    setCurrentSongIndex(-1);
    setPlaylistSongs([]); // Clear playlist context

    // Add to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => (s.id || s._id) !== (songToPlay.id || songToPlay._id));
      return [songToPlay, ...filtered].slice(0, 20); // Keep last 20
    });

    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  // Function to play song from playlist with context
  const playPlaylistSong = (song, playlist, index) => {
    console.log("Playing playlist song:", song.title, "from playlist of", playlist.length, "songs at index", index);
    setCurrentSong(song);
    setPlaylistSongs(playlist);
    setCurrentSongIndex(index);
    setIsPlayingFromPlaylist(true);

    // Add to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => (s.id || s._id) !== (song.id || song._id));
      return [song, ...filtered].slice(0, 20); // Keep last 20
    });

    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  // Callback when PlayerBar wants to change the song (next/previous)
  const handleSongChange = (newSong, newIndex) => {
    console.log("Song change requested:", newSong.title, "at index:", newIndex);
    setCurrentSong(newSong);
    
    // If newIndex is -1, it means we're not in playlist context
    if (newIndex === -1) {
      setIsPlayingFromPlaylist(false);
      setCurrentSongIndex(-1);
      setPlaylistSongs([]);
    } else {
      // Update the index in the current playlist
      setCurrentSongIndex(newIndex);
      setIsPlayingFromPlaylist(true);
    }

    // Add to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => (s.id || s._id) !== (newSong.id || newSong._id));
      return [newSong, ...filtered].slice(0, 20); // Keep last 20
    });
  };

  const handleOpenPlaylist = async (playlist) => {
    setCurrentPlaylist(playlist);
    setSelectedSong(null);
    setShowSearchResults(false);
    setCurrentPage('playlist'); // Set current page to playlist
  
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

  // FIXED: Improved main content rendering logic
  const renderMainContent = () => {
    // Priority order: selectedSong > showSearchResults > currentPlaylist > currentPage
    if (selectedSong) {
      return (
        <SongResult
          song={selectedSong}
          onBack={() => {
            setSelectedSong(null);
            // Return to the previous state based on what was active before
            // If we have search results, show them
            if (showSearchResults && safeResults.length > 0) {
              // Search results will be shown automatically since showSearchResults is still true
              return;
            }
            // If we came from a playlist, show the playlist
            if (currentPlaylist) {
              // Playlist will be shown automatically since currentPlaylist is still set
              return;
            }
            // If we came from liked songs, return to liked songs
            if (currentPage === 'likedsongs') {
              // LikedSongs will be shown automatically since currentPage is still 'likedsongs'
              return;
            }
            // Default: go back to home
            setCurrentPage('home');
          }}
          onPlay={playSong}
          likedSongs={likedSongs}
          toggleLikeStatus={toggleLikeStatus}
          isAuthenticated={isAuthenticated}
        />
      );
    }
    
    if (showSearchResults) {
      return (
        <SearchResults 
          results={safeResults} 
          onSongClick={handleSongClick}
          searchTerm={searchTerm}
          likedSongs={likedSongs}
          toggleLikeStatus={toggleLikeStatus}
          isAuthenticated={isAuthenticated}
          onPlay={playSong}
        />
      );
    }
    
    if (currentPlaylist) {
      return (
        <ShowPlaylist
          playlist={currentPlaylist}
          onBack={() => {
            setCurrentPlaylist(null);
            setCurrentPage('home'); // Return to home after closing playlist
          }}
          playSong={playSong}
          playPlaylistSong={playPlaylistSong}
          likedSongs={likedSongs}
          toggleLikeStatus={toggleLikeStatus}
          isAuthenticated={isAuthenticated}
        />
      );
    }
    
    if (currentPage === 'likedsongs') {
      return (
        <LikedSongs
          likedSongs={likedSongs}
          playLikedSong={playSong}
          onShowLikedSongs={handleShowLikedSongs}
          toggleLikeStatus={toggleLikeStatus}
          isAuthenticated={isAuthenticated}
        />
      );
    }
    
    // Default to MainContent for home and other pages
    return (
      <MainContent
        currentPage={currentPage}
        playSong={playSong}
        isAuthenticated={isAuthenticated}
        openPlaylist={handleOpenPlaylist}
        playPlaylistSong={playPlaylistSong}
        allSongs={allSongs}
        setAllSongs={setAllSongs}
        likedSongs={likedSongs}
        setLikedSongs={setLikedSongs}
        recentlyPlayed={recentlyPlayed}
        toggleLikeStatus={toggleLikeStatus}
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
          setCurrentPlaylist={setCurrentPlaylist}
          isAuthenticated={isAuthenticated}
          setShowAuthModal={setShowAuthModal}
          onHomeClick={handleHomeClick}
          openPlaylist={handleOpenPlaylist}
          onShowLikedSongs={handleShowLikedSongs}
        />
        <div className="flex-1 flex flex-col min-w-0">
          {renderMainContent()}
        </div>
        {isAuthenticated && (
          <div className="w-70 flex-shrink-0 hidden lg:block">
            <RightSidebar
              currentSong={currentSong}
              queue={isPlayingFromPlaylist && currentSongIndex > -1 ? playlistSongs.slice(currentSongIndex + 1) : []}
              showQueue={isPlayingFromPlaylist}
              onPlayQueueSong={playSong}
              recentlyPlayed={recentlyPlayed}
              likedSongs={likedSongs}
              toggleLikeStatus={toggleLikeStatus}
            />
          </div>
        )}
      </div>
      <Footer />
      {isAuthenticated && (
        <PlayerBar
          ref={playerBarRef}
          likedSongs={likedSongs}
          setLikedSongs={setLikedSongs}
          currentSong={currentSong}
          currentPlaylist={isPlayingFromPlaylist ? playlistSongs : []}
          currentSongIndex={isPlayingFromPlaylist ? currentSongIndex : -1}
          onSongChange={handleSongChange}
          allSongs={allSongs}
          toggleLikeStatus={toggleLikeStatus}
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