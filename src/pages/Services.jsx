import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Fallback image if a service image URL is broken
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';

const categories = [
  'All',
  'Commercial',
  'Residential',
  'Architectural',
  'Interior',
  'Materials',
  'Installation'
];

// Create URL-friendly slug
const createSlug = (text = '') => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD SERVICES FROM FIRESTORE
  // =========================================================

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(
          collection(db, 'services')
        );

        const firebaseServices = snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,

            title: data.title || 'Glass Service',

            category: data.category || 'Services',

            description: data.description || '',

            shortDescription:
              data.shortDescription ||
              data.description ||
              '',

            image: data.image || '',

            // Use existing slug if available.
            // Otherwise create one from title.
            slug:
              data.slug ||
              createSlug(data.title || 'glass-service')
          };
        });

        console.log(
          'Public services loaded from Firebase:',
          firebaseServices
        );

        setServices(firebaseServices);

      } catch (error) {
        console.error(
          'Error loading public services:',
          error
        );

        setServices([]);

      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // =========================================================
  // FILTER SERVICES
  // =========================================================

  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter(
        (service) =>
          service.category === activeCategory
      );

  // =========================================================
  // IMAGE ERROR HANDLER
  // =========================================================

  const handleImageError = (e) => {
    // Prevent infinite error loop
    if (e.currentTarget.dataset.fallback === 'true') {
      return;
    }

    e.currentTarget.dataset.fallback = 'true';

    e.currentTarget.src = FALLBACK_IMAGE;
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy pt-32 pb-20 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-sky/30 border-t-sky rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600 dark:text-slate-400">
            Loading our services...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy pt-24 pb-20 relative overflow-hidden">

      {/* =====================================================
          BACKGROUND ELEMENTS
      ===================================================== */}

      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-sky/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-royal/5 rounded-full blur-[100px] pointer-events-none"></div>


      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="text-center max-w-3xl mx-auto mb-16"
        >

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white">

            Our{' '}

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-royal">
              Premium Services
            </span>

          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discover our comprehensive range of luxury glass and facade
            solutions, crafted with precision and engineered for excellence.
          </p>

        </motion.div>


        {/* ===================================================
            FILTER BUTTONS
        =================================================== */}

        <div className="flex flex-wrap justify-center gap-3 mb-12">

          {categories.map((category) => (

            <button
              key={category}
              type="button"
              onClick={() =>
                setActiveCategory(category)
              }
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                ? 'bg-sky text-navy shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                }`}
            >
              {category}
            </button>

          ))}

        </div>


        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {filteredServices.length === 0 && (

          <div className="text-center py-20">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              No services found
            </h3>

            <p className="text-slate-500 dark:text-slate-400">
              No services are available in this category.
            </p>

          </div>

        )}


        {/* ===================================================
            SERVICES GRID
        =================================================== */}

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >

          <AnimatePresence mode="popLayout">

            {filteredServices.map((service) => (

              <motion.div
                layout
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9
                }}
                transition={{
                  duration: 0.3
                }}
                key={service.id}
                className="group h-full"
              >

                <Link
                  to={`/services/${service.slug}`}
                  className="block h-full rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative h-60 overflow-hidden shrink-0">

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>


                    {/* Service Image */}

                    <img
                      src={
                        service.image ||
                        FALLBACK_IMAGE
                      }
                      alt={
                        service.title ||
                        'Glazone Service'
                      }
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={handleImageError}
                    />


                    {/* Category */}

                    <div className="absolute top-4 left-4 z-20">

                      <span className="px-3 py-1 bg-navy/80 backdrop-blur-md text-sky text-xs font-semibold rounded-full border border-sky/30">
                        {service.category}
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="p-6 flex flex-col flex-grow">

                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-sky transition-colors">

                      {service.title}

                    </h3>


                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">

                      {service.shortDescription ||
                        service.description ||
                        'Premium glass solutions from Glazone Interiors & Exteriors.'}

                    </p>


                    {/* View Details */}

                    <div className="flex items-center justify-between mt-auto">

                      <span className="text-sky font-semibold text-sm group-hover:translate-x-2 transition-transform inline-flex items-center">

                        View Details &rarr;

                      </span>

                    </div>

                  </div>

                </Link>

              </motion.div>

            ))}

          </AnimatePresence>

        </motion.div>

      </div>

    </div>
  );
}