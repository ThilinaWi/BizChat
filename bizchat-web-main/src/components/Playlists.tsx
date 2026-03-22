import type { Playlist } from "../types/index";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import photos from Galary folder
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


const playlists: Playlist[] = [
  { id: 1, image: o1 },
  { id: 2, image: o2 },
  { id: 3, image: o3 },
  { id: 4, image: o4 },
  { id: 5, image: G1 },
  { id: 6, image: G2 },
  { id: 7, image: G3 },
  { id: 8, image: G4 },
  { id: 9, image: G5 },
  { id: 10, image: G6 },
  { id: 11, image: G7 },
  { id: 12, image: G8 },
  { id: 13, image: G9 },
  { id: 14, image: G10 },
  { id: 15, image: G11 },
  { id: 16, image: G12 },
  { id: 17, image: G13 },
  { id: 18, image: G14 },
  { id: 19, image: G15 },
  { id: 20, image: G16 },
  { id: 21, image: G17 },
  { id: 22, image: G18 },
  { id: 23, image: G19 },
  { id: 24, image: G20 },
  { id: 25, image: G21 },
  { id: 26, image: G22 },
  { id: 27, image: G23 },
  { id: 28, image: G24 },
  { id: 29, image: G25 },
  { id: 30, image: G26 },
  { id: 31, image: G27 },
  { id: 32, image: G28 },
  { id: 33, image: G29 },
  { id: 34, image: G30 },
  { id: 35, image: G31 },
  { id: 36, image: G32 },
  { id: 37, image: G33 },
  { id: 38, image: G34 },
  { id: 39, image: G35 },
  { id: 40, image: G36 },
  { id: 41, image: G37 },
  { id: 42, image: G38 },
  { id: 43, image: G39 },
  { id: 44, image: G40 },
];

const Playlists = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const navigate = useNavigate();

  // Responsive items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 4 : 2);
      setCurrentIndex(0); // Reset to first page on resize
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= playlists.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 ? Math.max(0, playlists.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  const visibleItems = playlists.slice(currentIndex, currentIndex + itemsPerPage);
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-20 mx-auto max-w-[1320px]">
      {/* Divider line above Gallery */}
      <div className="w-full h-px mb-10 bg-gray-900/40" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3
          className="text-3xl font-bold text-black sm:text-4xl cursor-pointer hover:text-[#FF6000] transition-colors"
          onClick={() => navigate('/gallery')}
        >
          Gallery
        </h3>
        <button
          onClick={() => navigate('/gallery')}
          className="flex items-center gap-2 text-sm font-semibold text-[#FF6000] hover:underline tracking-wide"
        >
          See all photos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="relative group">
        {/* Navigation Arrows - always visible */}
        {playlists.length > itemsPerPage && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 p-3 bg-white hover:bg-[#FF6000] text-gray-700 hover:text-white rounded-full transition-all duration-300 shadow-md z-10 border border-gray-200 opacity-0 group-hover:opacity-100"
              aria-label="Previous gallery items"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 p-3 bg-white hover:bg-[#FF6000] text-gray-700 hover:text-white rounded-full transition-all duration-300 shadow-md z-10 border border-gray-200 opacity-0 group-hover:opacity-100"
              aria-label="Next gallery items"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visibleItems.map((playlist) => (
            <div
              key={playlist.id}
              className="cursor-pointer group overflow-hidden"
              onClick={() => navigate('/gallery')}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={playlist.image}
                  alt={`Gallery image ${playlist.id}`}
                  className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Page Indicators */}
        {playlists.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(playlists.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerPage) === index
                    ? 'bg-[#FF6000] w-6'
                    : 'bg-gray-300 hover:bg-gray-400 w-2'
                }`}
                aria-label={`Go to gallery page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Playlists;