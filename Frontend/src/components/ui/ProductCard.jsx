import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col"
    >
      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low relative cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link 
            to={`/masonry/${product.category}/${product.id}`}
            className="bg-white text-on-surface px-8 py-3 rounded-full font-bold shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 active:scale-95"
          >
            Quick View
          </Link>
        </div>
        {product.tag && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-primary">
              {product.tag}
            </span>
          </div>
        )}
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/masonry/${product.category}/${product.id}`}>
            <h3 className="font-headline font-extrabold text-xl text-on-surface hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="text-primary font-bold">{product.price}</span>
        </div>
        <p className="text-sm text-outline font-medium tracking-tight">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
