import React, { useState, useEffect } from "react";

const tabs = ["All", "Music", "Podcasts", "Albums"];

const MainContent = ({ currentPage, likedSongs, playSong, isAuthenticated, openPlaylist }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [madeForYouArtist, setMadeForYouArtist] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPlaylists = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/playlists", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPlaylists(data.playlists || []);
      };
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMadeForYou = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/playlists/made-for-you", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMadeForYou(data.songs || []);
        setMadeForYouArtist(data.artist || "");
      };
      fetchMadeForYou();
    }
  }, [isAuthenticated]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        if (isAuthenticated) {
          const dailyMixes = [
            { id: 1, image: "/assets/frontend-assets/img7.jpg", title: "Daily Mix 1", artists: "Artist 1, Artist 2" },
            { id: 2, image: "/assets/frontend-assets/img8.jpg", title: "Daily Mix 2", artists: "Artist 3, Artist 4" },
            { id: 3, image: "/assets/frontend-assets/img9.jpg", title: "Daily Mix 3", artists: "Artist 5, Artist 6" },
            { id: 4, image: "/assets/frontend-assets/img10.jpg", title: "Daily Mix 4", artists: "Artist 7, Artist 8" },
            { id: 5, image: "/assets/frontend-assets/img11.jpg", title: "Daily Mix 5", artists: "Artist 9, Artist 10" },
            { id: 6, image: "/assets/frontend-assets/img12.jpg", title: "Daily Mix 6", artists: "Artist 11, Artist 12" },
          ];

          const recommendedStations = [
            { name: "ECHO", image: "/assets/frontend-assets/img13.jpg" },
            { name: "Три дня дождя", image: "/assets/frontend-assets/img14.jpg" },
            { name: "Nikitata", image: "/assets/frontend-assets/img15.jpg" },
            { name: "Mary Gu", image: "/assets/frontend-assets/img16.jpg" },
            { name: "Lost", image: "/assets/frontend-assets/img1.jpg" },
            { name: "Лютики", image: "/assets/frontend-assets/img2.jpg" },
          ];

          const recentlyPlayed = [
            { id: 1, image: "/assets/frontend-assets/img3.jpg", title: "Playlist 1", artist: "Artist 1" },
            { id: 2, image: "/assets/frontend-assets/img4.jpg", title: "Playlist 2", artist: "Artist 2" },
            { id: 3, image: "/assets/frontend-assets/img5.jpg", title: "Playlist 3", artist: "Artist 3" },
            { id: 4, image: "/assets/frontend-assets/img6.jpg", title: "Playlist 4", artist: "Artist 4" },
            { id: 5, image: "/assets/frontend-assets/img7.jpg", title: "Playlist 5", artist: "Artist 5" },
            { id: 6, image: "/assets/frontend-assets/img8.jpg", title: "Playlist 6", artist: "Artist 6" },
          ];

          return (
            <>
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
                {/* Revert to previous card style for initial demoCards */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {playlists.length === 0 ? (
                    <div className="text-gray-400">No playlists found.</div>
                  ) : (
                    playlists.map((playlist) => (
                      <div
                        key={playlist.id || playlist._id}
                        className="min-w-[180px] h-24 rounded-xl overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => openPlaylist(playlist)} // <-- add this
                      >
                        <img src={playlist.img_url || "/assets/frontend-assets/default_song_thumbnail.png"} alt={playlist.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{playlist.name}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Made For You / Random Playlist by Artist */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Made For You {madeForYouArtist && <span className="text-green-400">({madeForYouArtist})</span>}
                  </h2>
                  <button
                    className="text-sm text-gray-400 hover:underline"
                    onClick={() => {
                      setMadeForYou([]);
                      setMadeForYouArtist("");
                      (async () => {
                        const token = localStorage.getItem("token");
                        const res = await fetch("http://localhost:5050/api/playlists/made-for-you", {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        const data = await res.json();
                        setMadeForYou(data.songs || []);
                        setMadeForYouArtist(data.artist || "");
                      })();
                    }}
                  >
                    Refresh
                  </button>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {madeForYou.length === 0 ? (
                    <div className="text-gray-400">No songs found.</div>
                  ) : (
                    madeForYou.map((song) => {
                      console.log(song.img_url, encodeURI(song.img_url));
                      return (
                        <div
                          key={song.id}
                          className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center"
                          onClick={() => playSong(song)}
                        >
                          <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                            <img
                              src={encodeURI(song.img_url) || song.thumbnail || song.image || "/assets/frontend-assets/default_song_thumbnail.png"}
                              alt={song.title}
                              className="w-full h-full object-cover border border-red-500"
                            />
                            <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                              <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{song.title}</div>
                          <div className="text-gray-400 text-sm truncate w-full text-center">{song.artist}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Recommended Stations */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Recommended Stations</h2>
                  <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div>
                {/* Apply consistent card style to Recommended Stations */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {recommendedStations.map((station, i) => (
                     <div key={i} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                        <img src={station.image} alt={station.name} className="w-full h-full object-cover" />
                         {/* No play button on these radio cards based on image */}
                      </div>
                      <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{station.name}</div>
                      <div className="text-gray-400 text-sm truncate w-full text-center">Radio</div>
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
                {/* Apply consistent card style to Recently Played */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {recentlyPlayed.map((item) => (
                    <div key={item.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                        <img
                          src={encodeURI(item.img_url) || item.thumbnail || item.image || "/assets/frontend-assets/default_song_thumbnail.png"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                         <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                          <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="text-white font-semibold truncate w-full text-center">{item.title}</div>
                      <div className="text-gray-400 text-xs truncate w-full text-center">{item.artist}</div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          );
        } else {
          const trendingSongs = [
             { id: 1, image: "/assets/frontend-assets/img1.jpg", title: "LUNA BALA - Slowed", artist: "Yb Wasg'ood, Ariis" },
             { id: 2, image: "/assets/frontend-assets/img2.jpg", title: "Soarele A Apus", artist: "Satoshi" },
             { id: 3, image: "/assets/frontend-assets/img3.jpg", title: "Кухни", artist: "Бонд с кнопкой" },
             { id: 4, image: "/assets/frontend-assets/img4.jpg", title: "Dincolo de noi", artist: "Mihail" },
             { id: 5, image: "/assets/frontend-assets/img5.jpg", title: "LOS VOLTAJE", artist: "Sayfaise, Yb Wasg'ood, Ariis" },
             { id: 6, image: "/assets/frontend-assets/img6.jpg", title: "Наследство", artist: "Icegergert, SKY RAE" },
             { id: 7, image: "/assets/frontend-assets/img7.jpg", title: "Espresso Macchiato", artist: "Tommy Cash" },
             { id: 8, image: "/assets/frontend-assets/img8.jpg", title: "Bipolară", artist: "Denis Ramniceanu, Ministerul Manelelor" },
          ];

          const popularArtists = [
             { id: 1, image: "/assets/frontend-assets/artist1.jpg", name: "The Weeknd" },
             { id: 2, image: "/assets/frontend-assets/artist2.jpg", name: "Lady Gaga" },
             { id: 3, image: "/assets/frontend-assets/artist3.jpg", name: "Carla's Dreams" },
             { id: 4, image: "/assets/frontend-assets/artist4.jpg", name: "Billie Eilish" },
             { id: 5, image: "/assets/frontend-assets/artist5.jpg", name: "Irina Rimes" },
             { id: 6, image: "/assets/frontend-assets/artist6.jpg", name: "MiyaGi & Endspiel" },
             { id: 7, image: "/assets/frontend-assets/artist7.jpg", name: "Miyagi & Andy Panda" },
             { id: 8, image: "/assets/frontend-assets/artist8.jpg", name: "MACAN" },
          ];

          const popularAlbums = [
             { id: 1, image: "/assets/frontend-assets/album1.jpg", title: "Graf Monte-Cristo", artist: "Artist 1" },
             { id: 2, image: "/assets/frontend-assets/album2.jpg", title: "I AM", artist: "Artist 2" },
             { id: 3, image: "/assets/frontend-assets/album3.jpg", title: "Butter Keaton", artist: "Artist 3" },
             { id: 4, image: "/assets/frontend-assets/album4.jpg", title: "MUSIC", artist: "Artist 4" },
             { id: 5, image: "/assets/frontend-assets/album5.jpg", title: "HIT ME HARD", artist: "Artist 5" },
             { id: 6, image: "/assets/frontend-assets/album6.jpg", title: "Despre El", artist: "Artist 6" },
             { id: 7, image: "/assets/frontend-assets/album7.jpg", title: "YAMAKASI", artist: "Artist 7" },
             { id: 8, image: "/assets/frontend-assets/album8.jpg", title: "Cristoforo Colombo", artist: "Artist 8" },
          ];

          // Placeholder data for new sections (Logged Out Home Page)
          const popularRadioStations = [
            { id: 1, image: "/assets/frontend-assets/artist8.jpg", name: "MACAN" },
            { id: 2, image: "/assets/frontend-assets/artist7.jpg", name: "Satoshi" },
            { id: 3, image: "/assets/frontend-assets/artist6.jpg", name: "Ислам Итляшев" },
            { id: 4, image: "/assets/frontend-assets/artist5.jpg", name: "Skryptonite" },
            { id: 5, image: "/assets/frontend-assets/artist4.jpg", name: "ANNA ASTI" },
            { id: 6, image: "/assets/frontend-assets/artist3.jpg", name: "Irina Rimes" },
            { id: 7, image: "/assets/frontend-assets/artist2.jpg", name: "MOT" },
            { id: 8, image: "/assets/frontend-assets/artist1.jpg", name: "MiyaGi" },
          ];

          const featuredCharts = [
            { id: 1, color: "from-purple-600 to-blue-500", title: "Top Songs Global", subtitle: "Weekly Music Charts" },
            { id: 2, color: "from-red-600 to-orange-500", title: "Top Songs USA", subtitle: "Weekly Music Charts" },
            { id: 3, color: "from-red-600 to-red-500", title: "Top 50", subtitle: "Global" },
            { id: 4, color: "from-red-600 to-red-500", title: "Top 50", subtitle: "USA" },
            { id: 5, color: "from-green-600 to-green-500", title: "Viral 50", subtitle: "Global" },
            { id: 6, color: "from-purple-600 to-blue-500", title: "Viral 50", subtitle: "USA" },
          ];

          const playlistsFromEditors = [
            { id: 1, image: "/assets/frontend-assets/playlist1.jpg", title: "Feel Good", description: "An uplifting yet tuneful dinner playlist with a..." },
            { id: 2, image: "/assets/frontend-assets/playlist2.jpg", title: "Dinner Jazz", description: "The gentle sound of some of the greatest..." },
            { id: 3, image: "/assets/frontend-assets/playlist3.jpg", title: "Dinner Music", description: "Great food, good company and some soft..." },
            { id: 4, image: "/assets/frontend-assets/playlist4.jpg", title: "Dinner Lounge", description: "Soft electronic music for your dinner..." },
            { id: 5, image: "/assets/frontend-assets/playlist5.jpg", title: "Bossa Nova Dinner", description: "Soundtrack your cozy dinner with bossa nova..." },
            { id: 6, image: "/assets/frontend-assets/playlist6.jpg", title: "Latin Dinner", description: "You bring the ingredients, we bring t..." },
            { id: 7, image: "/assets/frontend-assets/playlist7.jpg", title: "Dinner with Friends", description: "The perfect soundtrack to those long nights w..." },
            { id: 8, image: "/assets/frontend-assets/playlist8.jpg", title: "Buon Appetito!", description: "Buon Appetito!" },
          ];

          return (
            <div className="text-white">
              {/* Trending songs */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Trending songs</h2>
                  <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div>
                {/* Apply consistent card style to Trending songs */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {trendingSongs.map((song) => (
                    <div key={song.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                        <img
                          src={encodeURI(song.img_url) || song.thumbnail || song.image || "/assets/frontend-assets/default_song_thumbnail.png"}
                          alt={song.title}
                          className="w-full h-full object-cover border border-red-500"
                        />
                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                          <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{song.title}</div>
                      <div className="text-gray-400 text-sm truncate w-full text-center">{song.artist}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Popular artists */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Popular artists</h2>
                  <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div>
                {/* Apply consistent card style to Popular artists with rounded images */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {popularArtists.map((artist) => (
                    <div key={artist.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-full overflow-hidden">
                        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover rounded-full" />
                        {/* No play button on artist cards based on image */}
                      </div>
                      <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{artist.name}</div>
                      <div className="text-gray-400 text-sm truncate w-full text-center">Artist</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Popular albums and singles */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Popular albums and singles</h2>
                  <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div>
                {/* Apply consistent card style to Popular albums and singles */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {popularAlbums.map((album) => (
                    <div key={album.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                        <img
                          src={encodeURI(album.img_url) || album.thumbnail || album.image || "/assets/frontend-assets/default_song_thumbnail.png"}
                          alt={album.title}
                          className="w-full h-full object-cover border border-red-500"
                        />
                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                          <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="text-white font-semibold truncate w-full text-center">{album.title}</div>
                      <div className="text-gray-400 text-xs truncate w-full text-center">{album.artist}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Popular radio */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Popular radio</h2>
                  <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div>
                {/* Apply consistent card style to Popular radio */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {popularRadioStations.map((station) => (
                    <div key={station.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                        <img src={station.image} alt={station.name} className="w-full h-full object-cover" />
                        {/* No play button on these radio cards based on image */}
                      </div>
                      <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{station.name}</div>
                      <div className="text-gray-400 text-sm truncate w-full text-center">Radio</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured charts */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Featured Charts</h2>
                  <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div>
                {/* Keep Featured Charts as is based on the provided image */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {featuredCharts.map((chart) => (
                    <div key={chart.id} className={`w-56 h-48 flex-shrink-0 rounded-lg overflow-hidden relative cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br ${chart.color} p-4 flex flex-col justify-between`}>
                       <div>
                         <div className="text-white font-bold text-xl">{chart.title}</div>
                         <div className="text-white text-sm mt-1">{chart.subtitle}</div>
                       </div>
                       {/* Optional: Add an icon or image here */}
                    </div>
                  ))}
                </div>
              </section>

              {/* Playlists from our editors */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Playlists from our editors</h2>
                  <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div>
                {/* Apply consistent card style to Playlists from our editors */}
                <div className="flex gap-6 overflow-x-auto pb-2">
                  {playlistsFromEditors.map((playlist) => (
                     <div key={playlist.id} className="w-56 flex-shrink-0 rounded-lg p-4 bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group flex flex-col items-center">
                       <div className="relative w-48 h-48 mb-3 rounded-md overflow-hidden">
                         <img
                           src={encodeURI(playlist.img_url) || playlist.thumbnail || playlist.image || "/assets/frontend-assets/default_song_thumbnail.png"}
                           alt={playlist.title}
                           className="w-full h-full object-cover border border-red-500"
                         />
                         <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                          <img src="/assets/frontend-assets/play.png" alt="Play" className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="text-white font-bold text-lg mb-1 truncate w-full text-center">{playlist.title}</div>
                      <div className="text-gray-400 text-sm truncate w-full text-center">{playlist.description}</div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          );
        }
      case 'search':
        return (
          <div className="text-white text-2xl">Search Page Content</div>
        );
      case 'library':
        return (
          <div className="text-white">
            {/* Liked Songs Header */}
            <div className="flex items-center mb-8 bg-gradient-to-r from-purple-700 to-blue-500 p-6 rounded-lg shadow-xl">
              {/* Static Liked Songs Album Art/Icon */}
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-md flex items-center justify-center mr-6">
                <img src="/assets/frontend-assets/like.png" alt="Liked Songs Icon" className="w-12 h-12 filter invert" />
              </div>
              <div>
                <div className="text-sm font-semibold">Playlist</div>
                <h1 className="text-4xl font-extrabold">Liked Songs</h1>
                <div className="text-sm text-gray-200 mt-2">
                  {likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Liked Songs List */}
            {likedSongs.length === 0 ? (
              <p className="text-gray-400">You haven't liked any songs yet.</p>
            ) : (
              <div className="mt-8">
                {likedSongs.map(song => (
                  <div
                    key={song.id}
                    className="flex items-center space-x-4 p-2 rounded-md hover:bg-[#232323] cursor-pointer"
                    onClick={() => playSong(song)}
                  >
                    {/* Song Image (using a placeholder for now) */}
                    <img src={song.image || "/assets/frontend-assets/placeholder_album.png"} alt="Album cover" className="w-12 h-12 rounded" />
                    <div>
                      <div className="text-white font-medium">{song.title}</div>
                      <div className="text-gray-400 text-sm">{song.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="text-white text-2xl">Page not found</div>
        );
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-[#181818] via-[#232323] to-[#181818] px-4 md:px-10 overflow-y-auto min-h-screen text-white">
      {renderContent()}
    </main>
  );
};

export default MainContent;