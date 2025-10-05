import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GalleryView from './components/GalleryView';
import ListView from './components/ListView';
import DetailView from './components/DetailView';
import styles from './App.module.css';

function App() {
  return (
    <Router basename="/cs409_mp2">
      <div className={styles.app}>
        <nav className={styles.navbar}>
          <div className={styles.navContainer}>
            <Link to="/" className={styles.navBrand}>
              Pokédex
            </Link>
            <div className={styles.navLinks}>
              <Link to="/" className={styles.navLink}>
                Gallery
              </Link>
              <Link to="/list" className={styles.navLink}>
                List
              </Link>
            </div>
          </div>
        </nav>

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<GalleryView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/pokemon/:name" element={<DetailView />} />
          </Routes>
        </main>

        <footer className={styles.footer}>
          <p>
            Data provided by{' '}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              PokéAPI
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
