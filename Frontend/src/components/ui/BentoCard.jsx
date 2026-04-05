import { Link } from 'react-router-dom';
import clsx from 'clsx';

const BentoCard = ({ title, category, image, className, link }) => {
  return (
    <div className={clsx("relative group overflow-hidden rounded-xl bg-surface-container-low cursor-pointer", className)}>
      <img 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        alt={title} 
        src={image} 
      />
      <div className="absolute inset-x-4 bottom-4 p-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-lg shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">{category}</p>
          <h4 className="text-xl font-headline font-bold text-on-surface">{title}</h4>
        </div>
        <Link to={link} className="bg-primary text-white p-2 rounded-full transform -translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default BentoCard;
