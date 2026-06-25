import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './index.css';

import Navbar           from './componets/Navbar.jsx';
import App              from './App.jsx';
import New_navbar       from './navigate_pages/New_navbar.jsx';
import Create_acc       from './navigate_pages/Create_acc.jsx';
import Popular_navbar   from './navigate_pages/Popular_navbar.jsx';
import Login_acc        from './navigate_pages/Login_acc.jsx';
import Search           from './navigate_pages/Search.jsx';
import Giftcard         from './navigate_pages/Giftcard.jsx';
import Premium_nav      from './navigate_pages/Premium_nav.jsx';
import Bookmark         from './navigate_pages/bookmark.jsx';
import BackAnimeDetails from './componets/BackAnimeDetails.jsx';
import WatchVideoPage   from './componets/WatchVideoPage.jsx';

const RootApp = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  console.log('Username:', username, 'Display Name:', displayName);
  const location = useLocation();
  const navigate = useNavigate();

  // CHECK AUTH STATUS ON STARTUP - USING PROXY
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/verify-auth', { // CHANGED: Using proxy path
          withCredentials: true
        });
        if (response.data.authenticated) {
          setUsername(response.data.username);
          setDisplayName(response.data.displayname);
        }
      } catch (error) {
        // Not authenticated, which is fine
      }
    };
    checkAuth();
  }, []);

  // LOGOUT - USING PROXY
  const handleLogout = async () => {
    try {
      await axios.post('/Logout', {}, { // CHANGED: Using proxy path
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    console.log('Logging out user:', username);
    setUsername('');
    setDisplayName('');
    navigate('/');
  };

  const hideNavbarRoutes = ['/Create', '/Login', '/Premium', ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar 
          username={displayName} 
          onLogout={handleLogout} 
        />
      )}
      <Routes>
        <Route path="/"       element={<App />} />
        <Route path="/New"    element={<New_navbar />} />
        <Route path="/Popular" element={<Popular_navbar />} />
        <Route path="/Create" element={<Create_acc setUsername={setUsername} setDisplayName={setDisplayName}  /> } />
        <Route path="/Login"  element={<Login_acc setUsername={setUsername}  setDisplayName={setDisplayName} />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/bookmark" element={<Bookmark username= {username} />} />
        <Route path="/Giftcard" element={<Giftcard />} />
        <Route path="/Premium" element={<Premium_nav />} />
        <Route path="/anime/:id" element={<BackAnimeDetails />} />
        <Route path="/watch/:animeid/:episodenumber" element={<WatchVideoPage />} />
      </Routes>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RootApp />
    </BrowserRouter>
  </StrictMode>
);
