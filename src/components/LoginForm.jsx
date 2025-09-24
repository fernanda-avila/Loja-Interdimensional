import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao logar');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2.5rem 2rem',
        borderRadius: '18px',
        maxWidth: '400px',
        margin: '2rem',
      }}
    >
      <label style={{ fontWeight: 'bold', color: '#7fff00', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
        Email
        <div style={{ position: 'relative' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.9rem 1.2rem 0.9rem 2.5rem',
              borderRadius: '10px',
              border: '2px solid #7fff00',
              background: '#222',
              color: '#fff',
              fontSize: '1.1rem',
              boxShadow: '0 0 8px #7fff0033',
              outline: 'none',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.border = '2px solid #bfff00';
              e.target.style.boxShadow = '0 0 16px #bfff00a0';
            }}
            onBlur={e => {
              e.target.style.border = '2px solid #7fff00';
              e.target.style.boxShadow = '0 0 8px #7fff0033';
            }}
          />
          <span style={{
            position: 'absolute',
            left: '0.7rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#7fff00',
            fontSize: '1.3rem',
            pointerEvents: 'none',
          }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M2.94 5.5A2 2 0 0 1 4.8 4h10.4a2 2 0 0 1 1.86 1.5L10 10.25 2.94 5.5zm-.44 1.26V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.76l-7.06 4.75a1 1 0 0 1-1.12 0L2.5 6.76z"/></svg>
          </span>
        </div>
      </label>
      <label style={{ fontWeight: 'bold', color: '#7fff00', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
        Senha
        <div style={{ position: 'relative' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.9rem 1.2rem 0.9rem 2.5rem',
              borderRadius: '10px',
              border: '2px solid #7fff00',
              background: '#222',
              color: '#fff',
              fontSize: '1.1rem',
              boxShadow: '0 0 8px #7fff0033',
              outline: 'none',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.border = '2px solid #bfff00';
              e.target.style.boxShadow = '0 0 16px #bfff00a0';
            }}
            onBlur={e => {
              e.target.style.border = '2px solid #7fff00';
              e.target.style.boxShadow = '0 0 8px #7fff0033';
            }}
          />
          <span style={{
            position: 'absolute',
            left: '0.7rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#7fff00',
            fontSize: '1.3rem',
            pointerEvents: 'none',
          }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-6 4V8a6 6 0 1 1 12 0v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-8a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"/></svg>
          </span>
        </div>
      </label>
      <button
        type="submit"
        className="btn"
        style={{
         
          color: '#222',
          border: 'none',
          borderRadius: '50px',
          padding: '1rem 4rem',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: '0 0 8px #7fff00a0',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >Entrar</button>
      {error && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
    </form>
  );
}
