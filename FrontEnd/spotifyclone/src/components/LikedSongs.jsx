import React from "react";

const LikedSongs = ({ 
  likedSongs, 
  playLikedSong, 
  onShowLikedSongs, 
  toggleLikeStatus, 
  isAuthenticated 
}) => {
  const handleUnlikeClick = async (e, song) => {
    e.stopPropagation();
    if (isAuthenticated && toggleLikeStatus) {
      await toggleLikeStatus(song);
    }
  };

  const handlePlayAllShuffle = () => {
    if (likedSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * likedSongs.length);
      playLikedSong(likedSongs[randomIndex], randomIndex);
    }
  };

  return (
    <div className="p-8 text-white">
      {/* Header Section */}
      <div className="flex items-center mb-8 bg-gradient-to-r from-purple-700 to-blue-500 p-6 rounded-lg shadow-xl">
        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-md flex items-center justify-center mr-6">
          <img src="/assets/frontend-assets/like.png" alt="Liked Songs Icon" className="w-12 h-12 filter invert" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Playlist</div>
          <h1 className="text-4xl font-extrabold">Liked Songs</h1>
          <div className="text-sm text-gray-200 mt-2">
            {likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Play Controls */}
      {likedSongs.length > 0 && (
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => playLikedSong(likedSongs[0], 0)}
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-full flex items-center space-x-2 transition-all hover:scale-105"
          >
            <img src="/assets/frontend-assets/play.png" alt="Play" className="w-5 h-5" />
            <span>Play</span>
          </button>
          <button
            onClick={handlePlayAllShuffle}
            className="border border-gray-400 hover:border-white text-gray-400 hover:text-white font-bold py-3 px-8 rounded-full flex items-center space-x-2 transition-all"
          >
            <img src="/assets/frontend-assets/shuffle.png" alt="Shuffle" className="w-5 h-5" />
            <span>Shuffle</span>
          </button>
        </div>
      )}

      {/* Songs List or Empty State */}
      {likedSongs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/assets/frontend-assets/like.png" alt="Like" className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Songs you like will appear here</h3>
          <p className="text-gray-400 mb-6">Save songs by tapping the heart icon.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
          >
            Find something to like
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-800">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Artist</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Songs List */}
          {likedSongs.map((song, index) => (
            <div
              key={song.id || song._id}
              className="grid grid-cols-12 gap-4 px-4 py-3 text-white hover:bg-[#232323] rounded-md group cursor-pointer"
              onClick={() => playLikedSong(song, index)}
            >
              <div className="col-span-1 flex items-center">
                <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                <button className="hidden group-hover:block text-green-500 hover:text-green-400">
                  <img src="/assets/frontend-assets/play.png" alt="Play" className="w-4 h-4" />
                </button>
              </div>
              
              <div className="col-span-5 flex items-center space-x-3">
                <img
                  src={song.image || "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"}
                  alt="Album cover"
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
              
              <div className="col-span-1 flex items-center">
                {/* Unlike Button */}
                {isAuthenticated && (
                  <button
                    className="opacity-0 group-hover:opacity-100 text-green-500 hover:text-red-500 transition-all hover:scale-110"
                    onClick={(e) => handleUnlikeClick(e, song)}
                    title="Remove from liked songs"
                  >
                    <img
                      src="/assets/frontend-assets/like.png"
                      alt="Unlike"
                      className="w-4 h-4"
                      style={{ 
                        filter: 'invert(53%) sepia(71%) saturate(4976%) hue-rotate(133deg) brightness(101%) contrast(104%)'
                      }}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongs;