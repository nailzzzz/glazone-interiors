import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { MdOutlineMail } from 'react-icons/md';
import { FiPhoneCall } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Projects', path: '/projects' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Bar - hidden on mobile */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex justify-between items-center px-8 py-2 bg-navy text-white text-sm border-b border-white/10 relative z-50"
      >
        <div className="flex items-center gap-6">
          <a href="mailto:noushadma2008@gmail.com" className="flex items-center gap-2 hover:text-sky transition-colors">
            <MdOutlineMail className="text-sky" /> noushadma2008@gmail.com
          </a>
          <a href="tel:8129842105" className="flex items-center gap-2 hover:text-sky transition-colors">
            <FiPhoneCall className="text-sky" /> 8129842105
          </a>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky animate-pulse"></span>
            Premium Glass & Facade Solutions
          </span>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'glass-dark py-3' : 'bg-transparent py-5'
      } ${location.pathname !== '/' && !isScrolled ? 'glass-dark py-3' : ''} ${!isScrolled ? 'lg:top-[37px] top-0' : 'top-0'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-50">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight"
            >
              <span className="text-white">GLA</span>
              <span className="text-sky">ZONE</span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className="relative px-4 py-2 text-sm font-medium tracking-wide group"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${
                    location.pathname === link.path ? 'text-sky' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {link.name}
                  </span>
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-white/5 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="ml-4"
            >
              <Link 
                to="/quote" 
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-navy bg-sky rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative">Get a Quote</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white text-3xl z-50 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <HiX /> : <HiMenuAlt3 />}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-30 bg-navy/95 backdrop-blur-xl pt-32 px-6 flex flex-col lg:hidden"
          >
            <div className="flex flex-col gap-4 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 text-2xl font-medium rounded-2xl transition-all ${
                      location.pathname === link.path 
                        ? 'bg-sky/10 text-sky' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6"
              >
                <Link 
                  to="/quote" 
                  className="block w-full py-4 rounded-2xl bg-sky text-navy text-lg font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                >
                  Request a Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
