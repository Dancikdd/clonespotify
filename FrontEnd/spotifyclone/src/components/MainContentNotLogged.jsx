import React, { useState, useEffect } from "react";
import SongResult from "./SongResult";

const MainContentNotLogged = ({ currentPage, playSong }) => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    // Fetch 8 random songs from the database for trending songs
    const fetchTrendingSongs = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/songs/random?count=8");
        const data = await res.json();
        setTrendingSongs(data.songs || []);
      } catch (error) {
        console.error("Error fetching trending songs:", error);
      }
    };

    // Fetch random songs by the same artists for popular albums
    const fetchPopularAlbums = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/songs/albums-by-artist?count=8");
        const data = await res.json();
        setPopularAlbums(data.songs || []);
      } catch (error) {
        console.error("Error fetching popular albums:", error);
      }
    };

    fetchTrendingSongs();
    fetchPopularAlbums();
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="text-white">
            {/* Trending songs */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Trending songs</h2>
                <button 
                  className="text-sm text-gray-400 hover:underline"
                  onClick={() => window.location.reload()}
                >
                  Show all
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {trendingSongs.length === 0 ? (
                  <div className="text-gray-400">Loading trending songs...</div>
                ) : (
                  trendingSongs.map((song) => (
                    <div key={song.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                        <img
                          src={encodeURI(song.img_url) || song.thumbnail || song.image || "/assets/frontend-assets/default_song_thumbnail.png"}
                          alt={song.title}
                          className="w-full h-full object-cover"
                          onClick={() => setSelectedSong(song)}
                        />
                        <button
                          className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl hover:scale-125"
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
                  ))
                )}
              </div>
            </section>

            {/* Popular albums and singles */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Popular albums and singles</h2>
                <button 
                  className="text-sm text-gray-400 hover:underline"
                  onClick={() => window.location.reload()}
                >
                  Show all
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {popularAlbums.length === 0 ? (
                  <div className="text-gray-400">Loading popular albums...</div>
                ) : (
                  popularAlbums.map((album) => (
                    <div key={album.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                        <img
                          src={encodeURI(album.img_url) || album.thumbnail || album.image || "/assets/frontend-assets/default_song_thumbnail.png"}
                          alt={album.title}
                          className="w-full h-full object-cover"
                          onClick={() => setSelectedSong(album)}
                        />
                        <button
                          className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl hover:scale-125"
                          onClick={e => {
                            e.stopPropagation();
                            playSong(album);
                          }}
                          title="Play"
                        >
                          <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="text-white font-semibold truncate w-full text-center">{album.title}</div>
                      <div className="text-gray-400 text-xs truncate w-full text-center">{album.artist}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        );
      case 'search':
        return (
          <div className="text-white text-2xl">Search Page Content</div>
        );
      case 'library':
        return (
          <div className="text-white text-2xl">Please log in to access your library</div>
        );
      default:
        return (
          <div className="text-white text-2xl">Page not found</div>
        );
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
    </main>
  );
};

export default MainContentNotLogged;