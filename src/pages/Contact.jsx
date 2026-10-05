import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MdSend, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'enquiries'), {
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        projectDetails: formData.message.trim(),
        status: 'new',
        createdAt: serverTimestamp()
      });

      toast.success('Message sent successfully! We will be in touch.');

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Enquiry submission error:', error);

      if (error?.code === 'permission-denied') {
        toast.error('Unable to submit your enquiry. Please try again.');
      } else if (error?.code === 'failed-precondition') {
        toast.error('Firestore is not configured correctly.');
      } else if (error?.code === 'unavailable') {
        toast.error('Unable to connect to Firebase. Please check your internet connection.');
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Get in <span className="text-sky">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Have questions about our services or need support? Our team is here to help you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Map and Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky/10 text-sky rounded-full flex items-center justify-center shrink-0 text-xl">
                    <MdLocationOn />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Headquarters
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
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky/10 text-sky rounded-full flex items-center justify-center shrink-0 text-xl">
                    <MdPhone />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Direct Line
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      <a href="tel:+918129842105" className="hover:text-sky transition-colors">
                        8129842105
                      </a>
                      <br />
                      Mon-Fri, 9am-6pm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-white/10 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.653316972795!2d76.37170827762417!3d10.098439964258743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08090012592ccf%3A0xda4ea870857010ee!2sGLAZONE%20INTERIOR%20%26%20EXTERIOR!5e1!3m2!1sen!2sus!4v1789210544973!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Glazone Interiors Location"
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-white/5 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl h-full flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Send a Message
                </h3>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      disabled={isSubmitting}
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                      placeholder="Name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      disabled={isSubmitting}
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      required
                      disabled={isSubmitting}
                      autoComplete="off"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      disabled={isSubmitting}
                      autoComplete="off"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all resize-none disabled:opacity-60"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-8 bg-sky hover:bg-royal text-white font-bold rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
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
