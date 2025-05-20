import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import RightSidebar from "./RightSidebar";
import PlayerBar from "./PlayerBar";
import { useNavigate } from 'react-router-dom';

const HomePage = ({ 
  isAuthenticated, 
  isAdmin, 
  userName, 
  onLogout 
}) => {
  const [likedSongs, setLikedSongs] = useState([]);
  const playerBarRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

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

  const playSong = (songToPlay) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (playerBarRef.current && playerBarRef.current.setPlayingSong) {
      playerBarRef.current.setPlayingSong(songToPlay);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        isAdmin={isAdmin}
        userName={userName}
        onLogout={onLogout} 
      />
      <div className="flex flex-1">
        <Sidebar likedSongs={likedSongs} playSong={playSong} setCurrentPage={setCurrentPage} isAuthenticated={isAuthenticated} setShowAuthModal={setShowAuthModal} />
        <MainContent currentPage={currentPage} likedSongs={likedSongs} playSong={playSong} isAuthenticated={isAuthenticated} />
        {isAuthenticated && <RightSidebar />}
      </div>
      <Footer />
      {isAuthenticated && <PlayerBar ref={playerBarRef} likedSongs={likedSongs} toggleLikeStatus={toggleLikeStatus} />}
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          {/* Blue Playlist Modal */}
          <div className="bg-blue-500 p-6 rounded-lg text-white relative max-w-sm text-center">
            {/* Close Button - Keeping a simple close for now, position might need adjustment */}
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