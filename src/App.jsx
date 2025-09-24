import React from 'react';
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
  const user = JSON.parse(localStorage.getItem('user'));
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