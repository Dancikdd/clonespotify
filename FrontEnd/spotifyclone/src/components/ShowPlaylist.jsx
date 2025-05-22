import React, { useEffect, useState } from "react";

const ShowPlaylist = ({ 
  playlist, 
  onBack, 
  playSong, 
  playPlaylistSong, 
  likedSongs, 
  toggleLikeStatus, 
  isAuthenticated 
}) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/playlists/${playlist.id || playlist._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSongs(data.songs || []);
      setLoading(false);
    };
    fetchSongs();
  }, [playlist]);

  const handlePlaySong = (song, index) => {
    // Use playPlaylistSong if available (for playlist context), otherwise use regular playSong
    if (playPlaylistSong) {
      playPlaylistSong(song, songs, index);
    } else {
      playSong(song);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      handlePlaySong(songs[0], 0);
    }
  };

  const handleShufflePlay = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      handlePlaySong(songs[randomIndex], randomIndex);
    }
  };

  const isLiked = (song) => {
    return likedSongs.some(s => (s.id || s._id) === (song.id || song._id));
  };

  const handleLikeClick = async (e, song) => {
    e.stopPropagation();
    if (isAuthenticated && toggleLikeStatus) {
      await toggleLikeStatus(song);
    }
  };

  return (
    <div className="p-8">
      <button className="mb-4 text-gray-400 hover:text-white" onClick={onBack}>← Back</button>
      
      {/* Playlist Header */}
      <div className="flex items-center space-x-6 mb-8">
        <img 
          src={playlist.img_url || "/assets/frontend-assets/default_song_thumbnail.png"} 
          alt={playlist.name} 
          className="w-32 h-32 rounded-lg shadow-lg" 
        />
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide">Playlist</p>
          <h1 className="text-4xl font-bold text-white mb-2">{playlist.name}</h1>
          <p className="text-gray-400">
            {songs.length} song{songs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Play Controls */}
      {songs.length > 0 && (
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handlePlayAll}
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-full flex items-center space-x-2 transition-all hover:scale-105"
          >
            <img src="/assets/frontend-assets/play.png" alt="Play" className="w-5 h-5" />
            <span>Play</span>
          </button>
          <button
            onClick={handleShufflePlay}
            className="border border-gray-400 hover:border-white text-gray-400 hover:text-white font-bold py-3 px-8 rounded-full flex items-center space-x-2 transition-all"
          >
            <img src="/assets/frontend-assets/shuffle.png" alt="Shuffle" className="w-5 h-5" />
            <span>Shuffle</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading songs...</div>
      ) : (
        <div>
          {songs.length === 0 ? (
            <div className="text-gray-400">No songs in this playlist.</div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-800">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Title</div>
                <div className="col-span-3">Artist</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Songs List */}
              {songs.map((song, index) => (
                <div
                  key={song.id || song._id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 text-white hover:bg-[#232323] rounded-md group cursor-pointer"
                  onClick={() => handlePlaySong(song, index)}
                >
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                    <button className="hidden group-hover:block text-green-500 hover:text-green-400">
                      <img src="/assets/frontend-assets/play.png" alt="Play" className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="col-span-4 flex items-center space-x-3">
                    <img 
                      src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"
                      alt={song.title} 
                      className="w-10 h-10 rounded" 
                    />
                    <div>
                      <div className="font-medium text-white">{song.title}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-400">{song.artist}</span>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-400">{song.duration || "3:45"}</span>
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2">
                    {/* Like Button */}
                    {isAuthenticated && (
                      <button
                        className={`opacity-0 group-hover:opacity-100 transition-all hover:scale-110 ${
                          isLiked(song) ? 'text-green-500' : 'text-gray-400 hover:text-white'
                        }`}
                        onClick={(e) => handleLikeClick(e, song)}
                        title={isLiked(song) ? "Remove from liked songs" : "Add to liked songs"}
                      >
                        <img
                          src="/assets/frontend-assets/like.png"
                          alt="Like"
                          className="w-4 h-4"
                          style={{ 
                            filter: isLiked(song) 
                              ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)'
                              : 'none' 
                          }}
                        />
                      </button>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs transition-all"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const token = localStorage.getItem("token");
                        await fetch(`http://localhost:5050/api/playlists/${playlist.id || playlist._id}/songs/${song.id || song._id}`, {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });
                        setSongs(songs.filter(s => (s.id || s._id) !== (song.id || song._id)));
                      }}
                      title="Remove from playlist"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowPlaylist;