import FastMarquee from 'react-fast-marquee';
const Marquee = FastMarquee.default || FastMarquee;
console.log(typeof Marquee === 'object' && Marquee !== null && Marquee.$$typeof ? 'Valid Component' : 'Invalid');
