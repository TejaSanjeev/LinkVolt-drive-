import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/user/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploads(uploads.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto"> {/* Changed max-w-4xl to 6xl */}
      <div className="glass-panel rounded-2xl p-8 border border-gray-700/50 min-h-[500px]">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">My Active Vault</h2>
            <p className="text-gray-400 text-sm mt-1">Manage and track your shared files</p>
          </div>
          <Link to="/" className="btn-volt px-6 py-3 rounded-lg text-white font-bold text-sm shadow-lg hover:scale-105 transition">
            + Create New Link
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900/30">
            <p className="text-gray-500 text-xl">Your vault is empty.</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300 mt-2 inline-block font-semibold">Upload your first file</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Header Row (Hidden on mobile) */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase px-5 mb-2">
                <div className="col-span-4">Name</div>
                <div className="col-span-2 text-center">Stats</div>
                <div className="col-span-3 text-center">Expiry</div>
                <div className="col-span-3 text-right">Actions</div>
            </div>

            {uploads.map((file) => (
              <div key={file.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-800/60 transition hover:shadow-lg hover:border-blue-500/30 group">
                
                {/* File Info */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${file.type === 'file' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                    <span className="text-2xl">{file.type === 'file' ? '📄' : '📝'}</span>
                  </div>
                  <div className="overflow-hidden">
                      <h3 className="font-bold text-gray-200 truncate">{file.type === 'file' ? file.originalName : 'Text Snippet'}</h3>
                      <div className="text-xs text-gray-500 font-mono mt-1">{file.id}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="col-span-6 md:col-span-2 flex justify-center">
                    <span className="bg-gray-900/80 px-3 py-1 rounded text-blue-300 border border-gray-700 text-sm font-mono">
                        👁 {file.views} / {file.maxViews || '∞'}
                    </span>
                </div>

                {/* Expiry */}
                <div className="col-span-6 md:col-span-3 flex justify-center text-sm text-gray-400">
                    {new Date(file.expiresAt).toLocaleString()}
                </div>
                
                {/* Actions */}
                <div className="col-span-12 md:col-span-3 flex justify-end gap-3">
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/${file.id}`);
                        alert('Link Copied!');
                    }}
                    className="px-4 py-2 text-sm bg-cyan-900/20 text-cyan-400 border border-cyan-900/50 rounded-lg hover:bg-cyan-900/40 hover:text-cyan-300 transition"
                  >
                    Copy
                  </button>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="px-4 py-2 text-sm bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/40 hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;