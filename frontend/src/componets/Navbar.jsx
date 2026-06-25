import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar1.css';
import connection from './photos/connection.png';
import bookmark from './photos/bookmark.png';
import premium from './photos/premium.png';
import user1 from './photos/user.png';
import search from './photos/search.png';

const Navbar = ({ username, onLogout }) => {
  // Safely handle both string and object username
  const displayName = typeof username === 'string' 
    ? username 
    : username?.username || username?.displayName || '';
  
  const [categorizes, setcategorizes] = useState(false);
  const [news, setnews] = useState(false);
  const [user, setuser] = useState(false);
  const [count, setcount] = useState(0);
  const [count1, setcount1] = useState(0);
  const [count2, setcount2] = useState(0);

  /* toggle logic */
  useEffect(() => {
    if (count === 1) setcategorizes(true);
    else if (count === 2) {
      setcategorizes(false);
      setcount(0);
    }
  }, [count]);

  useEffect(() => {
    if (count1 === 1) setnews(true);
    else if (count1 === 2) {
      setnews(false);
      setcount1(0);
    }
  }, [count1]);

  useEffect(() => {
    if (count2 === 1) setuser(true);
    else if (count2 === 2) {
      setuser(false);
      setcount2(0);
    }
  }, [count2]);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-container">
          {/* -------- left side -------- */}
          <ul className="nav-left">
            <li className="logo-item">
              <div className="logo-container">
                <img src={connection} className="logo" alt="Crunchyroll" />
                <span className="brand-name">Crunchyroll</span>
              </div>
            </li>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/New">New</NavLink></li>
            <li><NavLink to="/Popular">Popular</NavLink></li>
            
            <li className="dropdown" onClick={() => setcount(prev => prev + 1)}>
              <a href="#">Categories ↓</a>
              {categorizes && (
                <ul className="submenu69">
                  <li><NavLink to="/genre/action">Action</NavLink></li>
                  <li><NavLink to="/genre/adventure">Adventure</NavLink></li>
                  <li><NavLink to="/genre/comedy">Comedy</NavLink></li>
                  <li><NavLink to="/genre/drama">Drama</NavLink></li>
                  <li><NavLink to="/genre/fantasy">Fantasy</NavLink></li>
                  <li><NavLink to="/genre/music">Music</NavLink></li>
                  <li><NavLink to="/genre/romance">Romance</NavLink></li>
                  <li><NavLink to="/genre/sci-fi">Sci-Fi</NavLink></li>
                  <li><NavLink to="/genre/seinen">Seinen</NavLink></li>
                  <li><NavLink to="/genre/shojo">Shojo</NavLink></li>
                  <li><NavLink to="/genre/shonen">Shonen</NavLink></li>
                  <li><NavLink to="/genre/slice-of-life">Slice of life</NavLink></li>
                  <li><NavLink to="/genre/sports">Sports</NavLink></li>
                  <li><NavLink to="/genre/supernatural">Supernatural</NavLink></li>
                  <li><NavLink to="/genre/thriller">Thriller</NavLink></li>
                </ul>
              )}
            </li>

            <li className="dropdown" onClick={() => setcount1(prev => prev + 1)}>
              <a href="#">News ↓</a>
              {news && (
                <ul className="submenu4">
                  <li><NavLink to="/news/all">All News</NavLink></li>
                  <li><NavLink to="/news/anime-award">Anime Award</NavLink></li>
                  <li><NavLink to="/news/event-experience">Event Experience</NavLink></li>
                </ul>
              )}
            </li>
          </ul>

          {/* -------- right side -------- */}
          <ul className="nav-right">
            <li><a href="/Premium"><img src={premium} className="icon1" alt="Premium" /></a></li>
            <li><a href="/Search"><img src={search} className="icon" alt="Search" /></a></li>
            <li><a href="/bookmark"><img src={bookmark} className="icon" alt="Bookmark" /></a></li>

            <li className="dropdown" onClick={() => setcount2(prev => prev + 1)}>
              <a href="#"><img src={user1} className="icon" alt="User" /></a>
              {user && (
                <ul className="submenu4">
                  <br />
                  {!displayName ? (
                    <>
                      <li><h3><NavLink to="/Create">Create Account</NavLink></h3></li>
                      <li><h3><NavLink to="/Login">Log In</NavLink></h3></li>
                    </>
                  ) : (
                    <>
                      <li><h3>Welcome, {displayName}!</h3></li>
                      <li onClick={onLogout}>
                        <h3>Logout</h3>
                      </li>
                    </>
                  )}
                  <li><h3><NavLink to="/Giftcard">Gift Card</NavLink></h3></li>
                  <button className="premium_button">🜲 7-Days Free Trial</button>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
