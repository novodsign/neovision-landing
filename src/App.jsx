import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Gallery } from './sections/Gallery';
import { Releases } from './sections/Releases';
import { Events } from './sections/Events';
import { Footer } from './sections/Footer';
import { GalleryPage } from './pages/GalleryPage';

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <About />
    <Gallery />
    <Releases />
    <Events />
    <Footer />
  </>
);

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </div>
  );
}

export default App;
