import React, { useState, useEffect, useRef } from "react";

const SongResult = ({ 
  song, 
  onBack, 
  onPlay, 
  likedSongs, 
  toggleLikeStatus, 
  isAuthenticated 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [addingTo, setAddingTo] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch playlists on mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/playlists", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPlaylists(data.playlists || []);
    };
    fetchPlaylists();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleAddToPlaylist = async (playlistId) => {
    setAddingTo(playlistId);
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5050/api/playlists/${playlistId}/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ songId: song.id }),
    });
    setAddingTo(null);
    setShowDropdown(false);
    // Optionally show a toast or feedback here
  };

  const isLiked = () => {
    return likedSongs.some(s => (s.id || s._id) === (song.id || song._id));
  };

  const handleLikeClick = async () => {
    if (isAuthenticated && toggleLikeStatus) {
      await toggleLikeStatus(song);
    }
  };

  return (
    <div className="px-8 py-8 text-white bg-gray-800 min-h-[300px]">
      <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white">&larr; Back</button>
      <div className="flex items-center gap-8">
        <img
          src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"
          alt={song.title}
          className="w-40 h-40 rounded object-cover"
        />
        <div>
          <div className="text-4xl font-bold mb-2">{song.title}</div>
          <div className="text-lg text-gray-300 mb-2">{song.artist}</div>
          <div className="text-gray-400 mb-2">
            Duration: {song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : "N/A"}
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex items-center space-x-4 mt-4">
            {/* Green Play Button */}
            <button
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition"
              onClick={() => onPlay(song)}
            >
              Play
            </button>

            {/* Like Button */}
            {isAuthenticated && (
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 ${
                  isLiked() 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                onClick={handleLikeClick}
                title={isLiked() ? "Remove from liked songs" : "Add to liked songs"}
              >
                <img
                  src="/assets/frontend-assets/like.png"
                  alt="Like"
                  className="w-5 h-5"
                  style={{ 
                    filter: isLiked() 
                      ? 'invert(1)' // Make it white when liked
                      : 'none' 
                  }}
                />
              </button>
            )}

            {/* Plus Button for Add to Playlist */}
            <div className="inline-block relative" ref={dropdownRef}>
              <button
                className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full text-2xl text-white transition-all"
                onClick={() => setShowDropdown((v) => !v)}
                title="Add to playlist"
                type="button"
              >
                +
              </button>
              {showDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-[#232323] border border-gray-700 rounded shadow-lg z-50">
                  <div className="p-2 text-gray-300 font-bold border-b border-gray-700">Add to playlist</div>
                  {playlists.length === 0 ? (
                    <div className="p-2 text-gray-400">No playlists found.</div>
                  ) : (
                    playlists.map((pl) => (
                      <div key={pl.id || pl._id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-800">
                        <span className="truncate">{pl.name}</span>
                        <button
                          className="ml-2 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
                          onClick={() => handleAddToPlaylist(pl.id || pl._id)}
                          disabled={addingTo === (pl.id || pl._id)}
                        >
                          {addingTo === (pl.id || pl._id) ? "Adding..." : "Add"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongResult;