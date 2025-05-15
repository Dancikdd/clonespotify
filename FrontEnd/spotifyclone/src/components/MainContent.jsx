import React, { useState } from "react";

const tabs = ["All", "Music", "Podcasts", "Albums"];

const demoCards = [
  { title: "Liked Songs", type: "playlist", color: "from-purple-700 to-purple-400" },
  { title: "My Shazam Tracks", type: "playlist", color: "from-blue-700 to-blue-400" },
  { title: "My playlist #6", type: "playlist", color: "from-pink-700 to-pink-400" },
  { title: "Skillet Radio", type: "radio", color: "from-orange-700 to-orange-400" },
  { title: "Top Songs - Global", type: "playlist", color: "from-green-700 to-green-400" },
  { title: "Daily Mix 5", type: "playlist", color: "from-yellow-700 to-yellow-400" },
];

const dailyMixes = [1, 2, 3, 4, 5, 6];
const recommendedStations = ["ECHO", "Три дня дождя", "Nikitata", "Mary Gu", "Lost", "Лютики"];
const recentlyPlayed = [1, 2, 3, 4, 5, 6];

const MainContent = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="flex-1 bg-gradient-to-b from-[#181818] via-[#232323] to-[#181818] p-10 overflow-y-auto min-h-screen">
      {/* Tab Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-800 via-purple-600 to-blue-700 p-6 mb-8 flex flex-col gap-4 shadow-lg">
        <div className="flex gap-4 mb-4">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === idx ? 'bg-white text-black shadow' : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {demoCards.map((card, i) => (
            <div key={i} className={`min-w-[180px] h-24 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer hover:scale-105 transition-transform`}>
              {card.title}
            </div>
          ))}
        </div>
      </div>

      {/* Made For You / Daily Mixes */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Made For Egor</h2>
          <button className="text-sm text-gray-400 hover:underline">Show all</button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {dailyMixes.map((num) => (
            <div key={num} className="w-48 flex-shrink-0 bg-[#232323] rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center cursor-pointer">
              <div className="h-48 w-48 bg-gray-700 rounded-xl mb-3 shadow-inner"></div>
              <div className="text-white font-bold text-lg mb-1">Daily Mix 0{num}</div>
              <div className="text-gray-400 text-xs text-center">Artist names here</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Stations */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Recommended Stations</h2>
          <button className="text-sm text-gray-400 hover:underline">Show all</button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {recommendedStations.map((name, i) => (
            <div key={i} className={`w-44 h-44 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center p-4 font-bold text-white text-xl shadow-lg bg-gradient-to-tr from-blue-400 to-purple-700 hover:scale-105 transition-transform`}>
              {name}
              <div className="text-xs font-normal text-gray-200 mt-2">Radio</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Recently played</h2>
          <button className="text-sm text-gray-400 hover:underline">Show all</button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {recentlyPlayed.map((num) => (
            <div key={num} className="w-44 flex-shrink-0 bg-[#232323] rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center cursor-pointer">
              <div className="h-44 w-44 bg-gray-700 rounded-xl mb-3 shadow-inner"></div>
              <div className="text-white font-semibold truncate w-full text-center">Playlist {num}</div>
              <div className="text-gray-400 text-xs truncate w-full text-center">Artist Name</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainContent; 