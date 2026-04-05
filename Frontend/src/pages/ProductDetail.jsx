import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Check, Envelope } from '@phosphor-icons/react';
import { products } from '../data/mockData';

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

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    quantity: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-[#1E1C1B] mb-4">Product Not Found</h1>
          <Link to="/" className="text-[#A84232] hover:text-[#8A3325]">Return to Home</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-20 bg-[#F9F8F6]">
      <div className="py-12 px-6 md:px-12 lg:px-24">
        <Link
          to={`/products/${product.category.toLowerCase().replace(/\s/g, '-')}`}
          className="inline-flex items-center space-x-2 text-[#A84232] hover:text-[#8A3325] mb-8"
          data-testid="back-to-category"
        >
          <ArrowLeft size={20} weight="bold" />
          <span className="font-medium">Back to {product.category}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <AnimatedSection>
            <div className="space-y-4">
              <div className="aspect-square bg-white overflow-hidden">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  data-testid="main-product-image"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-white overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-[#A84232]' : 'border-transparent hover:border-[#E2DFD9]'
                      }`}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection>
            <div className="space-y-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-3">
                  {product.brand}
                </p>
                <h1 className="text-4xl md:text-5xl tracking-tight font-medium text-[#1E1C1B] mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-[#4A4643] leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-[#E2DFD9] pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-[#1E1C1B] mb-2">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <span key={color} className="px-3 py-2 bg-white border border-[#E2DFD9] text-sm text-[#1E1C1B]">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#1E1C1B] mb-2">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <span key={size} className="px-3 py-2 bg-white border border-[#E2DFD9] text-sm text-[#1E1C1B]">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Inquiry Form */}
        <AnimatedSection className="mt-16">
          <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl tracking-tight font-medium text-[#1E1C1B] mb-2">
              Request Information
            </h2>
            <p className="text-[#4A4643] mb-8">
              Interested in {product.name}? Fill out the form below and we'll get back to you shortly.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 bg-[#A84232] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} weight="bold" className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-[#1E1C1B] mb-2">Thank You!</h3>
                <p className="text-[#4A4643]">We'll contact you soon about {product.name}.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="inquiry-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                      data-testid="inquiry-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                      data-testid="inquiry-company"
                    />
                  </div>
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
                      data-testid="inquiry-email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                      data-testid="inquiry-phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                    Quantity Required
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 1000 units"
                    className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B]"
                    data-testid="inquiry-quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1C1B] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-[#E2DFD9] focus:border-[#A84232] outline-none text-[#1E1C1B] resize-none"
                    data-testid="inquiry-message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#A84232] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#8A3325] transition-all flex items-center justify-center space-x-2"
                  data-testid="inquiry-submit"
                >
                  <Envelope size={20} weight="bold" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ProductDetail;