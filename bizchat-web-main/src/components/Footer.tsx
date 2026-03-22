import peraharavImage from '../assets/peraharav.jpg';

const Footer = () => {
  return (
    <footer>
      {/* Upper Footer Image Banner */}
      <div className="w-full overflow-hidden bg-gray-100">
        <img
          src={peraharavImage}
          alt="Peraharav"
          className="w-full h-auto object-cover object-center max-h-75 md:max-h-100 lg:max-h-125"
        />
      </div>

      {/* Footer Content */}
      <div className="bg-black text-white pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-[1320px] mx-auto">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-3 md:mb-4">
              <span className="text-[#FF6000]">BIZ</span>
              <span className="text-white">CHAT</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              BizChat is a non-profit devoted to spreading ideas, usually in the form of short, 
              powerful talks on business strategy, leadership, and innovation.
            </p>
            <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
              <a
                href="https://www.youtube.com/@BizChatandMusic/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#FF0000] transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <div className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#FF0000] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Programs */}
          <div className="md:ml-12 lg:ml-16">
            <h5 className="text-[#FF6000] font-black text-xs uppercase mb-4 md:mb-6 tracking-widest">Programs</h5>
            <ul className="space-y-2 md:space-y-4 text-sm text-gray-400">
              {['BizChatx', 'BizChat Fellows', 'BizChat Ed', 'BizChat Global'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="md:ml-12 lg:ml-16">
            <h5 className="text-[#FF6000] font-black text-xs uppercase mb-4 md:mb-6 tracking-widest">Community</h5>
            <ul className="space-y-2 md:space-y-4 text-sm text-gray-400">
              {['Speakers', 'Translators', 'Partners', 'Volunteers'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:ml-12 lg:ml-16">
            <h5 className="text-[#FF6000] font-black text-xs uppercase mb-4 md:mb-6 tracking-widest">Support</h5>
            <ul className="space-y-2 md:space-y-4 text-sm text-gray-400">
              {['Help Center', 'Contact Us', 'FAQ', 'Accessibility'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © 2026 BizChat. All rights reserved. Ideas worth spreading.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer