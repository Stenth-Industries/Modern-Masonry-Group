export const products = [
  // BRICK
  {
    id: 'brick-001',
    name: 'Classic Red Clay Brick',
    category: 'Brick',
    brand: 'Glen-Gery',
    colors: ['Red', 'Burgundy', 'Terracotta'],
    sizes: ['Standard 8x4x2.25', 'Modular 7.625x3.625x2.25'],
    description: 'Premium handmade clay brick with a rich, timeless red finish. Perfect for residential and commercial projects requiring classic aesthetics.',
    image: 'https://images.unsplash.com/photo-1767452657161-dba27fe846e1?w=800',
    images: [
      'https://images.unsplash.com/photo-1767452657161-dba27fe846e1?w=800',
      'https://images.unsplash.com/photo-1747578248678-21846db2d6fb?w=800',
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800'
    ],
    featured: true
  },
  {
    id: 'brick-002',
    name: 'Whitewashed Modern Brick',
    category: 'Brick',
    brand: 'Belden Brick',
    colors: ['White', 'Cream', 'Light Gray'],
    sizes: ['Standard 8x4x2.25', 'Jumbo 8x4x4'],
    description: 'Contemporary whitewashed brick ideal for modern architectural designs. Provides a clean, minimalist appearance.',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800',
    images: [
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    featured: true
  },
  {
    id: 'brick-003',
    name: 'Charcoal Gray Brick',
    category: 'Brick',
    brand: 'Acme Brick',
    colors: ['Charcoal', 'Dark Gray', 'Black'],
    sizes: ['Standard 8x4x2.25', 'Modular 7.625x3.625x2.25'],
    description: 'Bold charcoal brick offering dramatic contrast and modern sophistication for exterior and interior applications.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    ],
    featured: false
  },
  {
    id: 'brick-004',
    name: 'Rustic Tumbled Brick',
    category: 'Brick',
    brand: 'Glen-Gery',
    colors: ['Mixed Red', 'Brown', 'Orange'],
    sizes: ['Standard 8x4x2.25'],
    description: 'Weathered appearance brick with tumbled edges for authentic aged aesthetic. Perfect for historic restorations.',
    image: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800',
    images: [
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800'
    ],
    featured: false
  },

  // STONE
  {
    id: 'stone-001',
    name: 'Natural Limestone',
    category: 'Stone',
    brand: 'Indiana Limestone',
    colors: ['Buff', 'Gray', 'Rustic'],
    sizes: ['12x12', '24x24', 'Custom'],
    description: 'Premium natural limestone with consistent color and texture. Ideal for elegant facades and high-end residential projects.',
    image: 'https://images.unsplash.com/photo-1760774716625-b9a9f3077237?w=800',
    images: [
      'https://images.unsplash.com/photo-1760774716625-b9a9f3077237?w=800',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800'
    ],
    featured: true
  },
  {
    id: 'stone-002',
    name: 'Stacked Stone Veneer',
    category: 'Stone',
    brand: 'Eldorado Stone',
    colors: ['Multi-tone Gray', 'Earth', 'Charcoal'],
    sizes: ['Panel 6x24', 'Corner Units'],
    description: 'Lightweight manufactured stone veneer with authentic stacked appearance. Easy installation for interior and exterior walls.',
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=800',
    images: [
      'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=800'
    ],
    featured: true
  },
  {
    id: 'stone-003',
    name: 'Granite Ashlar',
    category: 'Stone',
    brand: 'Rock of Ages',
    colors: ['Black', 'Gray', 'Pink'],
    sizes: ['4x8', '6x12', '8x16'],
    description: 'Precision-cut granite ashlar for refined architectural details. Exceptional durability and timeless elegance.',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
    ],
    featured: false
  },

  // PRECAST
  {
    id: 'precast-001',
    name: 'Architectural Precast Panels',
    category: 'Precast',
    brand: 'Gate Precast',
    colors: ['Natural Gray', 'White', 'Sandstone'],
    sizes: ['Custom sizes available'],
    description: 'High-quality architectural precast concrete panels with various finish options. Rapid installation for commercial projects.',
    image: 'https://images.unsplash.com/photo-1590908199253-050e6c4cc0c5?w=800',
    images: [
      'https://images.unsplash.com/photo-1590908199253-050e6c4cc0c5?w=800'
    ],
    featured: true
  },
  {
    id: 'precast-002',
    name: 'Precast Window Sills',
    category: 'Precast',
    brand: 'Metromont',
    colors: ['White', 'Gray', 'Limestone'],
    sizes: ['Standard lengths 4-8ft'],
    description: 'Durable precast concrete window sills with smooth finish. Weather-resistant and low maintenance.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    featured: false
  },

  // SIDING
  {
    id: 'siding-001',
    name: 'Fiber Cement Siding',
    category: 'Siding',
    brand: 'James Hardie',
    colors: ['Arctic White', 'Evening Blue', 'Aged Pewter'],
    sizes: ['8.25 in. x 12 ft', '12 in. x 12 ft'],
    description: 'Weather-resistant fiber cement siding with authentic wood texture. Fire-resistant and pest-proof.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
    ],
    featured: true
  },
  {
    id: 'siding-002',
    name: 'Vinyl Lap Siding',
    category: 'Siding',
    brand: 'CertainTeed',
    colors: ['White', 'Beige', 'Charcoal'],
    sizes: ['Double 4 in.', 'Double 5 in.'],
    description: 'Low-maintenance vinyl siding with fade-resistant color. Cost-effective solution for residential exteriors.',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    images: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'
    ],
    featured: false
  },

  // AGGREGATES
  {
    id: 'aggregate-001',
    name: 'Pea Gravel',
    category: 'Aggregates',
    brand: 'Vulcan Materials',
    colors: ['Natural tan', 'Mixed'],
    sizes: ['3/8 inch', 'Bulk/Bagged'],
    description: 'Smooth rounded pea gravel perfect for pathways, driveways, and decorative landscaping.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
    ],
    featured: false
  },
  {
    id: 'aggregate-002',
    name: 'Crushed Stone',
    category: 'Aggregates',
    brand: 'Martin Marietta',
    colors: ['Gray', 'White', 'Mixed'],
    sizes: ['1/2 inch', '3/4 inch', '1 inch'],
    description: 'Versatile crushed stone aggregate for drainage, base material, and decorative applications.',
    image: 'https://images.unsplash.com/photo-1625246333245-c63d4cd5896f?w=800',
    images: [
      'https://images.unsplash.com/photo-1625246333245-c63d4cd5896f?w=800'
    ],
    featured: false
  },

  // HARDSCAPE
  {
    id: 'hardscape-001',
    name: 'Paver Stones',
    category: 'Hardscape',
    brand: 'Belgard',
    colors: ['Gray', 'Tan', 'Multi-color'],
    sizes: ['4x8', '6x6', '6x9'],
    description: 'Interlocking paver stones for patios, walkways, and driveways. Durable and slip-resistant.',
    image: 'https://images.unsplash.com/photo-1629466665657-12d85745654f?w=800',
    images: [
      'https://images.unsplash.com/photo-1629466665657-12d85745654f?w=800'
    ],
    featured: true
  },
  {
    id: 'hardscape-002',
    name: 'Retaining Wall Blocks',
    category: 'Hardscape',
    brand: 'Versa-Lok',
    colors: ['Charcoal', 'Tan', 'Earth Blend'],
    sizes: ['Standard units', 'Cap units'],
    description: 'Segmental retaining wall blocks for landscaping and erosion control. Easy installation system.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    ],
    featured: false
  },

  // LANDSCAPE MATERIALS
  {
    id: 'landscape-001',
    name: 'Mulch - Hardwood',
    category: 'Landscape Materials',
    brand: 'Garick',
    colors: ['Brown', 'Red', 'Black'],
    sizes: ['2 cu ft bags', 'Bulk yards'],
    description: 'Premium hardwood mulch for garden beds and landscaping. Retains moisture and suppresses weeds.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
    ],
    featured: false
  },
  {
    id: 'landscape-002',
    name: 'Decorative River Rock',
    category: 'Landscape Materials',
    brand: 'Southwest Boulder',
    colors: ['Multi-tone', 'White', 'Black'],
    sizes: ['1-3 inch', '3-5 inch'],
    description: 'Polished river rock for decorative landscaping features. Natural appearance with smooth texture.',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
    ],
    featured: false
  },

  // ACCESSORIES
  {
    id: 'accessory-001',
    name: 'Masonry Anchors & Ties',
    category: 'Accessories',
    brand: 'Hohmann & Barnard',
    colors: ['Galvanized', 'Stainless Steel'],
    sizes: ['Various'],
    description: 'High-strength masonry anchors and wall ties for secure brick and stone veneer installation.',
    image: 'https://images.unsplash.com/photo-1581092918484-8313e1f7e8c7?w=800',
    images: [
      'https://images.unsplash.com/photo-1581092918484-8313e1f7e8c7?w=800'
    ],
    featured: false
  },
  {
    id: 'accessory-002',
    name: 'Type N Mortar Mix',
    category: 'Accessories',
    brand: 'Quikrete',
    colors: ['Gray', 'White', 'Buff'],
    sizes: ['50 lb bag', '60 lb bag'],
    description: 'General-purpose mortar mix for laying brick, block, and stone. Suitable for above-grade applications.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    ],
    featured: false
  }
];

export const brands = [
  { name: 'Glen-Gery', category: 'Brick', logo: 'GG' },
  { name: 'Belden Brick', category: 'Brick', logo: 'BB' },
  { name: 'Acme Brick', category: 'Brick', logo: 'AB' },
  { name: 'Indiana Limestone', category: 'Stone', logo: 'IL' },
  { name: 'Eldorado Stone', category: 'Stone', logo: 'ES' },
  { name: 'Rock of Ages', category: 'Stone', logo: 'RA' },
  { name: 'Gate Precast', category: 'Precast', logo: 'GP' },
  { name: 'Metromont', category: 'Precast', logo: 'MM' },
  { name: 'James Hardie', category: 'Siding', logo: 'JH' },
  { name: 'CertainTeed', category: 'Siding', logo: 'CT' },
  { name: 'Vulcan Materials', category: 'Aggregates', logo: 'VM' },
  { name: 'Martin Marietta', category: 'Aggregates', logo: 'MM' },
  { name: 'Belgard', category: 'Hardscape', logo: 'BG' },
  { name: 'Versa-Lok', category: 'Hardscape', logo: 'VL' },
  { name: 'Garick', category: 'Landscape', logo: 'GK' },
  { name: 'Southwest Boulder', category: 'Landscape', logo: 'SB' },
  { name: 'Hohmann & Barnard', category: 'Accessories', logo: 'HB' },
  { name: 'Quikrete', category: 'Accessories', logo: 'QK' }
];

export const services = [
  {
    id: 'commercial',
    title: 'Commercial',
    description: 'Full-scale commercial masonry solutions for retail, office buildings, and industrial facilities. From ground-up construction to facade renovations.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    features: ['New Construction', 'Facade Installation', 'Large-Scale Projects', 'Project Management']
  },
  {
    id: 'custom-homes',
    title: 'Custom Homes',
    description: 'Bring your dream home to life with custom masonry work. Specialized in high-end residential projects with attention to architectural detail.',
    image: 'https://images.unsplash.com/photo-1755140584836-9771b5f51575?w=800',
    features: ['Custom Design', 'Premium Materials', 'Architectural Details', 'Luxury Finishes']
  },
  {
    id: 'residential',
    title: 'Residential',
    description: 'Quality masonry services for residential properties. From new builds to additions and exterior upgrades.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    features: ['New Construction', 'Additions', 'Exterior Upgrades', 'Patios & Walkways']
  },
  {
    id: 'chimney-repair',
    title: 'Chimney Repair',
    description: 'Expert chimney inspection, repair, and rebuilding services. Ensuring safety and structural integrity.',
    image: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=800',
    features: ['Inspection', 'Tuckpointing', 'Crown Repair', 'Rebuilding']
  },
  {
    id: 'brick-replacement',
    title: 'Brick Replacement',
    description: 'Professional brick replacement services matching existing materials. From single bricks to entire sections.',
    image: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800',
    features: ['Color Matching', 'Structural Assessment', 'Seamless Integration', 'Quality Workmanship']
  },
  {
    id: 'general-repair',
    title: 'General Repair Work',
    description: 'Comprehensive masonry repair services for all types of structures. Quick response and quality solutions.',
    image: 'https://images.unsplash.com/photo-1773601103174-306ffa23d441?w=800',
    features: ['Crack Repair', 'Waterproofing', 'Structural Fixes', 'Preventive Maintenance']
  },
  {
    id: 'restoration',
    title: 'Restoration / Repair Work',
    description: 'Historical masonry restoration and preservation. Maintaining the integrity of historic structures while meeting modern standards.',
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=800',
    features: ['Historic Preservation', 'Period-Accurate Methods', 'Careful Restoration', 'Documentation']
  }
];