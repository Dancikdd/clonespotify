import React from "react";

const RightSidebar = ({ currentSong, queue = [], showQueue = false, onPlayQueueSong, recentlyPlayed = [], likedSongs = [], toggleLikeStatus }) => {
  const isCurrentSongFavorited = likedSongs.some(
    s => String(s.id || s._id) === String(currentSong?.id || currentSong?._id)
  );

  return (
    <div className="w-64 flex-shrink-0 bg-[#181818] h-screen overflow-y-auto flex flex-col border-l border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src="/assets/frontend-assets/queue.png" alt="Queue" className="w-6 h-6" />
            <h2 className="text-white font-bold">Queue</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <img src="/assets/frontend-assets/clock_icon.png" alt="Time" className="w-4 h-4" />
          <span>Now playing</span>
        </div>
      </div>

      {/* Current song */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img
            src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"
            alt="Current song"
            className="w-12 h-12 rounded"
          />
          <div className="flex-1">
            <div className="text-white font-medium">
              {currentSong?.title || "No song playing"}
            </div>
            <div className="text-gray-400 text-sm">
              {currentSong?.artist || ""}
            </div>
          </div>
          <button
            className={`text-gray-400 hover:text-white transition-transform hover:scale-125 ${isCurrentSongFavorited ? 'text-green-500' : ''}`}
            onClick={() => toggleLikeStatus && currentSong && toggleLikeStatus(currentSong)}
          >
            <img
              src="/assets/frontend-assets/like.png"
              alt="Like"
              className="w-5 h-5"
              style={{
                filter: isCurrentSongFavorited
                  ? 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)'
                  : 'none'
              }}
            />
          </button>
        </div>
      </div>

      {/* Next up */}
      {showQueue && queue.length > 0 && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
            <img src="/assets/frontend-assets/next.png" alt="Next" className="w-4 h-4" />
            <span>Next up</span>
          </div>
          <div className="space-y-4">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 group">
                <img src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1" alt={item.title} className="w-12 h-12 rounded" />
                <div className="flex-1">
                  <div className="text-white font-medium group-hover:text-green-500 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-gray-400 text-sm">{item.artist}</div>
                </div>
                <button
                  className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onPlayQueueSong && onPlayQueueSong(item)}
                >
                  <img src="/assets/frontend-assets/plays.png" alt="Play" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently played */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
          <img src="/assets/frontend-assets/clock_icon.png" alt="Time" className="w-4 h-4" />
          <span>Recently played</span>
        </div>
        <div className="space-y-4">
          {recentlyPlayed.length === 0 ? (
            <div className="text-gray-400">No recently played songs.</div>
          ) : (
            recentlyPlayed.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 group cursor-pointer"
                onClick={() => onPlayQueueSong && onPlayQueueSong(item)}
              >
                <img src="https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1" alt={item.title} className="w-12 h-12 rounded" />
                <div className="flex-1">
                  <div className="text-white font-medium group-hover:text-green-500 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-gray-400 text-sm">{item.artist}</div>
                </div>
                <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <img src="/assets/frontend-assets/plays.png" alt="Play" className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;