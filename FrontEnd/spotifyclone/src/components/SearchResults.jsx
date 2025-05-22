import React from "react";
import SongNotFound from "./SongNotFound";

const SearchResults = ({ 
  results, 
  onSongClick, 
  searchTerm, 
  likedSongs, 
  toggleLikeStatus, 
  isAuthenticated, 
  onPlay 
}) => {
  if (!results || results.length === 0) {
    return <SongNotFound searchTerm={searchTerm} />;
  }

  const topResult = results[0];

  const isLiked = (song) => {
    return likedSongs.some(s => (s.id || s._id) === (song.id || song._id));
  };

  const handleLikeClick = async (e, song) => {
    e.stopPropagation();
    if (isAuthenticated && toggleLikeStatus) {
      await toggleLikeStatus(song);
    }
  };

  const handlePlayClick = (e, song) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(song);
    }
  };

  return (
    <div className="px-8 py-6 text-white bg-gray-800">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Top result */}
        <div className="flex-1 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white">Top result</h2>
          <div 
            className="bg-[#232323] rounded-lg p-8 flex flex-col items-start gap-6 shadow-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
            onClick={() => onSongClick(topResult)}
          >
            <img
              src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"
              alt={topResult.title}
              className="w-32 h-32 rounded mb-6 object-cover"
            />
            <div className="flex-1 w-full">
              <div className="text-3xl font-extrabold mb-2 text-white">{topResult.title}</div>
              <div className="text-gray-400 text-lg mb-4">
                Author • <span className="font-bold text-white">{topResult.artist}</span>
              </div>
              
              {/* Action buttons for top result */}
              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-all hover:scale-105"
                  onClick={(e) => handlePlayClick(e, topResult)}
                >
                  <img src="/assets/frontend-assets/play.png" alt="Play" className="w-4 h-4" />
                  <span>Play</span>
                </button>
                
                {isAuthenticated && (
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 ${
                      isLiked(topResult) ? 'text-green-500' : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={(e) => handleLikeClick(e, topResult)}
                    title={isLiked(topResult) ? "Remove from liked songs" : "Add to liked songs"}
                  >
                    <img
                      src="/assets/frontend-assets/like.png"
                      alt="Like"
                      className="w-5 h-5"
                      style={{ 
                        filter: isLiked(topResult) 
                          ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)'
                          : 'none' 
                      }}
                    />
                  </button>
                )}
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
                className="flex items-center justify-between py-3 px-3 border-b border-gray-800 hover:bg-[#181818] rounded transition text-white cursor-pointer group"
                onClick={() => onSongClick(song)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <img
                      src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"
                      alt={song.title}
                      className="w-12 h-12 rounded"
                    />
                    {/* Play button overlay */}
                    <button
                      className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handlePlayClick(e, song)}
                    >
                      <img src="/assets/frontend-assets/play.png" alt="Play" className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-base text-white">{song.title}</div>
                    <div className="text-gray-400 text-sm">{song.artist}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
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

                  {/* Duration */}
                  <div className="text-gray-400 text-sm min-w-[40px] text-right">
                    {song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : ""}
                  </div>
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