import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, EnvelopeSimple, Clock, Check } from '@phosphor-icons/react';

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#1E1C1B] text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl tracking-tighter font-medium mb-6">
            Get In Touch
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Have questions about our products or services? Our expert team is here to help.
          </p>
        </motion.div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <AnimatedSection>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl tracking-tight font-medium text-[#1E1C1B] mb-8">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#A84232] flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1E1C1B] mb-1">Visit Us</h3>
                    <p className="text-[#4A4643]">
                      123 Masonry Lane<br />
                      Construction City, ST 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#A84232] flex items-center justify-center flex-shrink-0">
                    <Phone size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1E1C1B] mb-1">Call Us</h3>
                    <p className="text-[#4A4643]">
                      <a href="tel:+15551234567" className="hover:text-[#A84232] transition-colors">
                        (555) 123-4567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#A84232] flex items-center justify-center flex-shrink-0">
                    <EnvelopeSimple size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1E1C1B] mb-1">Email Us</h3>
                    <p className="text-[#4A4643]">
                      <a href="mailto:info@modernmasonry.com" className="hover:text-[#A84232] transition-colors">
                        info@modernmasonry.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#A84232] flex items-center justify-center flex-shrink-0">
                    <Clock size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1E1C1B] mb-1">Business Hours</h3>
                    <div className="text-[#4A4643] space-y-1">
                      <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
                      <p>Saturday: 8:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-[4/3] bg-[#E2DFD9] flex items-center justify-center mt-8">
                <MapPin size={64} weight="light" className="text-[#A84232]" />
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection>
            {submitted ? (
              <div className="bg-white p-12 shadow-lg flex items-center justify-center" data-testid="contact-success">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#A84232] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} weight="bold" className="text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-[#1E1C1B] mb-2">Message Sent!</h3>
                  <p className="text-[#4A4643]">We'll get back to you as soon as possible.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg" data-testid="contact-form">
                <h2 className="text-3xl tracking-tight font-medium text-[#1E1C1B] mb-8">
                  Send Us a Message
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                      data-testid="contact-name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                        data-testid="contact-email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                        data-testid="contact-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                      data-testid="contact-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B] resize-none"
                      data-testid="contact-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all"
                    data-testid="contact-submit"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Contact;