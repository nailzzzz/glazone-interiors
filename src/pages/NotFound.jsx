import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdHome } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-sky/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-royal/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 p-8"
      >
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky to-royal mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky to-royal hover:from-royal hover:to-sky text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
        >
          <MdHome className="text-xl" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
