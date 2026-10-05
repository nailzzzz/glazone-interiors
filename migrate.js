import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALrF4uQKtSYTwuUaUqc5h0e9nZLwr0kHc",
  authDomain: "glazone-interiors.firebaseapp.com",
  projectId: "glazone-interiors",
  storageBucket: "glazone-interiors.firebasestorage.app",
  messagingSenderId: "566998943641",
  appId: "1:566998943641:web:e9b0cfc2e7cbcfa1a2b508",
  measurementId: "G-HYS3W6S060"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { servicesData } from "./src/data/services.js";

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

async function migrateData() {
  console.log("Starting migration...");
  
  // 1. Services
  for (const item of servicesData) {
    const docRef = doc(db, "services", String(item.id));
    await setDoc(docRef, item, { merge: true });
    console.log(`Migrated service: ${item.title}`);
  }

  // 2. Products
  for (const item of fallbackProducts) {
    const docRef = doc(db, "products", String(item.id));
    await setDoc(docRef, item, { merge: true });
    console.log(`Migrated product: ${item.title}`);
  }

  // 3. Projects
  for (const item of projectsData) {
    const docRef = doc(db, "projects", String(item.id));
    await setDoc(docRef, item, { merge: true });
    console.log(`Migrated project: ${item.title}`);
  }

  // 4. Gallery
  for (const item of galleryImages) {
    const docRef = doc(db, "gallery", String(item.id));
    await setDoc(docRef, item, { merge: true });
    console.log(`Migrated gallery item: ${item.id}`);
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrateData().catch(console.error);
