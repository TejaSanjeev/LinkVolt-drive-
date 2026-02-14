import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  // Fetch user's uploads on load
  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/user/uploads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploads(res.data);
    } catch (err) {
      console.error("Failed to fetch uploads", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this file? This cannot be undone.')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/user/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI immediately
      setUploads(uploads.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {username}! 👋</h2>
        <a href="/" className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
          + New Upload
        </a>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-gray-700">Your Active Uploads</h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading your files...</p>
      ) : uploads.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p>You haven't uploaded anything yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {uploads.map((file) => (
            <div key={file.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">
                   {file.type === 'file' ? `📄 ${file.originalName}` : '📝 Text Snippet'}
                </div>
                <div className="text-xs text-gray-500 mt-1 space-x-3">
                  <span>👀 Views: {file.views} {file.maxViews ? `/ ${file.maxViews}` : ''}</span>
                  <span>⏳ Expires: {new Date(file.expiresAt).toLocaleString()}</span>
                  {file.password && <span className="text-yellow-600 font-bold">🔒 Locked</span>}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${file.id}`)}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                >
                  Copy Link
                </button>
                <button 
                  onClick={() => handleDelete(file.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;