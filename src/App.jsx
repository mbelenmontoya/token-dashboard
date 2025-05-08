import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm';
import TokenManager from './components/TokenManager';
import './App.css'

function App() {
  const [jwt, setJwt] = useState(null);

  // On mount, read any existing token
  useEffect(() => {
    const existing = localStorage.getItem('jwt');
    if (existing) setJwt(existing);
  }, []);

  // Wrap setJwt so we also write to localStorage
  const handleLogin = (token) => {
    localStorage.setItem('jwt', token);
    setJwt(token);
  };

  // Optional: add a logout handler
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setJwt(null);
  };

  return (
    <div>
      {jwt ? (
        <>
          <button onClick={handleLogout} style={{ float: 'right', margin: 10 }}>
            Logout
          </button>
          <TokenManager token={jwt} />
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App
