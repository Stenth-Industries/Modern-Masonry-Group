// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import * as topojson from 'topojson-client';
// import { motion } from 'framer-motion';

// const locations = [
//   {
//     name: 'GTA',
//     coords: [-79.3832, 43.6532],
//     cities: ['Toronto', 'Mississauga', 'Brampton', 'Scarborough'],
//   },
//   { name: 'Oakville',     coords: [-79.6877, 43.4675] },
//   { name: 'Burlington',   coords: [-79.7999, 43.3255] },
//   { name: 'Barrie',       coords: [-79.6901, 44.3894] },
//   { name: 'Innisfil',     coords: [-79.5461, 44.3019] },
//   { name: 'Bradford',     coords: [-79.5603, 44.1249] },
//   { name: 'North of GTA', coords: [-79.2500, 44.0800] },
// ];

// export default function OntarioMap() {
//   const svgRef = useRef(null);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     const width = 1200;
//     const height = 600;
//     const svg = d3.select(svgRef.current)
//       .attr('viewBox', `0 0 ${width} ${height}`)
//       .attr('width', '100%')
//       .attr('height', 'auto');

//     // Zoomed into Ontario — same Mercator but tightened to the region
//     const projection = d3.geoMercator()
//       .center([-79.6, 43.95])
//       .scale(4800)
//       .translate([width / 2, height / 2]);

//     const path = d3.geoPath().projection(projection);

//     Promise.all([
//       d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'),
//       d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'),
//     ]).then(([world, us]) => {
//       const countries = topojson.feature(world, world.objects.countries);

//       // Base countries
//       svg.append('g')
//         .selectAll('path')
//         .data(countries.features)
//         .enter()
//         .append('path')
//         .attr('d', path)
//         .attr('fill', '#1a1a1a')
//         .attr('stroke', '#333')
//         .attr('stroke-width', 0.5);

//       // US states for visible state borders
//       const states = topojson.feature(us, us.objects.states);
//       svg.append('g')
//         .selectAll('path')
//         .data(states.features)
//         .enter()
//         .append('path')
//         .attr('d', path)
//         .attr('fill', '#1a1a1a')
//         .attr('stroke', '#2a2a2a')
//         .attr('stroke-width', 0.4);

//       // Highlight Canada (country id 124 in Natural Earth)
//       svg.selectAll('.canada-highlight')
//         .data(countries.features.filter(d => d.id === 124))
//         .enter()
//         .append('path')
//         .attr('d', path)
//         .attr('fill', '#6F9CEB')
//         .attr('opacity', 0.07);

//       // Add glowing points
//       const points = svg.append('g');

//       locations.forEach(loc => {
//         const projected = projection(loc.coords);
//         if (!projected) return;
//         const [x, y] = projected;

//         // Outer glow pulse
//         points.append('circle')
//           .attr('cx', x)
//           .attr('cy', y)
//           .attr('r', 8)
//           .attr('fill', '#6F9CEB')
//           .attr('opacity', 0.4)
//           .append('animate')
//           .attr('attributeName', 'r')
//           .attr('values', '4;12;4')
//           .attr('dur', '2s')
//           .attr('repeatCount', 'indefinite');

//         // Inner solid point
//         points.append('circle')
//           .attr('cx', x)
//           .attr('cy', y)
//           .attr('r', 3)
//           .attr('fill', '#6F9CEB');

//         // Label
//         points.append('text')
//           .attr('x', x)
//           .attr('y', y - 15)
//           .attr('text-anchor', 'middle')
//           .attr('fill', '#fff')
//           .attr('font-size', '10px')
//           .attr('font-family', 'Inter')
//           .attr('font-weight', 'bold')
//           .attr('letter-spacing', '1px')
//           .text(loc.name.toUpperCase());

//         // City hub satellites (small dots fanned around the main point)
//         if (loc.cities) {
//           loc.cities.forEach((city, i) => {
//             const ox = x + (Math.cos(i) * 15);
//             const oy = y + (Math.sin(i) * 15);
//             points.append('circle')
//               .attr('cx', ox)
//               .attr('cy', oy)
//               .attr('r', 1.5)
//               .attr('fill', '#6F9CEB')
//               .attr('opacity', 0.6);
//           });
//         }
//       });
//     });
//   }, []);

//   return (
//     <section className="py-24 px-6 md:px-12 overflow-hidden">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//           <div>
//             <p className="text-xs uppercase tracking-[0.4em] font-bold text-[var(--brass)] mb-4">
//               Delivery Coverage
//             </p>
//             <h2 className="text-5xl md:text-7xl leading-none font-black tracking-tighter text-white">
//               Delivered Across <br />
//               <span className="text-[var(--brass)]">Ontario.</span>
//             </h2>
//           </div>
//           <div className="max-w-xs text-right">
//             <p className="text-[var(--ash)] text-sm italic leading-relaxed">
//               "From the GTA to Barrie, we deliver Ontario's finest masonry
//               products directly to your job site — on time, every time."
//             </p>
//           </div>
//         </div>

//         <div className="relative rounded-[40px] border border-white/5 bg-white/[0.02] p-8 md:p-12 overflow-hidden">
//           <svg ref={svgRef} className="w-full h-auto" />

//           {/* Decorative glow */}
//           <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6F9CEB]/5 rounded-full blur-[120px]" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
