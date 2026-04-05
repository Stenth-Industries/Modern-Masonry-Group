import { Link } from 'react-router-dom';
import { Globe, Share2, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-10 bg-stone-100 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 font-body leading-relaxed text-sm">
        <div className="col-span-1 md:col-span-1">
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-6 font-headline">Modern Masonry</div>
          <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-xs">
            Elevating architectural standards through premium masonry solutions and digital precision.
          </p>
          <div className="flex gap-4">
            <Globe className="text-[#8E352E] cursor-pointer hover:scale-110 transition-transform w-5 h-5" />
            <Share2 className="text-[#8E352E] cursor-pointer hover:scale-110 transition-transform w-5 h-5" />
            <MapPin className="text-[#8E352E] cursor-pointer hover:scale-110 transition-transform w-5 h-5" />
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-widest text-xs font-headline">Materials</h4>
          <ul className="space-y-4">
            <li><Link to="/masonry/brick" className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Brick Collection</Link></li>
            <li><Link to="/masonry/stone" className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Stone Veneer</Link></li>
            <li><Link to="/masonry/precast" className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Precast Elements</Link></li>
            <li><Link to="/masonry/siding" className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Siding Solutions</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-widest text-xs font-headline">Resources</h4>
          <ul className="space-y-4">
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Technical Data</button></li>
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Architect Portal</button></li>
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Safety Guides</button></li>
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Sustainability</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-widest text-xs font-headline">Legal</h4>
          <ul className="space-y-4">
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Privacy Policy</button></li>
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Terms of Service</button></li>
            <li><button className="text-stone-500 dark:text-stone-400 hover:text-[#8E352E] transition-colors">Cookie Policy</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-stone-400 text-xs">© 2024 Modern Masonry. Crafted for The Digital Architect.</p>
        <div className="text-stone-400 text-xs">Developed by Modern Labs</div>
      </div>
    </footer>
  );
};

export default Footer;
