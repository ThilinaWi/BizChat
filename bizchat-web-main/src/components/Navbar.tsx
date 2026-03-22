import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getUser, logout } from '../utils/api';

const Navbar = ({ solid = false }: { solid?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolledState, setIsScrolledState] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isScrolled = solid || isScrolledState;
  const navigate = useNavigate();
  // useLocation() causes re-renders on route change so getUser() is always fresh.
  useLocation();
  const user = getUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolledState(true);
      } else {
        setIsScrolledState(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white shadow-lg py-2 lg:py-3"
          : "bg-transparent py-3 lg:py-4"
      }`}
    >
      <div className="flex items-center justify-between mx-auto max-w-[1320px] px-2 sm:px-4 lg:px-1">
        {/* Logo - BIZCHAT */}
        <h1
          className="text-3xl font-black tracking-tighter cursor-pointer lg:text-4xl"
          onClick={() => navigate('/')}
        >
          <span
            className={`transition-colors duration-300 ${
              isScrolled ? "text-[#FF6000]" : "text-[#FF6000]"
            }`}
          >
            BIZ
          </span>
          <span
            className={`transition-colors duration-300 ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            CHAT
          </span>
        </h1>

        {/* Desktop Menu - WATCH, DISCOVER, MEMBERSHIP */}
        <div className="items-center hidden gap-10 lg:flex">
          {/* WATCH with Dropdown */}
          <div 
            className="relative group"
          >
            <a
              href="#"
              className={`font-medium text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-[#FF6000]"
                  : "text-white/90 hover:text-white"
              }`}
            >
              WATCH
            </a>
            
            {/* Dropdown */}
            <div className="absolute left-0 z-50 invisible pt-2 transition-all duration-200 opacity-0 top-full group-hover:opacity-100 group-hover:visible">
              <div className="py-4 bg-white border border-gray-100 rounded-lg shadow-xl w-80">
                <a
                  href="https://www.youtube.com/@BizChatandMusic/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-6 py-3 transition-colors hover:bg-gray-50 group/item"
                >
                  <svg className="w-6 h-6 mt-0.5 shrink-0 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900 group-hover/item:text-[#FF6000] transition-colors">
                      Biz Talk
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Complete business conversations and insights
                    </div>
                  </div>
                </a>
                
                <a
                  href="https://www.youtube.com/@BizChatandMusic/shorts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-6 py-3 transition-colors hover:bg-gray-50 group/item"
                >
                  <svg className="w-6 h-6 mt-0.5 shrink-0 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900 group-hover/item:text-[#FF6000] transition-colors">
                      Clips
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Short-form business content and highlights
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* EVENTS */}
          <Link
            to="/events"
            className={`font-medium text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
              isScrolled
                ? "text-gray-700 hover:text-[#FF6000]"
                : "text-white/90 hover:text-white"
            }`}
          >
            EVENTS
          </Link>

          {/* Logged in: MEMBERSHIP then avatar | Logged out: SIGN IN then MEMBERSHIP */}
          {user ? (
            <>
              <Link
                to="/events"
                className="bg-[#FF6000] text-white px-6 py-3 rounded-md hover:bg-[#FF6000]/90 font-medium text-sm uppercase tracking-[0.15em] transition-all duration-300"
              >
                MEMBERSHIP
              </Link>
              <div className="relative group">
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6000] text-white font-bold text-sm uppercase ring-2 ring-white/30 hover:ring-[#FF6000]/60 transition-all duration-300">
                  {(user.firstName?.[0] || 'U').toUpperCase()}
                </button>
                <div className="absolute right-0 z-50 invisible pt-2 transition-all duration-200 opacity-0 top-full group-hover:opacity-100 group-hover:visible">
                  <div className="py-2 bg-white border border-gray-100 rounded-lg shadow-xl w-48">
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100 truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#FF6000]"
                    >
                      My Bookings
                    </Link>
                    {(user.role === 'manager' || user.role === 'admin') ? (
                      <Link
                        to="/manager"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#FF6000]"
                      >
                        Manager Dashboard
                      </Link>
                    ) : null}
                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#FF6000]"
                      >
                        Admin Panel
                      </Link>
                    ) : null}
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className={`font-medium text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-[#FF6000]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                SIGN IN
              </Link>
              <Link
                to="/events"
                className="bg-[#FF6000] text-white px-6 py-3 rounded-md hover:bg-[#FF6000]/90 font-medium text-sm uppercase tracking-[0.15em] transition-all duration-300"
              >
                MEMBERSHIP
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button + Avatar */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 transition-colors duration-300 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                  className="origin-center"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Account circle */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => { setAccountOpen(!accountOpen); setIsOpen(false); }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6000] text-white font-bold text-sm shrink-0"
              >
                {(user.firstName?.[0] || 'U').toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => { navigate('/signin'); setIsOpen(false); }}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  isScrolled ? "border-gray-400 text-gray-500 hover:border-[#FF6000] hover:text-[#FF6000]" : "border-white/50 text-white hover:border-[#FF6000] hover:text-[#FF6000]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            {/* Account dropdown */}
            {accountOpen && user && (
              <div className="absolute right-0 top-full mt-3 w-72 z-50 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl px-4 py-8 flex flex-col items-center space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6000] text-white font-bold text-sm shrink-0">
                    {(user.firstName?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm uppercase tracking-[0.2em] text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-gray-400 capitalize tracking-widest">{user.role || 'user'}</span>
                  </div>
                </div>
                <Link
                  to="/my-bookings"
                  onClick={() => setAccountOpen(false)}
                  className="text-sm py-1 text-gray-300 hover:text-[#FF6000] transition-colors"
                >
                  My Bookings
                </Link>
                {(user.role === 'manager' || user.role === 'admin') && (
                  <Link
                    to="/manager"
                    onClick={() => setAccountOpen(false)}
                    className="text-sm py-1 text-gray-300 hover:text-[#FF6000] transition-colors"
                  >
                    Manager Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setAccountOpen(false)}
                    className="text-sm py-1 text-gray-300 hover:text-[#FF6000] transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); setAccountOpen(false); }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors py-1"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 w-full px-4 py-8 mt-2 lg:hidden top-full transition-all duration-300 ${
            isScrolled
              ? "bg-white shadow-lg border-t border-gray-100"
              : "bg-black/90 backdrop-blur-md border-y border-white/10"
          }`}
        >
          <div className="flex flex-col items-center space-y-6">

            {/* WATCH accordion */}
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => setWatchOpen(!watchOpen)}
                className={`font-bold text-sm uppercase tracking-[0.2em] py-2 transition-colors ${
                  isScrolled ? "text-gray-700 hover:text-[#FF6000]" : "text-white hover:text-[#FF6000]"
                }`}
              >
                WATCH
              </button>
              {watchOpen && (
                <div className="flex flex-col items-center mt-2 space-y-3">
                  <a
                    href="https://www.youtube.com/@BizChatandMusic/videos"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] py-1 transition-colors ${
                      isScrolled ? "text-gray-600 hover:text-[#FF6000]" : "text-gray-300 hover:text-[#FF6000]"
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Biz Talk
                  </a>
                  <a
                    href="https://www.youtube.com/@BizChatandMusic/shorts"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] py-1 transition-colors ${
                      isScrolled ? "text-gray-600 hover:text-[#FF6000]" : "text-gray-300 hover:text-[#FF6000]"
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Clips
                  </a>
                </div>
              )}
            </div>

            {/* EVENTS */}
            <Link
              to="/events"
              onClick={() => setIsOpen(false)}
              className={`font-bold text-sm uppercase tracking-[0.2em] py-2 transition-colors ${
                isScrolled ? "text-gray-700 hover:text-[#FF6000]" : "text-white hover:text-[#FF6000]"
              }`}
            >
              EVENTS
            </Link>

            {/* MEMBERSHIP */}
            <Link
              to="/events"
              className="w-full bg-[#FF6000] text-white px-6 py-3 rounded-md hover:bg-[#FF6000]/90 text-center font-bold text-sm uppercase tracking-[0.2em] transition-colors"
            >
              MEMBERSHIP
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;