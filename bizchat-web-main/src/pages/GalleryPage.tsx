import { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import G1 from "../assets/Galary/G (1).jpeg"
import G2 from "../assets/Galary/G (2).jpeg"
import G3 from "../assets/Galary/G (3).jpeg"
import G4 from "../assets/Galary/G (4).jpeg"
import G5 from "../assets/Galary/G (5).jpeg"
import G6 from "../assets/Galary/G (6).jpeg"
import G7 from "../assets/Galary/G (7).jpeg"
import G8 from "../assets/Galary/G (8).jpeg"
import G9 from "../assets/Galary/G (9).jpeg"
import G10 from "../assets/Galary/G (10).jpeg"
import G11 from "../assets/Galary/G (11).jpeg"
import G12 from "../assets/Galary/G (12).jpeg"
import G13 from "../assets/Galary/G (13).jpeg"
import G14 from "../assets/Galary/G (14).jpeg"
import G15 from "../assets/Galary/G (15).jpeg"
import G16 from "../assets/Galary/G (16).jpeg"
import G17 from "../assets/Galary/G (17).jpeg"
import G18 from "../assets/Galary/G (18).jpeg"
import G19 from "../assets/Galary/G (19).jpeg"
import G20 from "../assets/Galary/G (20).jpeg"
import G21 from "../assets/Galary/G (21).jpeg"
import G22 from "../assets/Galary/G (22).jpeg"
import G23 from "../assets/Galary/G (23).jpeg"
import G24 from "../assets/Galary/G (24).jpeg"
import G25 from "../assets/Galary/G (25).jpeg"
import G26 from "../assets/Galary/G (26).jpeg"
import G27 from "../assets/Galary/G (27).jpeg"
import G28 from "../assets/Galary/G (28).jpeg"
import G29 from "../assets/Galary/G (29).jpeg"
import G30 from "../assets/Galary/G (30).jpeg"
import G31 from "../assets/Galary/G (31).jpeg"
import G32 from "../assets/Galary/G (32).jpeg"
import G33 from "../assets/Galary/G (33).jpeg"
import G34 from "../assets/Galary/G (34).jpeg"
import G35 from "../assets/Galary/G (35).jpeg"
import G36 from "../assets/Galary/G (36).jpeg"
import G37 from "../assets/Galary/G (37).jpeg"
import G38 from "../assets/Galary/G (38).jpeg"
import G39 from "../assets/Galary/G (39).jpeg"
import G40 from "../assets/Galary/G (40).jpeg"
import o1 from "../assets/Galary/o1.jpg"
import o2 from "../assets/Galary/o2.jpg"
import o3 from "../assets/Galary/o3.jpg"
import o4 from "../assets/Galary/o4.jpg"

const photos = [o1,o2,o3,o4,G1,G2,G3,G4,G5,G6,G7,G8,G9,G10,G11,G12,G13,G14,G15,G16,G17,G18,G19,G20,G21,G22,G23,G24,G25,G26,G27,G28,G29,G30,G31,G32,G33,G34,G35,G36,G37,G38,G39,G40];

const GalleryPage = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openLightbox = (idx: number) => setSelectedIndex(idx);
  const closeLightbox = () => setSelectedIndex(null);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, goNext, goPrev]);

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative bg-black pt-24 pb-8 md:pt-32 md:pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            <span className="text-[#FF6000]">Gallery</span>
          </h1>
          <p className="mt-4 text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
            Moments that inspire. Events that transform. Explore our collection of memorable experiences.
          </p>
        </div>
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6000]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Pinterest Masonry Grid */}
      <div className="px-4 pt-6 pb-10 sm:px-6">
        <style>{`
          .pinterest-grid { column-count: 2; column-gap: 12px; }
          @media (min-width: 640px)  { .pinterest-grid { column-count: 3; column-gap: 16px; } }
          @media (min-width: 1024px) { .pinterest-grid { column-count: 4; column-gap: 16px; } }
          .pinterest-item { break-inside: avoid; margin-bottom: 12px; }
        `}</style>
        <div className="pinterest-grid">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="overflow-hidden transition-shadow duration-300 cursor-pointer pinterest-item group hover:shadow-md"
            >
              <img
                src={photo}
                alt={`Gallery photo ${idx + 1}`}
                className="block object-cover w-full h-auto transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 text-white bg-white/10 hover:bg-white/30 rounded-full transition-all duration-200"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 z-50 p-3 text-white bg-white/10 hover:bg-[#FF6000] rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Full screen image */}
          <img
            src={photos[selectedIndex]}
            alt={`Gallery photo ${selectedIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 z-50 p-3 text-white bg-white/10 hover:bg-[#FF6000] rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
