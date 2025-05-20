import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('songs'); // 'songs' or 'albums'
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [newSongData, setNewSongData] = useState({
    thumbnail: '',
    audioFile: null,
    title: '',
    artist: '',
    duration: '',
    album: '',
  });
  const [newAlbumData, setNewAlbumData] = useState({
    cover: null,
    title: '',
    artist: '',
    releaseYear: '',
    songs: '', // This could be an array of song IDs or objects later
  });

  // Placeholder data for stats - replace with actual data fetching later
  const stats = [
    { label: "Total Songs", value: 15, color: "text-green-500" },
    { label: "Total Albums", value: 5, color: "text-purple-500" },
    { label: "Total Artists", value: 17, color: "text-orange-500" },
    { label: "Total Users", value: 3, color: "text-blue-500" },
  ];

  // Simulate fetching data on component mount
  React.useEffect(() => {
    // In a real application, you would fetch data from your backend APIs here
    // Example: axios.get('/api/songs').then(response => setSongs(response.data));
    // Example: axios.get('/api/albums').then(response => setAlbums(response.data));

    // Placeholder data
    const placeholderSongs = [
      { id: 1, thumbnail: '/assets/frontend-assets/img1.jpg', title: 'Placeholder Song 1', artist: 'Artist A', releaseDate: '2023-01-15' },
      { id: 2, thumbnail: '/assets/frontend-assets/img2.jpg', title: 'Placeholder Song 2', artist: 'Artist B', releaseDate: '2023-02-20' },
      // Add more placeholder songs as needed
    ];

    const placeholderAlbums = [
      { id: 1, cover: '/assets/frontend-assets/album1.jpg', title: 'Placeholder Album 1', artist: 'Artist X', releaseYear: 2022, numberOfSongs: 10 },
      { id: 2, cover: '/assets/frontend-assets/album2.jpg', title: 'Placeholder Album 2', artist: 'Artist Y', releaseYear: 2023, numberOfSongs: 8 },
      // Add more placeholder albums as needed
    ];

    setSongs(placeholderSongs);
    setAlbums(placeholderAlbums);

  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle input change for Add Song modal
  const handleAddSongInputChange = (e) => {
    const { id, value, files } = e.target;
    setNewSongData(prevData => ({
      ...prevData,
      [id]: files ? files[0] : value,
    }));
  };

  // Handle Add Song form submission
  const handleAddSongSubmit = () => {
    console.log('Submitting new song data:', newSongData);
    // In a real application, send newSongData to your backend API to add the song
    // After successful submission, you would typically close the modal and refresh the songs list
    setShowAddSongModal(false);
    setNewSongData({
      thumbnail: '',
      audioFile: null,
      title: '',
      artist: '',
      duration: '',
      album: '',
    }); // Reset form
  };

   // Handle input change for Add Album modal
  const handleAddAlbumInputChange = (e) => {
    const { id, value, files } = e.target;
    setNewAlbumData(prevData => ({
      ...prevData,
      [id]: files ? files[0] : value,
    }));
  };

  // Handle Add Album form submission
  const handleAddAlbumSubmit = () => {
    console.log('Submitting new album data:', newAlbumData);
    // In a real application, send newAlbumData to your backend API to add the album
    // After successful submission, you would typically close the modal and refresh the albums list
    setShowAddAlbumModal(false);
    setNewAlbumData({
      cover: null,
      title: '',
      artist: '',
      releaseYear: '',
      songs: '',
    }); // Reset form
  };

  // Handle delete song
  const handleDeleteSong = (songId) => {
    console.log('Deleting song with ID:', songId);
    // In a real application, send a DELETE request to your backend API
    // After successful deletion, update the local state
    setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
  };

  // Handle delete album
  const handleDeleteAlbum = (albumId) => {
    console.log('Deleting album with ID:', albumId);
    // In a real application, send a DELETE request to your backend API
    // After successful deletion, update the local state
    setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== albumId));
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#232323] rounded-lg p-6 shadow-lg">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabbed Content Area */}
      <div>
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'songs' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('songs')}
          >
            Songs Library
          </button>
          <button
            className={`ml-4 px-4 py-2 text-sm font-medium ${activeTab === 'albums' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('albums')}
          >
            Albums Library
          </button>
        </div>

        {/* Content based on active tab */}
        <div>
          {activeTab === 'songs' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Songs Library</h2>
              {/* Add Song Button */}
              <div className="flex justify-end mb-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => setShowAddSongModal(true)}
                >
                  + Add Song
                </button>
              </div>

              {/* Songs Table */}
              <div className="bg-[#232323] rounded-lg p-6 shadow-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>{/* Thumbnail */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Release Date</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {/* Song rows will go here */}
                    {songs.map(song => (
                      <tr key={song.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <img src={song.thumbnail} alt={song.title} className="h-10 w-10 rounded object-cover" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{song.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{song.artist}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{song.releaseDate}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteSong(song.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Song Modal */}
              {showAddSongModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-[#232323] rounded-lg p-8 w-1/2">
                    <h2 className="text-xl font-bold mb-4">Add New Song</h2>
                    {/* Form Fields */}
                    <div className="mb-4">
                      <label htmlFor="artwork" className="block text-sm font-medium text-gray-400">Artwork</label>
                      {/* Placeholder for file upload/drag and drop */}
                      <input type="file" id="artwork" className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" onChange={handleAddSongInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="audioFile" className="block text-sm font-medium text-gray-400">Audio File</label>
                      {/* Placeholder for audio file upload */}
                      <input type="file" id="audioFile" className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handleAddSongInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-400">Title</label>
                      <input type="text" id="title" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={newSongData.title} onChange={handleAddSongInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="artist" className="block text-sm font-medium text-gray-400">Artist</label>
                      <input type="text" id="artist" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={newSongData.artist} onChange={handleAddSongInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-400">Duration (seconds)</label>
                      <input type="number" id="duration" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={newSongData.duration} onChange={handleAddSongInputChange} />
                    </div>
                     <div className="mb-4">
                      <label htmlFor="album" className="block text-sm font-medium text-gray-400">Album (optional)</label>
                      {/* Placeholder for album selection - could be a dropdown later */}
                      <input type="text" id="album" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={newSongData.album} onChange={handleAddSongInputChange} />
                    </div>
                    <div className="flex justify-end">
                      <button className="mr-2 px-4 py-2 text-gray-400 hover:text-white font-medium rounded-md" onClick={() => setShowAddSongModal(false)}>Cancel</button>
                      <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md" onClick={handleAddSongSubmit}>Add Song</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'albums' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Albums Library</h2>
              {/* Add Album Button */}
              <div className="flex justify-end mb-4">
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => setShowAddAlbumModal(true)}
                >
                  + Add Album
                </button>
              </div>

              {/* Albums Table (or Cards) */}
              <div className="bg-[#232323] rounded-lg p-6 shadow-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>{/* Album Cover */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Release Year</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"># Songs</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {/* Album rows will go here */}
                    {albums.map(album => (
                      <tr key={album.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                           <img src={album.cover} alt={album.title} className="h-10 w-10 rounded object-cover" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{album.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{album.artist}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{album.releaseYear}</td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{album.numberOfSongs}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteAlbum(album.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Album Modal */}
              {showAddAlbumModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-[#232323] rounded-lg p-8 w-1/2">
                    <h2 className="text-xl font-bold mb-4">Add New Album</h2>
                    {/* Form Fields */}
                    <div className="mb-4">
                      <label htmlFor="albumArtwork" className="block text-sm font-medium text-gray-400">Artwork</label>
                      {/* Placeholder for file upload/drag and drop */}
                      <input type="file" id="albumArtwork" className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" onChange={handleAddAlbumInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="albumTitle" className="block text-sm font-medium text-gray-400">Title</label>
                      <input type="text" id="albumTitle" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" value={newAlbumData.title} onChange={handleAddAlbumInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="albumArtist" className="block text-sm font-medium text-gray-400">Artist</label>
                      <input type="text" id="albumArtist" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" value={newAlbumData.artist} onChange={handleAddAlbumInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-400">Release Year</label>
                      <input type="number" id="releaseYear" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" value={newAlbumData.releaseYear} onChange={handleAddAlbumInputChange} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="albumSongs" className="block text-sm font-medium text-gray-400">Songs (select or attach existing)</label>
                       {/* Placeholder for song selection */}
                      <textarea id="albumSongs" rows="3" className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" value={newAlbumData.songs} onChange={handleAddAlbumInputChange}></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button className="mr-2 px-4 py-2 text-gray-400 hover:text-white font-medium rounded-md" onClick={() => setShowAddAlbumModal(false)}>Cancel</button>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md" onClick={handleAddAlbumSubmit}>Add Album</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 