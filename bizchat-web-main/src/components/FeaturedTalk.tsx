import type { Talk } from '../types/index';
import { useState, useEffect } from 'react';
import sumal from '../assets/sumalperera.jpeg'
import wegapitiya from '../assets/wegapitiya.jpeg'
import sarath from '../assets/sarath.jpeg'
import udjayawardana from '../assets/ud.jpeg'

const featuredTalks: Talk[] = [
  {
    id: 1,
    title: "Pick one or the other, but do your math",
    speaker: "Sumal Perera",
    image: sumal,
    category: "CONSTRUCTION",
    views: "245K",
    duration: "15 MIN",
    timeAgo: "2 months"
  },
  {
    id: 2,
    title: "Commitment to quality is key; the market follows",
    speaker: "Sarath De Costa",
    image: sarath,
    category: "INDUSTRIALIST",
    views: "180K",
    duration: "10 MIN",
    timeAgo: "3 months"
  },
  {
    id: 3,
    title: "Business cycles are no longer sinusoidal - its a tsunami!",
    speaker: "Hemachandra Wegapitiya",
    image: wegapitiya,
    category: "PETROLEUM",
    views: "320K",
    duration: "7 MIN",
    timeAgo: "1 month"
  },
  {
    id: 4,
    title: "Entrepreneurs risk failure if they fail to adapt to upcoming technological changes",
    speaker: "UD Jayawardena",
    image: udjayawardana,
    category: "POWER",
    views: "127K",
    duration: "10 MIN",
    timeAgo: "20 days"
  },
];

const FeaturedTalks = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = featuredTalks.length; // 4 slides total (1 card each)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [totalSlides]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-6 mx-auto bg-white max-w-[1320px]">
      {/* Divider Above Header */}
      {/* <div className="w-full h-px mb-6 bg-gray-900/40" /> */}
      
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4"> */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 leading-none md:gap-4">
          {/* <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl lg:text-3xl"> */}
          <h2 className="text-2xl font-bold leading-snug text-black sm:text-3xl md:text-4xl lg:text-3xl">
            Featured Talks
          </h2>
          <span className="bg-[#FF6000] text-white text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-semibold uppercase tracking-wider">
            Editor's Pick
          </span>
        </div>
      </div>

      {/* Divider Below Header */}
      <div className="h-px mx-0.5 mb-6 bg-gray-900/40" />

      {/* Talks Grid */}
      {/* Desktop View - Show all 4 cards */}
      <div className="hidden grid-cols-2 gap-y-10 md:grid lg:grid-cols-4">
        {featuredTalks.map((talk, index) => (
          <div key={talk.id} className={`group cursor-pointer ${
            index === 0
              ? 'pl-0 pr-4 md:pr-5 lg:border-r lg:border-gray-200'
              : index === featuredTalks.length - 1
              ? 'pl-4 md:pl-5 pr-0 lg:border-l lg:border-gray-200'
              : 'px-4 md:px-5 lg:border-x lg:border-gray-200'
          }`}>
            {/* Image Container */}
            <div className="relative mb-4 overflow-hidden bg-gray-100 aspect-video">
              <img
                src={talk.image}
                alt={talk.title}
                className="object-cover object-center w-full h-full"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              {/* Category */}
              <span className="text-[#FF6000] text-[11px] md:text-xs font-bold uppercase tracking-wider">
                {talk.category}
              </span>

              {/* Title */}
              <h3 className="font-bold text-[15px] md:text-base leading-snug text-gray-900 line-clamp-2">
                {talk.title}
              </h3>

              {/* Speaker */}
              <p className="text-gray-500 text-xs md:text-[13px] pt-0.5">
                {talk.speaker}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - Carousel */}
      <div className="md:hidden">
        {/* Carousel Container */}
        <div className="relative group">
          {/* Slides */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredTalks.map((talk) => (
                <div key={talk.id} className="shrink-0 w-full">
                  {/* Image Container - Larger on mobile */}
                  <div className="relative mb-6 overflow-hidden bg-gray-100">
                    <img
                      src={talk.image}
                      alt={talk.title}
                      className="object-cover object-center w-full h-55 sm:h-75 md:h-95"
                      loading="lazy"
                    />
                    
                    {/* Navigation Arrows - Positioned on Image */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 z-10 p-2.5 text-gray-700 transition-all duration-200 -translate-y-1/2 bg-white/90 rounded-full shadow-lg top-1/2 hover:bg-white hover:shadow-xl opacity-0 group-hover:opacity-100"
                      aria-label="Previous slide"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 z-10 p-2.5 text-gray-700 transition-all duration-200 -translate-y-1/2 bg-white/90 rounded-full shadow-lg top-1/2 hover:bg-white hover:shadow-xl opacity-0 group-hover:opacity-100"
                      aria-label="Next slide"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Content Below Image */}
                  <div className="space-y-3 min-h-36 sm:min-h-0">
                    {/* Category */}
                    <span className="text-[#FF6000] text-xs md:text-sm font-bold uppercase tracking-wider">
                      {talk.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                      {talk.title}
                    </h3>

                    {/* Speaker */}
                    <p className="text-sm text-gray-600 md:text-base">
                      {talk.speaker}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex w-full gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`flex-1 h-1.5 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-[#FF6000]'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTalks;