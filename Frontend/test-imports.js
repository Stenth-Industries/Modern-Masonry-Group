import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Upload } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

console.log('Marquee:', type(Marquee));
console.log('motion:', type(motion));
console.log('ArrowRight:', type(ArrowRight));
console.log('Link:', type(Link));

function type(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.default) return `Object with default: ${typeof obj.default}`;
    return `Object keys: ${Object.keys(obj).join(', ')}`;
  }
  return typeof obj;
}
