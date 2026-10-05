import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MdOutlinePrecisionManufacturing, MdInfoOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

// Fallback data in case Firebase fails or is empty
const fallbackProducts = [
  {
    id: '1',
    title: 'Ultra-Clear Low Iron Glass',
    description: 'Exceptionally clear glass that eliminates the green tint common in standard glass. Perfect for display cases and high-end facades.',
    image: 'https://images.unsplash.com/photo-1577977469796-0f31481b09b5?q=80&w=800&auto=format&fit=crop',
    specifications: ['Thickness: 4mm - 19mm', 'Light Transmittance: >91%', 'Maximum Size: 3300x6000mm'],
    applications: ['Museum Display Cases', 'Premium Retail Storefronts', 'High-end Residential Windows'],
    category: 'Premium Glass'
  },
  {
    id: '2',
    title: 'Acoustic Laminated Glass',
    description: 'Specialized laminated glass designed to significantly reduce noise transmission while maintaining clarity and safety.',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=800&auto=format&fit=crop',
    specifications: ['Thickness: 6.8mm - 16.8mm', 'Sound Reduction: up to 50dB', 'UV Protection: 99%'],
    applications: ['Airport Hotels', 'Recording Studios', 'City Center Offices'],
    category: 'Functional Glass'
  },
  {
    id: '3',
    title: 'Smart Switchable Glass',
    description: 'Innovative PDLC glass that changes from transparent to opaque at the flick of a switch for instant privacy.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800&auto=format&fit=crop',
    specifications: ['Switching Time: <0.1s', 'Power: 5W/sqm', 'Operating Temp: -20°C to +60°C'],
    applications: ['Boardrooms', 'Hospital ICUs', 'Luxury Bathrooms'],
    category: 'Smart Solutions'
  },
  {
    id: '4',
    title: 'Solar Control Double Glazing',
    description: 'High-performance insulated glass units (IGU) featuring low-e coatings to reflect solar heat while letting light in.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop',
    specifications: ['U-Value: 1.0 W/m²K', 'Argon Gas Filled', 'Spacer: Warm Edge Technology'],
    applications: ['Commercial Skyscrapers', 'Eco-friendly Homes', 'Conservatories'],
    category: 'Energy Efficient'
  }
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Attempt to fetch from Firestore
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (productsList.length > 0) {
          setProducts(productsList);
        } else {
          // If empty, use fallback
          console.warn("No products found in Firestore. Using fallback data.");
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Error fetching products from Firestore:", err);
        // On error (e.g., missing config), use fallback
        setProducts(fallbackProducts);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEnquire = (product) => {
    setSelectedProduct(null);
    setTimeout(() => {
      navigate('/quote', { state: { 
        productName: product.title,
        productCategory: product.category 
      }});
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy pt-24 pb-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-royal/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-sky/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-white">Products</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore our extensive catalog of high-performance architectural glass and accessories, engineered for the most demanding applications.
          </p>
          {error && (
            <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 py-2 px-4 rounded-full inline-block border border-yellow-200 dark:border-yellow-700/50">
              Note: Showing demonstration products. Please configure Firebase to view live database entries.
            </p>
          )}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={product.id}
              className="bg-white dark:bg-navy/40 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent z-10"></div>
                <img 
                  src={product.image || 'https://via.placeholder.com/400x300?text=Product'} 
                  alt={product.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold rounded-full shadow-lg">
                    {product.category || 'Product'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 z-20 w-[90%]">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{product.title}</h3>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                  {product.description}
                </p>
                
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="w-full py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-sky hover:text-navy text-slate-800 dark:text-slate-300 font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <MdInfoOutline className="text-lg" />
                  View Specifications
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Details Modal (Slide Over) */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-navy border-l border-slate-200 dark:border-white/10 z-50 shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="relative h-64 shrink-0">
                <img 
                  src={selectedProduct.image || 'https://via.placeholder.com/400x300?text=Product'} 
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-sky backdrop-blur-md text-white hover:text-navy rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                >
                  ✕
                </button>
                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-navy to-transparent">
                  <span className="text-sky text-sm font-semibold mb-2 block">{selectedProduct.category}</span>
                  <h2 className="text-2xl font-bold text-white">{selectedProduct.title}</h2>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {selectedProduct.description}
                </p>

                {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                  <div className="mb-8 bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <MdOutlinePrecisionManufacturing className="text-sky text-xl" />
                      Specifications
                    </h4>
                    <ul className="space-y-3">
                      {selectedProduct.specifications.map((spec, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky mt-1.5 shrink-0"></span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProduct.applications && selectedProduct.applications.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Ideal Applications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.applications.map((app, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-navy text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-white/10">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10">
                  <button onClick={() => handleEnquire(selectedProduct)} className="w-full py-3.5 bg-sky hover:bg-white text-navy font-bold rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all">
                    Enquire About Product
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
