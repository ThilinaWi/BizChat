import { Link } from 'react-router-dom';
import member1Image from '../assets/member22.jpg';

const MembershipSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 mx-auto max-w-[1320px]">
      <div className="grid items-start grid-cols-1 gap-12 lg:grid-cols-[30%_1fr]">
        {/* Left: Text Content */}
        <div className="pr-8 space-y-6">
          <h2 className="text-3xl font-bold text-black lg:text-4xl whitespace-nowrap">
            Ideas are better <span className="text-[#FF6000]">live</span>
          </h2>
          
          <p className="max-w-md text-base leading-relaxed text-gray-800 text-justify md:text-left">
            BizChat Members receive virtual front row access to the 
            newest talks straight from the BizChat 2026 stage. Be one 
            of the first to witness the ideas that will take us into a 
            brighter future. We can't do this alone. It will take, 
            yes, <span className="font-semibold">all of us</span>.
          </p>

          {/* Image — mobile only (between text and button) */}
          <div className="relative overflow-hidden lg:hidden" style={{ aspectRatio: '21/11' }}>
            <img 
              src={member1Image} 
              alt="BizChat Member Exclusive" 
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="flex lg:block justify-center">
            <Link to="/events" className="inline-block px-8 py-3 font-medium text-white transition-colors bg-black rounded hover:bg-gray-800">
              Join today
            </Link>
          </div>
        </div>

        {/* Right: Promotional Banner — desktop only */}
        <div className="relative overflow-hidden hidden lg:block" style={{ aspectRatio: '21/11' }}>
          <img 
            src={member1Image} 
            alt="BizChat Member Exclusive" 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;