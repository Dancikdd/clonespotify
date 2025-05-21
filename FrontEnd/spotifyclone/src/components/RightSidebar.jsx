import React from "react";

const RightSidebar = ({ currentSong, queue = [], showQueue = false, onPlayQueueSong, recentlyPlayed = [] }) => {
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
            src={
              currentSong?.thumbnail ||
              currentSong?.image ||
              "/assets/frontend-assets/default_song_thumbnail.png"
            }
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
          <button className="text-gray-400 hover:text-white">
            <img src="/assets/frontend-assets/like.png" alt="Like" className="w-5 h-5" />
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
                <img src={item.thumbnail || item.image || "/assets/frontend-assets/default_song_thumbnail.png"} alt={item.title} className="w-12 h-12 rounded" />
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
            recentlyPlayed.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 group">
                <img src={item.image || item.thumbnail || "/assets/frontend-assets/default_song_thumbnail.png"} alt={item.title} className="w-12 h-12 rounded" />
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