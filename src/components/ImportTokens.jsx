// src/components/ImportTokens.jsx
import { useState } from 'react';

export default function ImportTokens({ token, onComplete }) {
  const [file, setFile]     = useState(null);
  const [message, setMessage] = useState('');

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return setMessage('Select a JSON file first');
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/tokens/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setMessage(`Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors.length}`);
      onComplete();  // refresh token list
    } catch (err) {
      setMessage('Import failed: ' + err.message);
    }
  };

  return (
    <div className="my-4">
      <h3 className="text-lg mb-2">Bulk Import Tokens</h3>
      <input type="file" accept=".json" onChange={handleFile} />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="ml-2 px-3 py-1 bg-green-500 text-white rounded"
      >
        Upload
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
