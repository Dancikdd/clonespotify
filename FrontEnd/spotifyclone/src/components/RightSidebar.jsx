// Update for RightSidebar.js - Change width and add flex-shrink-0
import React from "react";

const RightSidebar = () => {
  const queueItems = [
    { id: 1, title: "Song 1", artist: "Artist 1", image: "/assets/frontend-assets/img1.jpg" },
    { id: 2, title: "Song 2", artist: "Artist 2", image: "/assets/frontend-assets/img2.jpg" },
    { id: 3, title: "Song 3", artist: "Artist 3", image: "/assets/frontend-assets/img3.jpg" },
    { id: 4, title: "Song 4", artist: "Artist 4", image: "/assets/frontend-assets/img4.jpg" },
    { id: 5, title: "Song 5", artist: "Artist 5", image: "/assets/frontend-assets/img5.jpg" },
  ];

  return (
    <div className="w-64 flex-shrink-0 bg-[#181818] h-screen overflow-y-auto flex flex-col border-l border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src="/assets/frontend-assets/queue.png" alt="Queue" className="w-6 h-6" />
            <h2 className="text-white font-bold">Queue</h2>
          </div>
          <button className="text-gray-400 hover:text-white">
            <img src="/assets/frontend-assets/plus.png" alt="Add to queue" className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <img src="/assets/frontend-assets/clock_icon.png" alt="Time" className="w-4 h-4" />
          <span>Now playing</span>
        </div>
      </div>

      {/* Current song */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img src="/assets/frontend-assets/img1.jpg" alt="Current song" className="w-12 h-12 rounded" />
          <div className="flex-1">
            <div className="text-white font-medium">Current Song</div>
            <div className="text-gray-400 text-sm">Current Artist</div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <img src="/assets/frontend-assets/like.png" alt="Like" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Next up */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
          <img src="/assets/frontend-assets/next.png" alt="Next" className="w-4 h-4" />
          <span>Next up</span>
        </div>
        <div className="space-y-4">
          {queueItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 group">
              <img src={item.image} alt={item.title} className="w-12 h-12 rounded" />
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
          ))}
        </div>
      </div>

      {/* Recently played */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
          <img src="/assets/frontend-assets/clock_icon.png" alt="Time" className="w-4 h-4" />
          <span>Recently played</span>
        </div>
        <div className="space-y-4">
          {queueItems.slice().reverse().map((item) => (
            <div key={item.id} className="flex items-center space-x-3 group">
              <img src={item.image} alt={item.title} className="w-12 h-12 rounded" />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;