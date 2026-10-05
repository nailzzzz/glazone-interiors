import { motion } from 'framer-motion';
import { MdCheckCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Years Experience', value: '15+' },
  { label: 'Projects Completed', value: '500+' },
  { label: 'Happy Clients', value: '300+' },
  { label: 'Expert Team Members', value: '45' },
];

export default function About() {
  return (
    <div className="bg-slate-50 dark:bg-navy min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            About <span className="text-sky">Glazone</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Redefining architectural boundaries with premium glass and facade solutions for over a decade.
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-sky/20 rounded-3xl transform -rotate-6 scale-105 transition-transform group-hover:rotate-0"></div>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                alt="Office"
                className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Vision & Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              At Glazone, we believe that glass is not just a building material; it's a medium of expression. Our mission is to seamlessly blend aesthetics, functionality, and safety in every project we undertake.
            </p>
            <ul className="space-y-4">
              {['Uncompromising Quality Standards', 'Innovative Engineering Solutions', 'Sustainable and Energy-Efficient Materials', 'Client-Centric Project Management'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <MdCheckCircle className="text-sky text-xl shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link to="/contact" className="inline-block bg-sky text-white px-8 py-3 rounded-full font-bold hover:bg-royal transition-colors shadow-lg">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center shadow-lg"
            >
              <h3 className="text-4xl font-bold text-sky mb-2">{stat.value}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
