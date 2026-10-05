import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdZoomIn } from 'react-icons/md';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Mock Gallery Images
const fallbackImages = [
  { id: '1', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', category: 'Interior', span: 'col-span-1 row-span-1' },
  { id: '2', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop', category: 'Facade', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: '3', src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop', category: 'Shower', span: 'col-span-1 row-span-1' },
  { id: '4', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop', category: 'Railing', span: 'col-span-1 row-span-1' },
  { id: '5', src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', category: 'Decorative', span: 'col-span-1 row-span-2' },
  { id: '6', src: 'https://images.unsplash.com/photo-1541888046427-02421714fa41?q=80&w=800&auto=format&fit=crop', category: 'Glass', span: 'col-span-1 row-span-1' },
  { id: '7', src: 'https://images.unsplash.com/photo-1428366890462-dd4baecf492b?q=80&w=800&auto=format&fit=crop', category: 'Facade', span: 'col-span-1 md:col-span-2 row-span-1' },
  { id: '8', src: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop', category: 'Partition', span: 'col-span-1 row-span-1' },
];

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'gallery'));
        const imagesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (imagesList.length > 0) {
          setGalleryImages(imagesList);
        } else {
          setGalleryImages(fallbackImages);
        }
      } catch (err) {
        console.error("Error fetching gallery from Firestore:", err);
        setGalleryImages(fallbackImages);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const dynamicFilters = ['All', ...new Set(galleryImages.map(img => img.category).filter(Boolean))];

  const filteredImages = activeFilter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

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
            Photo <span className="text-sky">Gallery</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Browse through our extensive collection of completed works and architectural glass installations.
          </p>
          {error && (
            <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 py-2 px-4 rounded-full inline-block border border-yellow-200 dark:border-yellow-700/50">
              Note: Showing demonstration gallery. Please configure Firebase to view live database entries.
            </p>
          )}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {dynamicFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-sky text-navy'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                key={img.id}
                className={`group relative rounded-xl overflow-hidden cursor-pointer bg-slate-200 dark:bg-slate-800 ${
                  activeFilter === 'All' ? img.span : 'col-span-1 row-span-1 md:row-span-2'
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img.src || 'https://via.placeholder.com/600x400?text=Gallery+Image'} 
                  alt={img.category} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
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
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-sky text-white hover:text-navy rounded-full flex items-center justify-center transition-colors"
            >
              <MdClose className="text-2xl" />
            </button>

            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.src || 'https://via.placeholder.com/600x400?text=Gallery+Image'} 
              alt={selectedImage.category}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
