import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Gallery } from './sections/Gallery';
import { Releases } from './sections/Releases';
import { Events } from './sections/Events';
import { Footer } from './sections/Footer';
import { GalleryPage } from './pages/GalleryPage';
import Preloader from './components/Preloader';

import { EventPage } from './pages/EventPage';
import { EventsArchivePage } from './pages/EventsArchivePage';
import { ShortUrlRedirect } from './components/ShortUrlRedirect';
import ScrollToHashElement from './components/ScrollToHashElement';

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <Events />
    <About />
    <Gallery />
    <Releases />
    <Footer />
  </>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('neovision_has_visited');
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      setIsFirstVisit(true);
    }
  }, []);

  // Optional: Prevent scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} isFirstVisit={isFirstVisit} key="preloader" />}
      </AnimatePresence>

      <ScrollToHashElement />

      {!isLoading && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventsArchivePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/e/:slug" element={<ShortUrlRedirect />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
