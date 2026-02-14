import { useState } from 'react';
import axios from 'axios';

// Change: Accept 'token' prop
const Upload = ({ token }) => {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'file'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  
  // Settings
  const [expiry, setExpiry] = useState(''); // Empty = Default (24h)
  const [maxViews, setMaxViews] = useState(''); // Empty string = unlimited
  const [isOneTime, setIsOneTime] = useState(false); // Toggle state
  const [password, setPassword] = useState(''); // Password state
  
  // UI States
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Helper: Get current date-time string for "min" attribute (prevent past dates)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Handle File Selection with Validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    // Strict Allowlist
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt', 'docx', 'zip'];

    if (selectedFile) {
        // 1. Check Size
        if (selectedFile.size > MAX_FILE_SIZE) {
            setError('File is too large. Max limit is 5MB.');
            setFile(null);
            e.target.value = null; // Reset input
            return;
        }
        
        // 2. Check Extension
        const ext = selectedFile.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            setError(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
            setFile(null);
            e.target.value = null;
            return;
        }

        // Valid File
        setFile(selectedFile);
    }
  };

  const handleOneTimeChange = (e) => {
    const checked = e.target.checked;
    setIsOneTime(checked);
    if (checked) {
      setMaxViews('1');
    } else {
      setMaxViews('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedLink('');

    const formData = new FormData();
    
    // Append Expiry if selected (otherwise backend defaults to 24h)
    if (expiry) {
        formData.append('expiry', expiry);
    }
    
    if (maxViews) formData.append('maxViews', maxViews);
    if (password) formData.append('password', password);

    if (activeTab === 'text') {
      if (!text.trim()) {
        setError('Please enter some text.');
        setLoading(false);
        return;
      }
      formData.append('text', text);
    } else {
      if (!file) {
        setError('Please select a file.');
        setLoading(false);
        return;
      }
      formData.append('file', file);
    }

    try {
      // Configure Headers with Token
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          // Only add the token if it exists (User is logged in)
          ...(token && { Authorization: `Bearer ${token}` }) 
        },
      };

      const res = await axios.post('http://localhost:5000/api/upload', formData, config);

      if (res.data.success) {
        const link = `${window.location.origin}/${res.data.linkId}`;
        setGeneratedLink(link);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`flex-1 py-2 font-semibold ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => { setActiveTab('text'); setGeneratedLink(''); setError(''); }}
        >
          Text
        </button>
        <button
          className={`flex-1 py-2 font-semibold ${activeTab === 'file' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => { setActiveTab('file'); setGeneratedLink(''); setError(''); }}
        >
          File
        </button>
      </div>

      <form onSubmit={handleUpload}>
        <div className="mb-4">
          {activeTab === 'text' ? (
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="5"
              placeholder="Paste your code or text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <input
              type="file"
              className="w-full p-2 border rounded-lg bg-gray-50"
              onChange={handleFileChange}
            />
          )}
        </div>

        {/* Updated Settings Grid with DateTime Picker */}
        <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires At:</label>
            <input
                type="datetime-local"
                min={getMinDateTime()} // Block past dates
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty for 10 minutes</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Views: {isOneTime && <span className="text-xs text-red-500 font-bold">(Locked)</span>}
                </label>
                <input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={maxViews}
                    disabled={isOneTime} 
                    onChange={(e) => setMaxViews(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${isOneTime ? 'bg-gray-100 text-gray-400' : ''}`}
                />
            </div>
        </div>

        <div className="mb-4 flex items-center">
            <input
                id="oneTime"
                type="checkbox"
                checked={isOneTime}
                onChange={handleOneTimeChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="oneTime" className="ml-2 text-sm text-gray-700 font-medium cursor-pointer flex items-center">
                🔥 Burn after reading (1 view only)
            </label>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Protection (Optional):</label>
            <input
                type="password"
                placeholder="Enter a password to lock this link"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 font-semibold shadow-md"
        >
          {loading ? 'Generating Link...' : 'Generate Link'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm text-center rounded border border-red-200">{error}</div>}

      {generatedLink && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 mb-2 font-semibold">Your Secure Link:</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={generatedLink}
              className="flex-1 p-2 text-sm bg-white border rounded text-gray-600 outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                alert("Copied!");
              }}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm font-medium transition"
            >
              Copy
            </button>
          </div>
          <div className="text-xs text-green-600 mt-3 text-center space-y-1">
               {isOneTime 
                 ? <p>⚠️ This link will be deleted immediately after it is viewed once.</p>
                 : maxViews && <p>This link will expire after <b>{maxViews}</b> views.</p>
               }
               {password && <p>🔒 This link is password protected.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;