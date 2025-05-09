import { useState, useEffect } from 'react';
import ImportTokens from './ImportTokens';

export default function TokenManager({ token }) {
  const API_BASE = import.meta.env.VITE_API_URL;

  const [tokens, setTokens] = useState([]);
  const [form, setForm]     = useState({
    name: '', value: '', category: 'color', description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchTokens = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tokens`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTokens(data.tokens || data);
    } catch (err) {
      console.error('Fetch tokens error:', err);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  // Create or update token
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const url = editingId
        ? `${API_BASE}/api/tokens/${editingId}`
        : `${API_BASE}/api/tokens`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(`Error ${method}: ${res.status}`);
      setMessage(editingId ? 'Token updated!' : 'Token added!');
      setEditingId(null);
      setForm({ name: '', value: '', category: 'color', description: '' });
      fetchTokens();
    } catch (err) {
      console.error(err);
      setMessage('Operation failed. See console.');
    }
  };

  // Delete token
  const deleteToken = async (id) => {
    try {
      await fetch(`${API_BASE}/api/tokens/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Token deleted!');
      fetchTokens();
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Delete failed.');
    }
  };

  // Start editing
  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      value: t.value,
      category: t.category,
      description: t.description || ''
    });
    setMessage('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', value: '', category: 'color', description: '' });
    setMessage('');
  };
  

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Design Tokens</h2>
      {message && <p className="mb-2 text-blue-600">{message}</p>}
      <ul className="space-y-2 mb-4">
        {tokens.map((t) => (
          <li key={t._id} className="flex justify-between items-center">
            <span>
              <strong>{t.name}</strong>: {t.value}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(t)}
                className="px-2 py-1 bg-yellow-400 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteToken(t._id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ImportTokens token={token} onComplete={fetchTokens} />

      <h3 className="text-xl mb-2">
        {editingId ? 'Edit Token' : 'Add New Token'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="color">color</option>
          <option value="spacing">spacing</option>
          <option value="font">font</option>
          <option value="shadow">shadow</option>
          <option value="other">other</option>
        </select>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex space-x-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {editingId ? 'Update Token' : 'Add Token'}
          </button>
        </div>
      </form>
    </div>
  );
}
