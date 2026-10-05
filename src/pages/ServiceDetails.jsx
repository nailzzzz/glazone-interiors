import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';

const createSlug = (text = '') => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const defaultBenefits = [
  'Premium quality materials',
  'Modern and elegant design',
  'Professional installation',
  'Durable and long-lasting performance',
  'Customized solutions',
  'Expert workmanship'
];

const defaultApplications = [
  'Residential projects',
  'Commercial buildings',
  'Modern interiors',
  'Hotels and hospitality',
  'Offices and showrooms',
  'Architectural projects'
];

const getServiceBenefits = (service) => {
  if (Array.isArray(service?.benefits) && service.benefits.length > 0) {
    return service.benefits;
  }

  const title = (service?.title || '').toLowerCase();

  if (title.includes('aluminium')) {
    return [
      'Premium aluminium profiles',
      'Strong and durable construction',
      'Smooth opening and closing',
      'Modern architectural appearance',
      'Low maintenance',
      'Customized sizes and finishes'
    ];
  }

  if (title.includes('smart mirror')) {
    return [
      'Elegant modern appearance',
      'Integrated LED lighting',
      'Smart and convenient features',
      'Premium mirror finish',
      'Customized sizes and designs',
      'Ideal for modern interiors'
    ];
  }

  return defaultBenefits;
};

const getServiceApplications = (service) => {
  if (
    Array.isArray(service?.applications) &&
    service.applications.length > 0
  ) {
    return service.applications;
  }

  const title = (service?.title || '').toLowerCase();

  if (title.includes('aluminium')) {
    return [
      'Residential homes',
      'Villas and apartments',
      'Commercial buildings',
      'Offices',
      'Hotels',
      'Showrooms'
    ];
  }

  if (title.includes('smart mirror')) {
    return [
      'Bathrooms',
      'Bedrooms',
      'Hotels',
      'Salons and spas',
      'Showrooms',
      'Luxury interiors'
    ];
  }

  return defaultApplications;
};

export default function ServiceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(
          collection(db, 'services')
        );

        const firebaseServices = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            ...data,
            title: data.title || 'Glass Service',
            category: data.category || 'Services',
            description:
              data.description ||
              'Premium quality solutions from Glazone Interiors & Exteriors.',
            shortDescription:
              data.shortDescription ||
              data.description ||
              '',
            image: data.image || FALLBACK_IMAGE,
            slug:
              data.slug ||
              createSlug(data.title || 'glass-service')
          };
        });

        setServices(firebaseServices);

        const foundService = firebaseServices.find(
          (item) => item.slug === slug
        );

        setService(foundService || null);

      } catch (error) {
        console.error(
          'Error loading service details:',
          error
        );

        setServices([]);
        setService(null);

      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [slug]);

  const handleImageError = (e) => {
    if (e.currentTarget.dataset.fallback === 'true') {
      return;
    }

    e.currentTarget.dataset.fallback = 'true';
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-sky/30 border-t-sky rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600 dark:text-slate-400">
            Loading service...
          </p>

        </div>
      </div>
    );
  }

  // =========================================================
  // SERVICE NOT FOUND
  // =========================================================

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-navy px-4">

        <div className="text-center">

          <div className="text-6xl mb-6">
            🔍
          </div>

          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Service Not Found
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            The service you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate('/services')}
            className="px-6 py-3 bg-sky text-navy font-bold rounded-xl hover:opacity-90 transition-all"
          >
            Back to Services
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // RELATED SERVICES
  // =========================================================

  const relatedServices = services
    .filter((item) => item.id !== service.id)
    .slice(0, 3);

  const benefits = getServiceBenefits(service);
  const applications = getServiceApplications(service);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy pt-32 pb-24 relative overflow-hidden">

      {/* Background Elements */}

      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-sky/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-royal/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Back Button */}

        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sky transition-colors mb-8"
        >
          <MdArrowBack />
          Back to Services
        </Link>


        {/* =====================================================
            HERO SECTION
        ===================================================== */}

        <div className="flex flex-col lg:flex-row gap-12 mb-20">

          {/* Image */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            className="lg:w-1/2 h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl relative"
          >

            <div className="absolute inset-0 bg-navy/20 z-10"></div>

            <img
              src={service.image || FALLBACK_IMAGE}
              alt={service.title}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />

            <div className="absolute top-6 left-6 z-20">

              <span className="px-4 py-1.5 bg-navy/80 backdrop-blur-md text-sky text-sm font-semibold rounded-full border border-sky/30">
                {service.category}
              </span>

            </div>

          </motion.div>


          {/* Content */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            className="lg:w-1/2 flex flex-col justify-center"
          >

            <div className="mb-4">

              <span className="text-sky font-semibold text-sm uppercase tracking-wider">
                Glazone Interiors & Exteriors
              </span>

            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
              {service.title}
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {service.description}
            </p>

            <div className="mt-4">

              <Link
                to="/quote"
                className="inline-block px-8 py-4 bg-gradient-to-r from-sky to-royal hover:from-royal hover:to-sky text-white font-bold rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all transform hover:scale-105"
              >
                Request a Quote
              </Link>

            </div>

          </motion.div>

        </div>


        {/* =====================================================
            DETAILS SECTION
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-12">

            {/* Overview */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg"
            >

              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4">
                Overview
              </h3>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-5">
                At Glazone Interiors & Exteriors, we provide carefully
                selected materials, professional installation and
                customized solutions to achieve both outstanding
                aesthetics and reliable performance.
              </p>

            </motion.div>


            {/* Key Benefits */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg"
            >

              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4">
                Key Benefits
              </h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {benefits.map((benefit, i) => (

                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                  >

                    <MdCheckCircle className="text-sky text-xl shrink-0 mt-0.5" />

                    <span>
                      {benefit}
                    </span>

                  </li>

                ))}

              </ul>

            </motion.div>

          </div>


          {/* RIGHT */}

          <div className="space-y-8">

            {/* Applications */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg"
            >

              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4">
                Applications
              </h3>

              <ul className="space-y-4">

                {applications.map((app, i) => (

                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                  >

                    <div className="w-2 h-2 rounded-full bg-royal mt-2 shrink-0"></div>

                    <span>
                      {app}
                    </span>

                  </li>

                ))}

              </ul>

            </motion.div>


            {/* Why Glazone */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              className="bg-gradient-to-br from-navy to-royal p-8 rounded-3xl border border-white/10 shadow-xl text-center"
            >

              <h3 className="text-xl font-bold text-white mb-4">
                Why Choose Glazone?
              </h3>

              <p className="text-slate-300 text-sm mb-6">
                With a commitment to quality, modern design and
                professional workmanship, Glazone delivers solutions
                tailored to every project.
              </p>

              <Link
                to="/about"
                className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors border border-white/20"
              >
                Learn About Us
              </Link>

            </motion.div>

          </div>

        </div>


        {/* =====================================================
            CTA SECTION
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="mb-20 rounded-3xl bg-gradient-to-r from-navy via-royal to-navy border border-white/10 p-10 md:p-14 text-center shadow-2xl"
        >

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Looking for a Premium Solution?
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Discuss your project requirements with Glazone Interiors &
            Exteriors and get a customized solution for your space.
          </p>

          <Link
            to="/quote"
            className="inline-flex items-center justify-center px-8 py-4 bg-sky hover:bg-white text-navy font-bold rounded-xl transition-all duration-300"
          >
            Get a Free Quote
          </Link>

        </motion.div>


        {/* =====================================================
            RELATED SERVICES
        ===================================================== */}

        {relatedServices.length > 0 && (

          <div>

            <h3 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white text-center">
              Related{' '}
              <span className="text-sky">
                Services
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {relatedServices.map((rs) => (

                <Link
                  to={`/services/${rs.slug}`}
                  key={rs.id}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300"
                >

                  <div className="h-48 overflow-hidden relative">

                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors z-10"></div>

                    <img
                      src={rs.image || FALLBACK_IMAGE}
                      alt={rs.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                  </div>

                  <div className="p-6">

                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky transition-colors mb-2">
                      {rs.title}
                    </h4>

                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                      {rs.shortDescription ||
                        rs.description}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}