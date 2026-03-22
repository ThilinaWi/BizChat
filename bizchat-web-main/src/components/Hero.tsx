const heroImage = '/biz3.jpg';

const Hero = () => {
  return (
    <header className="relative overflow-hidden w-full sm:h-[75vh] md:h-[80vh] lg:h-[85vh] sm:flex sm:items-center sm:justify-center">
      {/* Image - natural height on mobile, fills container on sm+ */}
      <div className="relative w-full sm:absolute sm:inset-0">
        <img
          src={heroImage}
          alt="Hero Background"
          fetchPriority="high"
          decoding="async"
          className="w-full h-auto sm:h-full sm:object-cover sm:object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Text overlay - hidden on mobile, visible on sm+ */}
        <div className="absolute inset-0 hidden sm:flex items-start justify-center pt-40 md:pt-40 lg:pt-36 px-6 lg:px-8">
          <h1 className="font-black leading-tight tracking-tight text-center">
            <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white">
              THINKING THAT
            </span>
            <span className="block text-[#FF6000] mt-2 md:mt-4 lg:mt-5 text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              INSPIRES
            </span>
          </h1>
        </div>
      </div>

      {/* Text below image - visible on mobile only */}
      <div className="block sm:hidden py-3 px-4 bg-gray-900 text-left">
        <h1 className="font-black leading-tight tracking-tight text-xl">
          <span className="text-white">THINKING THAT </span>
          <span className="text-[#FF6000]">INSPIRES</span>
        </h1>
      </div>

      {/* Abstract shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-[#FF6000]/10 rounded-full blur-3xl z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 z-10 w-24 h-24 rounded-full pointer-events-none sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-amber-200/20 blur-3xl" />
    </header>
  );
};

export default Hero;
