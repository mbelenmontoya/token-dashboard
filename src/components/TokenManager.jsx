import { useState, useEffect } from 'react';

export default function TokenManager({ token }) {
  const [tokens, setTokens] = useState([]);
  const [form, setForm]     = useState({
    name: '', value: '', category: 'color', description: ''
  });

  const fetchTokens = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tokens`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTokens(data.tokens || data);
  };

  const createToken = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL}/api/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:  `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });
    setForm({ name: '', value: '', category: 'color', description: '' });
    fetchTokens();
  };

  const deleteToken = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/tokens/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTokens();
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h2>Design Tokens</h2>
      <ul>
        {tokens.map(t => (
          <li key={t._id} style={{ marginBottom: '0.5rem' }}>
            <strong>{t.name}</strong>: {t.value}{' '}
            <button onClick={() => deleteToken(t._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Add New Token</h3>
      <form onSubmit={createToken}>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="Value"
          value={form.value}
          onChange={e => setForm({ ...form, value: e.target.value })}
        />
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          <option value="color">color</option>
          <option value="spacing">spacing</option>
          <option value="font">font</option>
          <option value="shadow">shadow</option>
          <option value="other">other</option>
        </select>
        <button type="submit">Add Token</button>
      </form>
    </div>
  );
}
