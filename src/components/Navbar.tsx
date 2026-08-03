import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  Lock,
  FileText,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenProspectus: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenProspectus,
  isAdminLoggedIn = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Sticky solid effect
      setIsScrolled(scrollTop > 40);

      // Scroll progress percentage
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, (scrollTop / docHeight) * 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'courses', label: 'Courses' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notices', label: 'Notices' },
    { id: 'results', label: 'Results' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Scroll Progress Bar ── */}
      <div
        id="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 border-b-4 border-[#B8860B] ${
          isScrolled
            ? 'h-14 bg-[#002349]/95 shadow-2xl backdrop-blur-md'
            : 'h-20 bg-[#002349]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

          {/* ── Brand Logo ── */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <GraduationCap className="w-8 h-8 text-[#B8860B] group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-serif text-lg sm:text-xl font-bold leading-none tracking-tight">
                ROYAL ACADEMY
              </h1>
              <span className="text-[#B8860B] text-[10px] tracking-[0.18em] font-bold uppercase mt-0.5">
                Faisalabad's Premier Institute
              </span>
            </div>
          </div>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 nav-link-underline group ${
                    isActive
                      ? 'text-[#B8860B] active'
                      : 'text-white/85 hover:text-[#B8860B]'
                  }`}
                >
                  {item.label}
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B8860B]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Desktop Right Actions ── */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-md text-white/80 hover:text-[#B8860B] hover:bg-white/8 transition-all"
              title="Global Search"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={onOpenProspectus}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider bg-white/8 text-white border border-white/20 hover:bg-white/16 hover:border-white/40 transition-all btn-ripple"
              title="Download / View Prospectus"
            >
              <FileText className="w-3.5 h-3.5 text-[#B8860B]" />
              Prospectus
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all btn-ripple ${
                activeTab === 'admin'
                  ? 'bg-[#B8860B] text-white shadow-md'
                  : 'bg-[#B8860B]/12 text-[#B8860B] border border-[#B8860B]/40 hover:bg-[#B8860B]/24'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {isAdminLoggedIn ? 'Admin Portal' : 'Admin'}
            </button>

            <button
              onClick={() => handleNavClick('admissions')}
              className="ml-1 bg-[#B8860B] text-white px-5 py-2 rounded-sm font-bold text-xs hover:bg-[#966D09] active:scale-95 transition-all shadow-lg uppercase tracking-wider btn-ripple"
            >
              Apply Online
            </button>
          </div>

          {/* ── Mobile Controls ── */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full text-gray-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-6 h-6">
                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Drawer ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-[#001A38] border-t border-white/8 border-b-2 border-b-[#B8860B] px-4 pt-3 pb-5 shadow-2xl">
            <div className="grid grid-cols-3 gap-2 pt-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2 px-2 rounded-md text-xs uppercase tracking-wider text-center font-bold transition-all active:scale-95 ${
                    activeTab === item.id
                      ? 'bg-[#B8860B] text-white shadow-md'
                      : 'bg-white/8 text-white hover:bg-white/16'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => { onOpenProspectus(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-sm bg-white/8 text-white border border-white/20 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/16 transition-all"
              >
                <FileText className="w-4 h-4 text-[#B8860B]" />
                View / Download Prospectus
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 rounded-sm bg-[#B8860B]/16 text-[#B8860B] border border-[#B8860B]/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#B8860B]/28 transition-all"
              >
                <Lock className="w-4 h-4" />
                {isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
              </button>

              <button
                onClick={() => handleNavClick('admissions')}
                className="w-full py-3 rounded-sm bg-[#B8860B] text-white font-bold text-xs uppercase tracking-wider text-center shadow-lg hover:bg-[#966D09] active:scale-95 transition-all btn-ripple"
              >
                Apply Online Now
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
