import React, { useState } from 'react';
import axios from 'axios';

const ReportGenerator = ({ token }) => {
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    if (!sessionId) {
      setError('Please enter a session ID');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/generate-report', {
        session_id: sessionId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(`Report generated successfully: ${response.data.filename}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sessionId">
          Session ID
        </label>
        <input
          id="sessionId"
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Enter session ID (e.g., session_001)"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        onClick={handleGenerateReport}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>
      
      {message && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Available Session IDs:</h3>
        <ul className="list-disc list-inside">
          <li>session_001 (Health & Fitness Assessment)</li>
          <li>session_002 (Cardiac Assessment)</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;