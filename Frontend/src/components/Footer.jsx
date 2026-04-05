import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, FacebookLogo, LinkedinLogo, Phone, EnvelopeSimple, MapPin } from '@phosphor-icons/react';

const Footer = () => {
  return (
    <footer className="bg-[#1E1C1B] text-[#F9F8F6]" data-testid="footer">
      <div className="px-6 md:px-12 lg:px-24 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-medium tracking-tight mb-6">
              Modern <span className="text-[#A84232]">Masonry</span>
            </h3>
            <p className="text-[#E2DFD9] leading-relaxed mb-6">
              Building modern spaces with timeless materials. Your trusted partner for premium masonry products and services.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-[#4A4643] hover:bg-[#A84232] transition-colors"
                aria-label="Instagram"
              >
                <InstagramLogo size={20} weight="bold" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-[#4A4643] hover:bg-[#A84232] transition-colors"
                aria-label="Facebook"
              >
                <FacebookLogo size={20} weight="bold" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-[#4A4643] hover:bg-[#A84232] transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={20} weight="bold" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-6">
              Products
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products/brick" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Brick
                </Link>
              </li>
              <li>
                <Link to="/products/stone" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Stone
                </Link>
              </li>
              <li>
                <Link to="/products/precast" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Precast
                </Link>
              </li>
              <li>
                <Link to="/products/siding" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Siding
                </Link>
              </li>
              <li>
                <Link to="/products/hardscape" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Hardscape
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Custom Homes
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Residential
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Restoration
                </Link>
              </li>
              <li>
                <Link to="/estimate" className="text-[#E2DFD9] hover:text-white transition-colors">
                  Free Estimate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-bold text-[#A84232] mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} weight="bold" className="text-[#A84232] mt-1 flex-shrink-0" />
                <span className="text-[#E2DFD9]">
                  123 Masonry Lane<br />Construction City, ST 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} weight="bold" className="text-[#A84232] flex-shrink-0" />
                <a href="tel:+15551234567" className="text-[#E2DFD9] hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeSimple size={20} weight="bold" className="text-[#A84232] flex-shrink-0" />
                <a href="mailto:info@modernmasonry.com" className="text-[#E2DFD9] hover:text-white transition-colors">
                  info@modernmasonry.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#4A4643] flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[#E2DFD9] text-sm">
            © {new Date().getFullYear()} Modern Masonry. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-[#E2DFD9] hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[#E2DFD9] hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;