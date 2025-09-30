import React, { useEffect, useState } from 'react';
import './index.css';

import Header from './components/Header';
import Mission from './components/Mission';
import StudyMaterials from './components/StudyMaterials';
import Features from './components/Features';
import SpecialProducts from './components/SpecialProducts';
import TechStack from './components/TechStack';
import ApiRoutes from './components/ApiRoutes';
import Security from './components/Security';
import DatabaseModel from './components/DatabaseModel';
import Timeline from './components/Timeline';
import FinalPresentation from './components/FinalPresentation';
import Footer from './components/Footer';
import AdminProducts from './components/AdminProducts';


function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch { return null; }
  });

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          // token inválido ou expirado; limpar
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          return;
        }
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      } catch (err) {
        // erro de rede: mantém user do localStorage, mas não assume permissões
        console.error('Erro validando token:', err);
      }
    };
    validate();
  }, []);

  // escuta eventos de login/logout para atualizar o estado do usuário em tempo real
  useEffect(() => {
    const onLogin = (e) => {
      try {
        const u = e?.detail || JSON.parse(localStorage.getItem('user'));
        setUser(u);
      } catch {
        setUser(null);
      }
    };
    const onLogout = () => setUser(null);
    window.addEventListener('user:login', onLogin);
    window.addEventListener('user:logout', onLogout);
    return () => {
      window.removeEventListener('user:login', onLogin);
      window.removeEventListener('user:logout', onLogout);
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Mission />
        <StudyMaterials />
        <Features />
        <SpecialProducts />
        {user && user.isAdmin && <AdminProducts />}
        <TechStack />
        <ApiRoutes />
        <Security />
        <DatabaseModel />
        <Timeline />
        <FinalPresentation />
      </main>
      <Footer />
    </>
  );
}

export default App;