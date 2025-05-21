import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('songs'); // 'songs' or 'albums'
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalAlbumsCount, setTotalAlbumsCount] = useState(0);
  const [totalArtistsCount, setTotalArtistsCount] = useState(0);
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5050/api/songs', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setSongs(result.data); // Assuming the backend returns { success: true, data: [...] }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5050/api/users', {
           headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
           // If 403 Forbidden, it means not admin. Handle appropriately.
          if (response.status === 403) {
             console.warn('Attempted to fetch users without admin privileges.');
             // Optionally redirect or show a message
             return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setUsers(result.data); // Assuming backend returns { success: true, count: X, data: [...] }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Placeholder fetch for albums - replace with actual API call later
    const fetchAlbums = async () => {
      // In a real application, you would fetch data from your backend APIs here
      // Example: axios.get('/api/albums').then(response => setAlbums(response.data));

      // Placeholder data
      const placeholderAlbums = [
        { id: 1, cover: '/assets/frontend-assets/album1.jpg', title: 'Placeholder Album 1', artist: 'Artist X', releaseYear: 2022, numberOfSongs: 10 },
        { id: 2, cover: '/assets/frontend-assets/album2.jpg', title: 'Placeholder Album 2', artist: 'Artist Y', releaseYear: 2023, numberOfSongs: 8 },
        // Add more placeholder albums as needed
      ];
      setAlbums(placeholderAlbums);
    };

    fetchSongs();
    fetchUsers(); // Fetch users on mount
    fetchAlbums();

  }, []); // Empty dependency array ensures this runs only once on mount

   // Calculate unique albums and artists whenever songs change
   useEffect(() => {
    const uniqueAlbums = new Set(songs.map(song => song.album).filter(album => album)); // Filter out empty albums
    const uniqueArtists = new Set(songs.map(song => song.artist).filter(artist => artist)); // Filter out empty artists

    setTotalAlbumsCount(uniqueAlbums.size);
    setTotalArtistsCount(uniqueArtists.size);
  }, [songs]); // Recalculate when songs state changes

  // Stats data - now using state variables
  const stats = [
    { label: "Total Songs", value: songs.length, color: "text-green-500" },
    { label: "Total Albums", value: totalAlbumsCount, color: "text-purple-500" },
    { label: "Total Artists", value: totalArtistsCount, color: "text-orange-500" },
    { label: "Total Users", value: users.length, color: "text-blue-500" }, // Use actual users count
  ];

  // Handle input change for Add Song modal
  const handleAddSongInputChange = (e) => {
    const { id, value, files } = e.target;
    setNewSongData(prevData => ({
      ...prevData,
      [id]: files ? files[0] : value,
    }));
  };

  // Handle Add Song form submission
  const handleAddSongSubmit = async () => {
    console.log('Submitting new song data:', newSongData);
    const formData = new FormData();
    formData.append('title', newSongData.title);
    formData.append('artist', newSongData.artist);
    formData.append('album', newSongData.album);
    formData.append('duration', newSongData.duration); // Make sure duration is a number
    if (newSongData.audioFile) {
      formData.append('audioFile', newSongData.audioFile);
    }
    // Add thumbnail/artwork file if needed

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/api/songs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const addedSong = await response.json();
      console.log('Song added successfully:', addedSong);
      setShowAddSongModal(false);
      // Refresh the songs list after adding a new song
      fetchSongs();
       setNewSongData({ // Reset form
        thumbnail: '',
        audioFile: null,
        title: '',
        artist: '',
        duration: '',
        album: '',
      });

    } catch (error) {
      console.error('Error adding song:', error);
      // Handle error (e.g., display error message to user)
    }

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
  const handleAddAlbumSubmit = async () => {
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
  const handleDeleteSong = async (songId) => {
    console.log('Deleting song with ID:', songId);
     try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/songs/${songId}`, {
        method: 'DELETE',
         headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      console.log('Song deleted successfully');
      // Update the local state to remove the deleted song
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
      // Recalculate stats after deletion
      // No need to explicitly call recalculation here because the useEffect with [songs] dependency will handle it.

    } catch (error) {
      console.error('Error deleting song:', error);
      // Handle error (e.g., display error message to user)
    }
  };

  // Handle delete album
  const handleDeleteAlbum = async (albumId) => {
    console.log('Deleting album with ID:', albumId);
     try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/albums/${albumId}`, {
        method: 'DELETE',
         headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      console.log('Album deleted successfully');
      // Update the local state to remove the deleted album
      setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== albumId));

    } catch (error) {
      console.error('Error deleting album:', error);
      // Handle error (e.g., display error message to user)
    }
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
                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>{/* Numbering Column */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>{/* Thumbnail */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Album</th>{/* Added Album Column */}
                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>{/* Added Duration Column */}
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {/* Song rows will go here */}
                    {songs.map((song, index) => (
                      <tr key={song.id}>
                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{index + 1}</td>{/* Song Number */}
                        <td className="px-4 py-4 whitespace-nowrap">
                           {/* Display thumbnail if available, otherwise a placeholder */}
                          <img src={song.thumbnail || '/assets/frontend-assets/default_song_thumbnail.png'} alt={song.title} className="h-10 w-10 rounded object-cover" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{song.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{song.artist}</td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{song.album || 'Unknown Album'}</td>{/* Display Album */}
                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : 'N/A'}</td>{/* Display Duration */}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-[#232323] rounded-lg p-8 w-full max-w-md mx-4">
                    <h2 className="text-xl font-bold mb-4">Add New Song</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddSongSubmit(); }}>
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400">Title *</label>
                        <input
                          type="text"
                          id="title"
                          required
                          className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          value={newSongData.title}
                          onChange={handleAddSongInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="artist" className="block text-sm font-medium text-gray-400">Artist *</label>
                        <input
                          type="text"
                          id="artist"
                          required
                          className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          value={newSongData.artist}
                          onChange={handleAddSongInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="album" className="block text-sm font-medium text-gray-400">Album</label>
                        <input
                          type="text"
                          id="album"
                          className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          value={newSongData.album}
                          onChange={handleAddSongInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-400">Duration (seconds) *</label>
                        <input
                          type="number"
                          id="duration"
                          required
                          min="0"
                          className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          value={newSongData.duration}
                          onChange={handleAddSongInputChange}
                        />
                      </div>
                       <div className="mb-4">
                        <label htmlFor="audioFile" className="block text-sm font-medium text-gray-400">Audio File *</label>
                         <input
                          type="file"
                          id="audioFile"
                          required
                          accept="audio/*"
                          className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          onChange={handleAddSongInputChange}
                        />
                      </div>
                      {/* Consider adding artwork upload field */}
                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          className="mr-2 px-4 py-2 text-gray-400 hover:text-white font-medium rounded-md transition-colors duration-200"
                          onClick={() => setShowAddSongModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                        >
                          Add Song
                        </button>
                      </div>
                    </form>
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

              {/* Albums Table */}
              <div className="bg-[#232323] rounded-lg p-6 shadow-lg">
                <table className="min-w-full divide-y divide-gray-700">
                   <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>{/* Cover */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Release Year</th>
                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"># Songs</th>{/* Number of Songs */}
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {/* Album rows will go here */}
                    {albums.map(album => (
                      <tr key={album.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                           {/* Display cover if available, otherwise a placeholder */}
                          <img src={album.cover || '/assets/frontend-assets/default_album_cover.png'} alt={album.title} className="h-10 w-10 rounded object-cover" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{album.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{album.artist}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{album.releaseYear}</td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{album.numberOfSongs}</td>{/* Display Number of Songs */}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-[#232323] rounded-lg p-8 w-full max-w-md mx-4">
                    <h2 className="text-xl font-bold mb-4">Add New Album</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddAlbumSubmit(); }}>
                      <div className="mb-4">
                        <label htmlFor="albumCover" className="block text-sm font-medium text-gray-400">Artwork</label>
                        <input
                          type="file"
                          id="cover"
                          accept="image/*"
                          className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          onChange={handleAddAlbumInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="albumTitle" className="block text-sm font-medium text-gray-400">Title *</label>
                        <input
                          type="text"
                          id="title"
                          required
                          className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          value={newAlbumData.title}
                          onChange={handleAddAlbumInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="albumArtist" className="block text-sm font-medium text-gray-400">Artist *</label>
                        <input
                          type="text"
                          id="artist"
                          required
                          className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          value={newAlbumData.artist}
                          onChange={handleAddAlbumInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="albumReleaseYear" className="block text-sm font-medium text-gray-400">Release Year</label>
                        <input
                          type="number"
                          id="releaseYear"
                          className="mt-1 block w-full rounded-md bg-[#181818] border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          value={newAlbumData.releaseYear}
                          onChange={handleAddAlbumInputChange}
                        />
                      </div>
                      {/* Consider adding a way to link songs to the album */}
                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          className="mr-2 px-4 py-2 text-gray-400 hover:text-white font-medium rounded-md transition-colors duration-200"
                          onClick={() => setShowAddAlbumModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                        >
                          Add Album
                        </button>
                      </div>
                    </form>
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