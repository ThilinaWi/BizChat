import { useEffect, useState } from 'react';
import rohanImage from '../assets/Rohan.jpg';
import ranjithImage from '../assets/ranjith.jpeg';

const TedPage = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Video data with actual YouTube IDs
  const discoverTalks = [
    {
      id: 'talk-1',
      title: "Business Conversations has to add value - They Rebuild",
      speaker: "Dr. Rohan Pallewatta",
      image: rohanImage,
      videoId: "09MIuFrhHJ8"
    },
    {
      id: 'talk-2',
      title: "Innovation Begin with Understanding", 
      speaker: "Prof. Ranjith Disanayake",
      image: ranjithImage,
      videoId: "oxIXnt2sstY"
    }
  ];

  const handleVideoPlay = (videoId: string) => {
    setVideoError(null);
    setActiveVideo(videoId);
  };

  const handleVideoError = (videoId: string) => {
    setVideoError(`Failed to load video. Opening in YouTube...`);
    setTimeout(() => {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      setActiveVideo(null);
      setVideoError(null);
    }, 1500);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % discoverTalks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + discoverTalks.length) % discoverTalks.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % discoverTalks.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [discoverTalks.length]);

  return (
    <div className="font-sans bg-white">
      {/* --- HERO SECTION --- */}
      <section className="px-4 sm:px-6 lg:px-8 pt-0 mx-auto max-w-[1320px]">
        {/* --- DIVIDER --- */}
        <div className="w-full h-px mb-17 bg-gray-900/40" />  {/*spacing between Featured Talks and discover section*/}
        {/* --- DISCOVER IDEAS BEFORE THEY TREND SECTION --- */}
        <div className="mb-12">
          <div className="grid items-start grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left: Heading and Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold leading-snug text-black sm:text-3xl md:text-4xl lg:text-5xl">
                <span className="text-[#FF6000]">Discover</span> ideas before they trend.
              </h2>
              
              <p className="max-w-md text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                Experience groundbreaking BizChat talks and performances — before these game-changing 
                insights hit the mainstream.
              </p>
            </div>

            {/* Right: Large Video/Promotional Area */}
            <div className="relative mt-5">
              <div 
                className="cursor-pointer group"
                onClick={() => handleVideoPlay(discoverTalks[currentSlide].videoId)}
              >
                <div className="relative overflow-hidden bg-black aspect-video">
                  <img 
                    src={discoverTalks[currentSlide].image} 
                    alt={discoverTalks[currentSlide].title} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: currentSlide === 0 ? 'center 40%' : 'center center' }}
                  />
                  
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/20 group-hover:opacity-100">
                     <div className="flex items-center justify-center w-16 h-16 pl-1 bg-red-600 rounded-full">
                        <div className="w-0 h-0 border-t-12 border-t-transparent border-l-18 border-l-white border-b-12 border-b-transparent" />
                     </div>
                  </div>
                  
                  {/* Video Information Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-linear-to-t from-black/80 to-transparent">
                    <h3 className="mb-2 text-xl font-bold leading-tight">
                      {discoverTalks[currentSlide].title}
                    </h3>
                    <p className="text-sm text-gray-200">{discoverTalks[currentSlide].speaker}</p>
                  </div>
                  
                  {/* Navigation Arrows - Left and Right sides on hover */}
                  {/* Left Arrow - Previous */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-[#FF6000] text-gray-700 hover:text-white rounded-full transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                    aria-label="Previous video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Right Arrow - Next */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-[#FF6000] text-gray-700 hover:text-white rounded-full transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                    aria-label="Next video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Slide Indicators - Bottom Center */}
              <div className="flex justify-center gap-2 mt-4">
                {discoverTalks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-[#FF6000]' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
            </div>
            
          </div>
          <div className="w-full h-px mt-16 bg-gray-900/40" />
        </div>
      </section>

      {/* --- VIDEO MODAL (IFRAME) --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute text-5xl font-light text-white transition-colors top-8 right-8 hover:text-red-500 z-60"
          >
            ×
          </button>
          
          {videoError && (
            <div className="absolute text-center text-white transform -translate-x-1/2 -translate-y-1/2 top-1/4 left-1/2 z-60">
              <div className="px-6 py-3 rounded-lg bg-red-600/90">
                {videoError}
              </div>
            </div>
          )}
          
          <div className="relative w-full max-w-4xl bg-black shadow-2xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-presentation allow-forms"
              className="absolute inset-0"
              onError={() => handleVideoError(activeVideo)}
              onLoad={() => setVideoError(null)}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default TedPage;