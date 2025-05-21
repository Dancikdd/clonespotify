import React from "react";

const SongNotFound = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white py-20 px-8 rounded-lg">
      <div className="text-6xl mb-6">😢</div>
      <h2 className="text-3xl font-bold mb-3">No matches found</h2>
      <p className="text-gray-400 text-lg mb-6 text-center max-w-md">
        We couldn't find any songs matching{" "}
        <span className="text-white font-semibold">"{searchTerm}"</span>
      </p>
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Try:</h3>
        <ul className="list-disc pl-6 text-gray-400">
          <li className="mb-2">Checking your spelling</li>
          <li className="mb-2">Using fewer keywords</li>
          <li className="mb-2">Searching for a different song</li>
          <li>Browsing our featured playlists instead</li>
        </ul>
      </div>
    </div>
  );
};

export default SongNotFound;