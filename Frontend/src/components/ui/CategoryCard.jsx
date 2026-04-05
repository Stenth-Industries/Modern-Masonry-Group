import { Link } from 'react-router-dom';

const CategoryCard = ({ title, description, image, link }) => {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low transition-all hover:-translate-y-2">
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 w-full z-10 flex flex-col items-start">
        <h3 className="text-white text-2xl font-headline font-bold mb-2">{title}</h3>
        <p className="text-stone-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4">
          {description}
        </p>
        <Link 
          to={link}
          className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Explore {title}
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
