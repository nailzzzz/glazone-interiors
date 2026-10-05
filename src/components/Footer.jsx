import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp
} from 'react-icons/fa';

const socialLinks = [
  {
    icon: <FaFacebookF />,
    url: 'https://www.facebook.com/gulfglasswork',
    label: 'Facebook'
  },
  {
    icon: <FaInstagram />,
    url: 'https://www.instagram.com/glazone.in',
    label: 'Instagram'
  },
  {
    icon: <FaLinkedinIn />,
    url: 'https://www.linkedin.com/in/noushad-marakkar-8271328a',
    label: 'LinkedIn'
  }
];

const quickLinks = [
  {
    name: 'About Us',
    path: '/about'
  },
  {
    name: 'Services',
    path: '/services'
  },
  {
    name: 'Products',
    path: '/products'
  },
  {
    name: 'Projects',
    path: '/projects'
  },
  {
    name: 'Gallery',
    path: '/gallery'
  }
];

const services = [
  {
    name: 'Glass Installation',
    slug: 'glass-installation'
  },
  {
    name: 'Glass Facades',
    slug: 'glass-facades'
  },
  {
    name: 'Shower Enclosures',
    slug: 'shower-enclosures'
  },
  {
    name: 'Glass Railings',
    slug: 'glass-railings'
  },
  {
    name: 'Decorative Glass',
    slug: 'decorative-glass'
  },
  {
    name: 'Premium Aluminium Windows and Doors',
    slug: 'premium-aluminium-windows-and-doors'
  },
  {
    name: 'Smart Mirror',
    slug: 'smart-mirror'
  }
];

export default function Footer() {
  return (
    <footer className="bg-navy relative overflow-hidden border-t border-white/10 pt-20 pb-8">

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-royal/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-slate-300">

        {/* ================= MAIN FOOTER ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* ================= COMPANY INFO ================= */}

          <div>

            <Link to="/" className="inline-block mb-6">

              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky to-white">
                GLAZONE
              </span>

            </Link>

            <p className="mb-8 text-sm leading-relaxed text-slate-400 pr-4">
              Premium glass and facade solutions for residential, commercial,
              and industrial projects. Elevating architecture with modern
              designs.
            </p>

            {/* Social Media */}

            <div className="flex gap-4">

              {socialLinks.map((social, index) => (

                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  whileHover={{
                    y: -5,
                    scale: 1.1
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sky hover:border-sky hover:text-navy transition-all duration-300 shadow-lg"
                >
                  {social.icon}
                </motion.a>

              ))}

            </div>

          </div>


          {/* ================= QUICK LINKS ================= */}

          <div>

            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">

              <span className="w-4 h-1 bg-sky rounded-full"></span>

              Quick Links

            </h4>

            <ul className="space-y-3">

              {quickLinks.map((item) => (

                <li key={item.path}>

                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-sky hover:translate-x-2 transition-all duration-300 inline-block"
                  >
                    {item.name}
                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* ================= SERVICES ================= */}

          <div>

            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">

              <span className="w-4 h-1 bg-sky rounded-full"></span>

              Our Services

            </h4>

            <ul className="space-y-3">

              {services.map((service) => (

                <li key={service.slug}>

                  <Link
                    to={`/services/${service.slug}`}
                    className="text-slate-400 hover:text-sky hover:translate-x-2 transition-all duration-300 inline-block"
                  >
                    {service.name}
                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* ================= CONTACT ================= */}

          <div>

            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">

              <span className="w-4 h-1 bg-sky rounded-full"></span>

              Contact Us

            </h4>

            <ul className="space-y-5 text-slate-400">

              {/* Address */}

              <li className="flex items-start gap-4 group">

                <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-sky group-hover:text-navy transition-colors shrink-0">

                  <FaMapMarkerAlt className="text-sm" />

                </div>

                <span className="leading-relaxed">
                  Kottakkad Road, Keezhmad, Aluva,
                  Ernakulam, Kerala
                </span>

              </li>


              {/* Phone */}

              <li className="flex items-center gap-4 group">

                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-sky group-hover:text-navy transition-colors shrink-0">

                  <FaPhoneAlt className="text-sm" />

                </div>

                <a
                  href="tel:+918129842105"
                  className="hover:text-white transition-colors"
                >
                  +91 8129842105
                </a>

              </li>


              {/* WhatsApp */}

              <li className="flex items-center gap-4 group">

                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-sky group-hover:text-navy transition-colors shrink-0">

                  <FaWhatsapp className="text-sm" />

                </div>

                <a
                  href="https://wa.me/918129842105"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>

              </li>


              {/* Email */}

              <li className="flex items-center gap-4 group">

                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-sky group-hover:text-navy transition-colors shrink-0">

                  <FaEnvelope className="text-sm" />

                </div>

                <a
                  href="mailto:noushadma2008@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  noushadma2008@gmail.com
                </a>

              </li>

            </ul>

          </div>

        </div>


        {/* ================= BOTTOM FOOTER ================= */}

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">

          {/* Copyright */}

          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Glazone Interiors & Exteriors.
            All rights reserved.
          </p>


          {/* Legal Links */}

          <div className="flex gap-6">

            <Link
              to="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}