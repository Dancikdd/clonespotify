import React, { useState, useEffect } from "react";
import SongResult from "./SongResult";
import LikedSongs from "./LikedSongs"; // Make sure the filename matches exactly (case-sensitive)

const tabs = ["All", "Music", "Podcasts", "Albums"];

const MainContent = ({ 
  currentPage, 
  playSong, 
  isAuthenticated, 
  openPlaylist,
  playPlaylistSong, // Function to play song with playlist context
  allSongs, // All available songs for random selection
  setAllSongs, // Function to update all songs
  likedSongs,         // <-- add this
  setLikedSongs       // <-- add this
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [madeForYouArtist, setMadeForYouArtist] = useState("");
  const [recommendedStations, setRecommendedStations] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch all songs for random selection
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAllSongs = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("http://localhost:5050/api/songs", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (setAllSongs) {
            setAllSongs(data.songs || []);
          }
        } catch (error) {
          console.error("Error fetching all songs:", error);
        }
      };
      fetchAllSongs();
    }
  }, [isAuthenticated, setAllSongs]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPlaylists = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/playlists", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPlaylists(data.playlists || []);
      };
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMadeForYou = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/playlists/made-for-you", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMadeForYou(data.songs || []);
        setMadeForYouArtist(data.artist || "");
      };
      fetchMadeForYou();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchRecommendedStations = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/playlists/recommended?count=6", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRecommendedStations(data.songs || []);
      };
      fetchRecommendedStations();
    }
  }, [isAuthenticated]);

  // Fetch liked songs from the backend
  useEffect(() => {
    if (isAuthenticated) {
      const fetchLikedSongs = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("http://localhost:5050/api/songs/user/liked", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setLikedSongs(data.songs || []);
        } catch (error) {
          console.error("Error fetching liked songs:", error);
        }
      };
      fetchLikedSongs();
    }
  }, [isAuthenticated]);

  // Fetch recently played songs
  useEffect(() => {
    if (isAuthenticated) {
      const fetchRecentlyPlayed = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("http://localhost:5050/api/songs/recently-played", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setRecentlyPlayed(data.songs || []);
        } catch (error) {
          console.error("Error fetching recently played songs:", error);
        }
      };
      fetchRecentlyPlayed();
    }
  }, [isAuthenticated]);

  // Handle playing songs from "Made For You" as a playlist
  const playMadeForYouSong = (song, index) => {
    if (playPlaylistSong) {
      playPlaylistSong(song, madeForYou, index);
    } else {
      playSong(song);
    }
  };

  // Handle playing songs from "Recommended Stations" as a playlist
  const playRecommendedSong = (song, index) => {
    if (playPlaylistSong) {
      playPlaylistSong(song, recommendedStations, index);
    } else {
      playSong(song);
    }
  };

  // Handle playing songs from "Liked Songs" as a playlist
  const playLikedSong = (song, index) => {
    // Find the exact object from likedSongs by ID
    const likedSong = likedSongs.find(
      s => String(s.id || s._id) === String(song.id || song._id)
    );
    if (playPlaylistSong) {
      playPlaylistSong(likedSong || song, likedSongs, index);
    } else {
      playSong(likedSong || song);
    }
  };

  // Handle interactions when not logged in
  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  // Refresh Recommended Stations
  const refreshRecommendedStations = () => {
    setRecommendedStations([]);
    (async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/playlists/recommended?count=6", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecommendedStations(data.songs || []);
    })();
  };

  // Login Modal Component
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-800 to-blue-700 p-8 rounded-2xl text-white relative max-w-md w-full mx-4 shadow-2xl">
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
          onClick={() => setShowLoginModal(false)}
        >
          &times;
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/assets/frontend-assets/play.png" alt="Music" className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Log in to continue</h2>
          <p className="text-gray-200 text-sm">You need to log in to access this feature and enjoy unlimited music.</p>
        </div>

        <div className="space-y-4">
          <button 
            className="w-full bg-green-500 text-black font-bold py-3 px-6 rounded-full hover:bg-green-400 transition-colors"
            onClick={() => {
              setShowLoginModal(false);
              window.location.href = '/login';
            }}
          >
            Log in
          </button>
          
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-2">Don't have an account?</p>
            <button 
              className="text-green-400 font-semibold hover:underline"
              onClick={() => {
                setShowLoginModal(false);
                window.location.href = '/register';
              }}
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Not logged in content
  const renderNotLoggedInContent = () => {
    const featuredContent = [
      { id: 1, image: "/assets/frontend-assets/img1.jpg", title: "Today's Top Hits", description: "The most played songs right now" },
      { id: 2, image: "/assets/frontend-assets/img2.jpg", title: "RapCaviar", description: "New music from Drake, Travis Scott and more" },
      { id: 3, image: "/assets/frontend-assets/img3.jpg", title: "All Out 2010s", description: "The biggest hits of the 2010s" },
      { id: 4, image: "/assets/frontend-assets/img4.jpg", title: "Rock Classics", description: "Rock legends & epic songs" },
      { id: 5, image: "/assets/frontend-assets/img5.jpg", title: "Chill Pop", description: "Chill pop music for any mood" },
      { id: 6, image: "/assets/frontend-assets/img6.jpg", title: "Viva Latino", description: "Today's top Latin hits" }
    ];

    return (
      <div className="text-center py-20">
        {/* Welcome Section */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">Welcome to Music App</h1>
          <p className="text-xl text-gray-300 mb-8">Discover millions of songs and podcasts</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/register'}
              className="bg-green-500 text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
            >
              Sign up free
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="border border-gray-400 text-white font-bold py-3 px-8 rounded-full hover:border-white transition-colors"
            >
              Log in
            </button>
          </div>
        </div>

        {/* Featured Playlists Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-left">Featured Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContent.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-all duration-300 cursor-pointer group"
                onClick={handleLoginRequired}
              >
                <div className="relative mb-4">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                    <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 text-left">{item.title}</h3>
                <p className="text-gray-400 text-sm text-left">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Songs Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-left">Popular Right Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 1, title: "Blinding Lights", artist: "The Weeknd", image: "/assets/frontend-assets/img7.jpg" },
              { id: 2, title: "Shape of You", artist: "Ed Sheeran", image: "/assets/frontend-assets/img8.jpg" },
              { id: 3, title: "Someone Like You", artist: "Adele", image: "/assets/frontend-assets/img9.jpg" },
              { id: 4, title: "Bohemian Rhapsody", artist: "Queen", image: "/assets/frontend-assets/img10.jpg" }
            ].map((song) => (
              <div 
                key={song.id}
                className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-all duration-300 cursor-pointer group"
                onClick={handleLoginRequired}
              >
                <div className="relative mb-3">
                  <img 
                    src={song.image} 
                    alt={song.title} 
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                    <img src="/assets/frontend-assets/play.png" alt="Play" className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1 truncate">{song.title}</h4>
                <p className="text-gray-400 text-xs truncate">{song.artist}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-800 via-purple-600 to-blue-700 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start listening?</h2>
          <p className="text-lg text-gray-200 mb-6">Join millions of users and discover your next favorite song</p>
          <button 
            onClick={() => window.location.href = '/register'}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
          >
            Get started
          </button>
        </div>
      </div>
    );
  };

  // Logged in content (your existing content)
  const renderLoggedInContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* Tab Bar */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-800 via-purple-600 to-blue-700 p-6 mb-8 flex flex-col gap-4 shadow-lg">
              <div className="flex gap-4 mb-4">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === idx ? 'bg-white text-black shadow' : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Playlists */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {playlists.length === 0 ? (
                  <div className="text-gray-400">No playlists found.</div>
                ) : (
                  playlists.map((playlist) => (
                    <div
                      key={playlist.id || playlist._id}
                      className="min-w-[180px] h-24 rounded-xl overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => openPlaylist(playlist)}
                    >
                      <img src={playlist.img_url || "/assets/frontend-assets/default_song_thumbnail.png"} alt={playlist.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{playlist.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Made For You / Random Playlist by Artist */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Made For You {madeForYouArtist && <span className="text-green-400">({madeForYouArtist})</span>}
                </h2>
                <button
                  className="text-sm text-gray-400 hover:underline"
                  onClick={() => {
                    setMadeForYou([]);
                    setMadeForYouArtist("");
                    (async () => {
                      const token = localStorage.getItem("token");
                      const res = await fetch("http://localhost:5050/api/playlists/made-for-you", {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      const data = await res.json();
                      setMadeForYou(data.songs || []);
                      setMadeForYouArtist(data.artist || "");
                    })();
                  }}
                >
                  Refresh
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {madeForYou.length === 0 ? (
                  <div className="text-gray-400">No songs found.</div>
                ) : (
                  madeForYou.map((song, index) => (
                    <div
                      key={song.id}
                      className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] transition-all duration-300 group flex flex-col items-center"
                    >
                      <div
                        className="relative w-48 h-48 mb-3 rounded-md overflow-hidden cursor-pointer"
                        onClick={() => setSelectedSong(song)}
                        title="Show song details"
                      >
                        <img
                          src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Green Play Button */}
                        <button
                          className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-125"
                          onClick={e => {
                            e.stopPropagation();
                            playMadeForYouSong(song, index);
                          }}
                          title="Play"
                        >
                          <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{song.title}</div>
                      <div className="text-gray-400 text-sm truncate w-full text-center">{song.artist}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Recommended Stations */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Recommended Stations</h2>
                <button
                  className="text-sm text-gray-400 hover:underline"
                  onClick={refreshRecommendedStations}
                >
                  Refresh
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {recommendedStations.map((song, index) => (
                  <div
                    key={song.id}
                    className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] transition-all duration-300 group flex flex-col items-center"
                  >
                    <div
                      className="relative w-48 h-48 mb-3 rounded-md overflow-hidden cursor-pointer"
                      onClick={() => setSelectedSong(song)}
                      title="Show song details"
                    >
                    <img
                      src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                      {/* Green Play Button */}
                      <button
                        className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-125"
                        onClick={e => {
                          e.stopPropagation();
                          playRecommendedSong(song, index);
                        }}
                        title="Play"
                      >
                        <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{song.title}</div>
                    <div className="text-gray-400 text-sm truncate w-full text-center">{song.artist}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recently Played */}
            {recentlyPlayed && recentlyPlayed.length > 0 && (
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Recently Played
                  </h2>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {recentlyPlayed.slice(0, 10).map((song, index) => (
                    <div
                      key={song.id}
                      className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] transition-all duration-300 group flex flex-col items-center"
                    >
                      <div
                        className="relative w-48 h-48 mb-3 rounded-md overflow-hidden cursor-pointer"
                        onClick={() => setSelectedSong(song)}
                        title="Show song details"
                      >
                        <img
                          src={song.image || "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Green Play Button */}
                        <button
                          className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-125"
                          onClick={e => {
                            e.stopPropagation();
                            playSong(song);
                          }}
                          title="Play"
                        >
                          <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{song.title}</div>
                      <div className="text-gray-400 text-sm truncate w-full text-center">{song.artist}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        );
      case 'library':
        return (
          <LikedSongs likedSongs={likedSongs} playLikedSong={playLikedSong} />
        );
      default:
        return (
          <div className="text-white text-2xl">Page not found</div>
        );
    }
  };

  const renderContent = () => {
    // Show different content based on authentication status
    if (!isAuthenticated) {
      return renderNotLoggedInContent();
    } else {
      return renderLoggedInContent();
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-[#181818] via-[#232323] to-[#181818] px-4 md:px-10 overflow-y-auto min-h-screen text-white">
      {renderContent()}
      {selectedSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <SongResult
            song={selectedSong}
            onBack={() => setSelectedSong(null)}
            onPlay={playSong}
          />
        </div>
      )}
      {showLoginModal && <LoginModal />}
    </main>
  );
};

export default MainContent;