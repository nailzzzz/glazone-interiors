import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MdArrowForward, MdDesignServices, MdSecurity, MdSpeed } from 'react-icons/md';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
    title: 'Architectural Brilliance',
    subtitle: 'Premium Facades & Structural Glass Solutions',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    title: 'Modern Luxury',
    subtitle: 'Bespoke Residential Glass Installations',
  },
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    title: 'Innovative Design',
    subtitle: 'Smart Glass and Acoustic Solutions',
  }
];

const features = [
  { icon: <MdDesignServices />, title: 'Custom Design', desc: 'Tailored solutions to match your architectural vision perfectly.' },
  { icon: <MdSecurity />, title: 'Uncompromising Safety', desc: 'Highest grade materials meeting stringent safety standards.' },
  { icon: <MdSpeed />, title: 'Efficient Delivery', desc: 'Precision installation with strict adherence to timelines.' },
];

export default function Home() {
  return (
    <div className="bg-slate-50 dark:bg-navy min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-navy/60 z-10"></div>
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-sky font-semibold tracking-widest uppercase mb-4"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Link to="/quote" className="inline-flex items-center gap-2 bg-sky text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                      Request a Consultation <MdArrowForward />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Glazone?</h2>
            <p className="text-slate-600 dark:text-slate-400">We combine decades of expertise with cutting-edge technology to deliver flawless glass and facade installations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center group hover:border-sky/50 transition-colors"
              >
                <div className="w-16 h-16 bg-sky/10 text-sky rounded-full flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-navy to-royal overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888046427-02421714fa41?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to elevate your space?</h2>
            <p className="text-sky text-lg">Contact our experts today for a personalized quote.</p>
          </div>
          <Link to="/quote" className="bg-white text-navy px-10 py-4 rounded-full font-bold text-lg hover:bg-sky hover:text-white transition-all shadow-xl">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
