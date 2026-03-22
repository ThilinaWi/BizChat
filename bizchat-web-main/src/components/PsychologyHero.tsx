import mindsetImage from '../assets/mindset2.jpg';

const PsychologyHero = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-1 pb-4 mx-auto font-sans bg-white max-w-[1320px] md:pt-2 lg:pt-2 lg:pb-6">
      {/* Header Row */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl shrink-0">
          Mindset
        </h1>

        {/* Tagline — desktop only (right of title) */}
        <div className="hidden sm:block flex-1 sm:max-w-xl sm:text-right">
          <p className="text-base leading-relaxed tracking-wide text-black sm:text-lg md:text-xl">
            Grab a front-row seat to unravelling the mysteries of the human mind and embark on a journey of self-discovery.
          </p>
        </div>
      </div>

      {/* Featured Image Container */}
      <div className="relative w-full overflow-hidden bg-white">
        <img 
          src={mindsetImage} 
          alt="Mindset illustration" 
          className="object-contain w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-[480px] xl:max-h-[540px]"
        />
        
        {/* BIZCHAT Logo Overlay */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 hidden md:block">
          <span className="text-base font-black tracking-tight text-[#FF6000] md:text-lg lg:text-xl">
            BIZ<span className="font-bold text-black">CHAT</span>
          </span>
        </div>
      </div>

      {/* Tagline — mobile only (below image) */}
      <div className="sm:hidden mt-4">
        <p className="text-base leading-relaxed tracking-wide text-[#FF6000]">
          Grab a front-row seat to unravelling the mysteries of the human mind and embark on a journey of self-discovery.
        </p>
      </div>
    </section>
  );
};

export default PsychologyHero;
