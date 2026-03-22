import type { TrendingTalk } from "../types/index";

import ue1 from '../assets/ue_1.jpeg';
import ue2 from '../assets/ue_2.jpeg';
import ue3 from '../assets/ue_3.jpeg';
import ue4 from '../assets/ue_4.jpeg';

const trendingTalks: TrendingTalk[] = [
  {
    id: 4,
    title: "Entrepreneurs for the next wave of disruption",
    image: ue1
  },
  {
    id: 5,
    title: "Bizzchat&music - Live in Experience",
    image: ue2
  },
  {
    id: 6,
    title: "Decide or Think? What's better?",
    image: ue3
  },
  {
    id: 7,
    title: "Ashok Pathirage, Chairman Soft Logic Holdings PLC will talk his entrepreneurial journey on the date.",
    image: ue4
  }
];

const TrendingTalks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between pb-4 mb-10 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight uppercase">
              Trending Ideas
            </h3>
            <span className="bg-[#FF6000] text-white text-xs px-2 py-1 rounded-full">
              🔥 Hot
            </span>
          </div>
          <a
            href="#"
            className="text-[#FF6000] font-bold text-sm hover:underline flex items-center gap-1"
          >
            See all talks <span>→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {trendingTalks.map((talk) => (
            <div key={talk.id} className="cursor-pointer group hover-lift">
              <div className="relative overflow-hidden bg-gray-200 rounded-lg aspect-video">
                <img
                  src={talk.image}
                  alt={talk.title}
                  className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <h4 className="font-black text-base leading-snug group-hover:text-[#FF6000] transition-colors line-clamp-2">
                  {talk.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingTalks;