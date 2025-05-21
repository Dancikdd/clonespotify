import React from "react";

const SongResult = ({ song, onBack, onPlay }) => (
  <div className="px-8 py-8 text-white bg-gray-800 min-h-[300px]">
    <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white">&larr; Back</button>
    <div className="flex items-center gap-8">
      <img
        src={song.thumbnail || "/assets/frontend-assets/default_song_thumbnail.png"}
        alt={song.title}
        className="w-40 h-40 rounded object-cover"
      />
      <div>
        <div className="text-4xl font-bold mb-2">{song.title}</div>
        <div className="text-lg text-gray-300 mb-2">{song.artist}</div>
        <div className="text-gray-400 mb-2">
          Duration: {song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : "N/A"}
        </div>
        {/* Green Play Button */}
        <button
          className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition"
          onClick={() => onPlay(song)}
        >
         Play
        </button>
      </div>
    </div>
  </div>
);

export default SongResult;