import React, { useState, useEffect } from "react";

const EditPlaylist = ({ open, playlist, onClose, onUpdated, onDeleted }) => {
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (playlist) {
      setName(playlist.name || "");
      setImgUrl(playlist.img_url || "");
    }
  }, [playlist]);

  if (!open || !playlist) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5050/api/playlists/${playlist.id || playlist._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, img_url: imgUrl }),
      });
      if (!response.ok) throw new Error("Failed to update playlist");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || "Error updating playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    setIsSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5050/api/playlists/${playlist.id || playlist._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete playlist");
      if (onDeleted) onDeleted();
      onClose();
    } catch (err) {
      setError(err.message || "Error deleting playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <form
        className="bg-[#232323] p-8 rounded-lg shadow-lg w-full max-w-sm relative"
        onSubmit={handleUpdate}
      >
        <button
          type="button"
          className="absolute top-2 right-4 text-white text-2xl hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-white text-xl font-bold mb-4">Edit Playlist</h2>
        <label className="block text-gray-300 mb-2">Playlist Name</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 rounded bg-[#181818] text-white"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <label className="block text-gray-300 mb-2">Playlist Image URL</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 rounded bg-[#181818] text-white"
          value={imgUrl}
          onChange={e => setImgUrl(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            Delete
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Done"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlaylist;