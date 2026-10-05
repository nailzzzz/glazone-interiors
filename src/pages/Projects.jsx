import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdZoomIn } from 'react-icons/md';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const fallbackProjects = [
  {
    id: '1',
    title: 'Skyline Corporate Headquarters',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    description: 'Complete structural glass facade installation for a 40-story office building.',
  },
  {
    id: '2',
    title: 'Modern Minimalist Villa',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    description: 'Custom frameless glass railings and floor-to-ceiling double glazed windows.',
  },
  {
    id: '3',
    title: 'Tech Hub Innovation Center',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    description: 'Smart switchable glass partitions for meeting rooms and collaborative spaces.',
  },
  {
    id: '4',
    title: 'Apex Industrial Complex',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    description: 'Heavy-duty toughened glass installations for factory observation decks.',
  },
  {
    id: '5',
    title: 'Ocean View Penthouse',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop',
    description: 'Bespoke frameless shower enclosures and smart mirrors in master suites.',
  },
  {
    id: '6',
    title: 'Metro Shopping Mall',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1200&auto=format&fit=crop',
    description: 'Massive skylights and spider glazing for the main atrium.',
  }
];

export default function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (projectsList.length > 0) {
          setProjectsData(projectsList);
        } else {
          setProjectsData(fallbackProjects);
        }
      } catch (err) {
        console.error("Error fetching projects from Firestore:", err);
        setProjectsData(fallbackProjects);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Compute unique categories
  const dynamicCategories = ['All', ...new Set(projectsData.map(p => p.category).filter(Boolean))];

  const filteredProjects = activeCategory === 'All' 
    ? projectsData 
    : projectsData.filter(project => project.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Our <span className="text-sky">Projects</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A showcase of our finest glass installations and architectural marvels across various sectors.
          </p>
          {error && (
            <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 py-2 px-4 rounded-full inline-block border border-yellow-200 dark:border-yellow-700/50">
              Note: Showing demonstration projects. Please configure Firebase to view live database entries.
            </p>
          )}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {dynamicCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-sky text-navy'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer bg-slate-200 dark:bg-slate-800"
                onClick={() => setLightboxImage(project)}
              >
                <img 
                  src={project.image || 'https://via.placeholder.com/800x600?text=Project'} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-sky text-xs font-bold uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <MdZoomIn className="text-2xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 backdrop-blur-xl p-4 md:p-12"
          >
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-sky text-white hover:text-navy rounded-full flex items-center justify-center transition-colors"
            >
              <MdClose className="text-2xl" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-6xl max-h-full flex flex-col items-center"
            >
              <img 
                src={lightboxImage.image || 'https://via.placeholder.com/800x600?text=Project'} 
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="mt-6 text-center">
                <span className="text-sky font-semibold uppercase tracking-wider text-sm mb-2 block">
                  {lightboxImage.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-2">{lightboxImage.title}</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">{lightboxImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
