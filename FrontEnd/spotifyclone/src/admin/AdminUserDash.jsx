import React, { useState, useEffect } from 'react';

const AdminUserDash = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/api/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) return;
      const result = await response.json();
      setUsers(result.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to make this user an admin?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/users/${userId}/make-admin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      fetchUsers();
    } catch (error) {
      alert('Error making user admin: ' + error.message);
    }
  };

  const handleRemoveAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to remove admin role from this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/users/${userId}/remove-admin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      fetchUsers();
    } catch (error) {
      alert('Error removing admin role: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete (ban) this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      fetchUsers();
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <div className="bg-[#232323] rounded-lg p-6 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{idx + 1}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name || 'N/A'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                  {user.is_admin ? 'Admin' : 'User'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {user.is_admin ? (
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleRemoveAdmin(user.id)}
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleMakeAdmin(user.id)}
                    >
                      Make Admin
                    </button>
                  )}
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserDash;