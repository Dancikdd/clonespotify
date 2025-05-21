import React, { useState } from "react";

const CreatePlaylist = ({ open, onClose, onCreated }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistImage, setPlaylistImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5050/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: playlistName,
          img_url: playlistImage,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }
      setPlaylistName("");
      setPlaylistImage("");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Error creating playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <form
        className="bg-[#232323] p-8 rounded-lg shadow-lg w-full max-w-sm relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="absolute top-2 right-4 text-white text-2xl hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-white text-xl font-bold mb-4">Create Playlist</h2>
        <label className="block text-gray-300 mb-2">Playlist Name</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 rounded bg-[#181818] text-white"
          value={playlistName}
          onChange={e => setPlaylistName(e.target.value)}
          required
        />
        <label className="block text-gray-300 mb-2">Playlist Image URL</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 rounded bg-[#181818] text-white"
          value={playlistImage}
          onChange={e => setPlaylistImage(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;