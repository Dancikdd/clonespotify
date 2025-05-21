import React from "react";
import SongNotFound from "./SongNotFound";

const SearchResults = ({ results, onSongClick, searchTerm }) => {
  if (!results || results.length === 0) {
    return <SongNotFound searchTerm={searchTerm} />;
  }

  const topResult = results[0];

  return (
    <div className="px-8 py-6 text-white bg-gray-800">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Top result */}
        <div className="flex-1 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white">Top result</h2>
          <div className="bg-[#232323] rounded-lg p-8 flex flex-col items-start gap-6 shadow-lg">
            <img
              src={topResult.thumbnail || "/assets/frontend-assets/default_song_thumbnail.png"}
              alt={topResult.title}
              className="w-32 h-32 rounded mb-6 object-cover"
            />
            <div>
              <div className="text-3xl font-extrabold mb-2 text-white">{topResult.title}</div>
              <div className="text-gray-400 text-lg mb-1">
                Author • <span className="font-bold text-white">{topResult.artist}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Songs list */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4 text-white">Songs</h2>
          <ul>
            {results.map(song => (
              <li
                key={song.id}
                className="flex items-center justify-between py-3 border-b border-gray-800 hover:bg-[#181818] rounded transition text-white cursor-pointer"
                onClick={() => onSongClick(song)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.thumbnail || "/assets/frontend-assets/default_song_thumbnail.png"}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="font-semibold text-base text-white">{song.title}</div>
                    <div className="text-gray-400 text-sm">{song.artist}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm min-w-[40px] text-right">
                  {song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : ""}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;