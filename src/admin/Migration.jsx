import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { servicesData } from '../data/services';
import toast from 'react-hot-toast';

// Fallback products from Products.jsx
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

const projectsData = [
  {
    id: 1,
    title: 'Skyline Corporate Headquarters',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    description: 'Complete structural glass facade installation for a 40-story office building.',
  },
  {
    id: 2,
    title: 'Modern Minimalist Villa',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    description: 'Custom frameless glass railings and floor-to-ceiling double glazed windows.',
  },
  {
    id: 3,
    title: 'Tech Hub Innovation Center',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    description: 'Smart switchable glass partitions for meeting rooms and collaborative spaces.',
  },
  {
    id: 4,
    title: 'Apex Industrial Complex',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    description: 'Heavy-duty toughened glass installations for factory observation decks.',
  },
  {
    id: 5,
    title: 'Ocean View Penthouse',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop',
    description: 'Bespoke frameless shower enclosures and smart mirrors in master suites.',
  },
  {
    id: 6,
    title: 'Metro Shopping Mall',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1200&auto=format&fit=crop',
    description: 'Massive skylights and spider glazing for the main atrium.',
  }
];

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', category: 'Interior', span: 'col-span-1 row-span-1' },
  { id: 2, src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop', category: 'Facade', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: 3, src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop', category: 'Shower', span: 'col-span-1 row-span-1' },
  { id: 4, src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop', category: 'Railing', span: 'col-span-1 row-span-1' },
  { id: 5, src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', category: 'Decorative', span: 'col-span-1 row-span-2' },
  { id: 6, src: 'https://images.unsplash.com/photo-1541888046427-02421714fa41?q=80&w=800&auto=format&fit=crop', category: 'Glass', span: 'col-span-1 row-span-1' },
  { id: 7, src: 'https://images.unsplash.com/photo-1428366890462-dd4baecf492b?q=80&w=800&auto=format&fit=crop', category: 'Facade', span: 'col-span-1 md:col-span-2 row-span-1' },
  { id: 8, src: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop', category: 'Partition', span: 'col-span-1 row-span-1' },
];

export default function Migration() {
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [progress, setProgress] = useState({
    services: 0,
    products: 0,
    projects: 0,
    gallery: 0
  });
  const [skipped, setSkipped] = useState({
    services: 0,
    products: 0,
    projects: 0,
    gallery: 0
  });

  const totals = {
    services: servicesData.length,
    products: fallbackProducts.length,
    projects: projectsData.length,
    gallery: galleryImages.length,
    overall: servicesData.length + fallbackProducts.length + projectsData.length + galleryImages.length
  };

  const runMigration = async () => {
    setLoading(true);
    setHasRun(false);
    setProgress({ services: 0, products: 0, projects: 0, gallery: 0 });
    setSkipped({ services: 0, products: 0, projects: 0, gallery: 0 });

    try {
      // 1. Services
      for (const item of servicesData) {
        const docRef = doc(db, "services", String(item.id));
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, item);
          setProgress(p => ({ ...p, services: p.services + 1 }));
        } else {
          setSkipped(s => ({ ...s, services: s.services + 1 }));
        }
      }

      // 2. Products
      for (const item of fallbackProducts) {
        const docRef = doc(db, "products", String(item.id));
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, item);
          setProgress(p => ({ ...p, products: p.products + 1 }));
        } else {
          setSkipped(s => ({ ...s, products: s.products + 1 }));
        }
      }

      // 3. Projects
      for (const item of projectsData) {
        const docRef = doc(db, "projects", String(item.id));
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, item);
          setProgress(p => ({ ...p, projects: p.projects + 1 }));
        } else {
          setSkipped(s => ({ ...s, projects: s.projects + 1 }));
        }
      }

      // 4. Gallery
      for (const item of galleryImages) {
        const docRef = doc(db, "gallery", String(item.id));
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, item);
          setProgress(p => ({ ...p, gallery: p.gallery + 1 }));
        } else {
          setSkipped(s => ({ ...s, gallery: s.gallery + 1 }));
        }
      }

      setHasRun(true);
      toast.success("Migration process finished!");
    } catch (err) {
      console.error(err);
      toast.error("Migration encountered errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Data Migration</h1>
        <p className="text-slate-500">Migrate existing static data to Firestore securely.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-3xl">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Static Data Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="block text-sm text-slate-500 font-medium mb-1">Services</span>
              <span className="text-2xl font-bold text-sky">{totals.services}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="block text-sm text-slate-500 font-medium mb-1">Products</span>
              <span className="text-2xl font-bold text-sky">{totals.products}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="block text-sm text-slate-500 font-medium mb-1">Projects</span>
              <span className="text-2xl font-bold text-sky">{totals.projects}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="block text-sm text-slate-500 font-medium mb-1">Gallery</span>
              <span className="text-2xl font-bold text-sky">{totals.gallery}</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="px-4 py-1.5 bg-sky/10 text-sky font-bold rounded-full">
              Total Items: {totals.overall}
            </span>
          </div>
        </div>

        {(loading || hasRun) && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Migration Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">Services</span>
                <span className="font-bold text-sky">{progress.services} / {totals.services}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">Products</span>
                <span className="font-bold text-sky">{progress.products} / {totals.products}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">Projects</span>
                <span className="font-bold text-sky">{progress.projects} / {totals.projects}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">Gallery</span>
                <span className="font-bold text-sky">{progress.gallery} / {totals.gallery}</span>
              </div>
            </div>
          </div>
        )}

        {hasRun && !loading && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h3 className="text-lg font-bold text-emerald-700 mb-2">Migration completed successfully</h3>
            <ul className="text-sm text-emerald-600 space-y-1 list-disc pl-5">
              <li>{progress.services + progress.products + progress.projects + progress.gallery} items successfully imported.</li>
              <li>{skipped.services + skipped.products + skipped.projects + skipped.gallery} items skipped (already exist).</li>
            </ul>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={runMigration}
            disabled={loading}
            className="px-8 py-4 bg-sky hover:bg-sky/90 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {loading ? 'Migrating Data...' : 'Start Migration'}
          </button>
        </div>
      </div>
    </div>
  );
}

