import React, { useEffect, useState } from "react";

const ShowPlaylist = ({ playlist, onBack, playSong }) => {
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

  return (
    <div className="p-8">
      <button className="mb-4 text-gray-400 hover:text-white" onClick={onBack}>← Back</button>
      <div className="flex items-center space-x-4 mb-6">
        <img src={playlist.img_url || "/assets/frontend-assets/default_song_thumbnail.png"} alt={playlist.name} className="w-24 h-24 rounded" />
        <div>
          <h1 className="text-3xl font-bold text-white">{playlist.name}</h1>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-400">Loading songs...</div>
      ) : (
        <div>
          {songs.length === 0 ? (
            <div className="text-gray-400">No songs in this playlist.</div>
          ) : (
            <ul>
              {songs.map(song => (
                <li
                  key={song.id}
                  className="py-2 text-white border-b border-gray-800 flex items-center group"
                >
                  <button
                    className="mr-3 opacity-70 group-hover:opacity-100"
                    onClick={() => playSong(song)}
                    title="Play"
                  >
                    <svg width="24" height="24" fill="currentColor" className="text-green-500">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  </button>
                  <span className="flex-1 cursor-pointer" onClick={() => playSong(song)}>
                    {song.title} – {song.artist}
                  </span>
                  <button
                    className="ml-3 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                    onClick={async () => {
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
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowPlaylist;