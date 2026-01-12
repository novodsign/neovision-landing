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
      // We set the flag in sessionStorage INSIDE the Preloader when animation finishes, 
      // or here? Better in Preloader so if they close early it resets? 
      // Actually standard practice is usually immediate or on complete. 
      // Let's rely on logic passing true/false.
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

      {!isLoading && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/event/:id" element={<EventPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
