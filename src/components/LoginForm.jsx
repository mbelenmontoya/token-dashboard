import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { token } = await res.json();
      onLogin(token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </div>
      <div>
        <input
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </div>
      <button type="submit" style={{ width: '100%' }}>
        Login
      </button>
    </form>
  );
}
