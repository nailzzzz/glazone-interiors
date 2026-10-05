import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MdSend, MdPhone, MdEmail, MdLocationOn, MdInfoOutline } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Quote() {
  const location = useLocation();
  const { productName, productCategory } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Commercial',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productName) {
      setFormData(prev => ({
        ...prev,
        message: `I would like to enquire about ${productName} (${productCategory}).\n\nMy requirements are:\n`
      }));
    }
  }, [productName, productCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Clean phone number
    const phoneClean = formData.phone.replace(/[\s-]/g, '');

    // Indian mobile number validation
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

    if (!phoneRegex.test(phoneClean)) {
      toast.error('Please enter a valid Indian mobile number.');
      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter your project details.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'enquiries'), {
        fullName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        projectType: formData.projectType,
        projectDetails: formData.message.trim(),
        productName: productName || null,
        productCategory: productCategory || null,
        status: 'new',
        createdAt: serverTimestamp()
      });

      toast.success(
        'Quote request submitted successfully! We will contact you soon.'
      );

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectType: 'Commercial',
        message: ''
      });

    } catch (error) {
      console.error('Enquiry submission error:', error);

      if (error?.code === 'permission-denied') {
        toast.error('Permission denied. Please check your Firebase Firestore rules.');
      } else if (error?.code === 'failed-precondition') {
        toast.error('Firestore is not configured correctly. Please check your Firebase project.');
      } else if (error?.code === 'unavailable') {
        toast.error('Unable to connect to Firebase. Please check your internet connection.');
      } else if (error?.code === 'invalid-argument') {
        toast.error('Invalid enquiry information. Please check the form.');
      } else {
        toast.error(`Failed to submit enquiry: ${error?.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Request a <span className="text-sky">Quote</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400">
            Tell us about your project, and our experts will get back to you
            with a comprehensive proposal and estimate.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/3 space-y-8"
          >
            <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <ul className="space-y-6">
                {/* Address */}
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky/10 text-sky rounded-full flex items-center justify-center shrink-0 text-xl">
                    <MdLocationOn />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Our Office
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      <a
                        href="https://maps.app.goo.gl/UcH7yyguda9dvaGD9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky transition-colors"
                      >
                        Kottakkad Road, Keezhmad,
                        <br />
                        Aluva, Ernakulam, Kerala
                      </a>
                    </p>
                  </div>
                </li>

                {/* Phone */}
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky/10 text-sky rounded-full flex items-center justify-center shrink-0 text-xl">
                    <MdPhone />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Call Us
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      <a href="tel:+918129842105" className="hover:text-sky transition-colors">
                        8129842105
                      </a>
                    </p>
                  </div>
                </li>

                {/* Email */}
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky/10 text-sky rounded-full flex items-center justify-center shrink-0 text-xl">
                    <MdEmail />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Email Us
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      <a href="mailto:noushadma2008@gmail.com" className="hover:text-sky transition-colors">
                        noushadma2008@gmail.com
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-2/3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-white/5 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl"
            >
              {productName && (
                <div className="mb-6 bg-sky/10 border border-sky/20 rounded-xl p-4 flex items-center gap-3">
                  <MdInfoOutline className="text-sky text-xl shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      You are enquiring about: <strong className="text-slate-900 dark:text-white">{productName}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                    placeholder="Name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    disabled={isSubmitting}
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="tel"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Email + Project Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    disabled={isSubmitting}
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all appearance-none disabled:opacity-60"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Architectural">Architectural</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  disabled={isSubmitting}
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all resize-none disabled:opacity-60"
                  placeholder="Please describe your requirements, approximate dimensions, and timeline..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-sky to-royal hover:from-royal hover:to-sky text-white font-bold rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <MdSend className="text-xl" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
