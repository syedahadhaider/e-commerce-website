export type Product = {
  id: string;
  name: string;
  category: string;
  color: string;
  hex: string;
  price: number;
  image: string;
  tag: string;
  fit: string;
  material: string;
  description: string;
  details: string;
  care: string;
  sizes: string[];
  rank: number;
};
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
export const products: Product[] = [
  {
    id: 'heavyweight-hoodie',
    name: 'Heavyweight Hoodie',
    category: 'Sweatshirts',
    color: 'Washed black',
    hex: '#292929',
    price: 128,
    tag: 'CORE UNIFORM',
    fit: 'Relaxed',
    material: '450 GSM cotton fleece',
    description:
      'The one you reach for without thinking. Substantial cotton fleece, a generous hood, and a washed finish that only gets better.',
    details:
      'Dropped shoulders, kangaroo pocket, double-layer hood and ribbed cuffs.',
    care: 'Machine wash cold inside out. Air dry.',
    sizes,
    rank: 1,
    image: '/images/hoodie.jpg',
  },
  {
    id: 'essential-tee',
    name: 'Essential Box Tee',
    category: 'T-shirts',
    color: 'Chalk',
    hex: '#ecebe5',
    price: 48,
    tag: 'ESSENTIAL',
    fit: 'Boxy',
    material: '240 GSM cotton jersey',
    description:
      'A clean slate for your everyday. Dense cotton jersey with a dry hand feel, cut wide through the body with a neat, structured neckline.',
    details: 'Dropped shoulder, reinforced neck rib and a straight hem.',
    care: 'Machine wash cold. Reshape while damp.',
    sizes,
    rank: 2,
    image: '/images/white-tee.jpg',
  },
  {
    id: 'studio-jacket',
    name: 'Studio Work Jacket',
    category: 'Outerwear',
    color: 'Ink black',
    hex: '#17191b',
    price: 198,
    tag: 'STUDIO PICK',
    fit: 'Relaxed',
    material: '100% heavyweight cotton canvas',
    description:
      'Workwear roots. A new perspective. A substantial everyday layer with an easy silhouette and just the right amount of structure.',
    details: 'Button front, three utility pockets and adjustable cuffs.',
    care: 'Spot clean or gentle cold wash. Hang to dry.',
    sizes,
    rank: 3,
    image: '/images/jacket.jpg',
  },
  {
    id: 'utility-cargo',
    name: 'Utility Cargo Pant',
    category: 'Bottoms',
    color: 'Field olive',
    hex: '#6b6b4a',
    price: 138,
    tag: 'ROOM TO MOVE',
    fit: 'Relaxed',
    material: 'Cotton ripstop',
    description:
      'A purposeful shape with room for the unexpected. A relaxed leg and utility pockets for the things you carry.',
    details: 'Six-pocket construction, belt loops and reinforced seams.',
    care: 'Machine wash cold with similar colors. Air dry.',
    sizes: ['S', 'M', 'L', 'XL'],
    rank: 4,
    image: '/images/cargo.jpg',
  },
  {
    id: 'daily-crewneck',
    name: 'Daily Crewneck',
    category: 'Sweatshirts',
    color: 'Heather grey',
    hex: '#a8a8a8',
    price: 108,
    tag: 'CORE UNIFORM',
    fit: 'Relaxed',
    material: '400 GSM brushed cotton fleece',
    description:
      'Quiet confidence in sweatshirt form. Soft on the inside, substantial on the outside, with an easy shape that sits just right.',
    details: 'Ribbed neckline, cuffs and hem. Subtle tonal stitching.',
    care: 'Machine wash cold inside out. Lay flat to dry.',
    sizes,
    rank: 5,
    image: '/images/sweatshirt.jpg',
  },
  {
    id: 'washed-cap',
    name: 'Washed Five-Panel Cap',
    category: 'Accessories',
    color: 'Faded black',
    hex: '#414141',
    price: 38,
    tag: 'ESSENTIAL',
    fit: 'Adjustable',
    material: '100% washed cotton twill',
    description:
      'Your out-the-door essential. A softly structured five-panel cap with a lived-in finish and an adjustable back strap.',
    details: 'Curved brim, embroidered eyelets and adjustable closure.',
    care: 'Spot clean. Do not machine wash.',
    sizes: ['One size'],
    rank: 6,
    image: '/images/cap.jpg',
  },
  {
    id: 'transit-bag',
    name: 'Transit Shoulder Tote',
    category: 'Accessories',
    color: 'Graphite',
    hex: '#4b4b4b',
    price: 68,
    tag: 'DAILY CARRY',
    fit: 'One size',
    material: 'Heavyweight cotton canvas',
    description:
      'Everything you need, nothing in your way. An effortless everyday carry with a generous main compartment and a long shoulder strap.',
    details: 'Reinforced handles, wide shoulder strap. 40 × 35 × 10 cm.',
    care: 'Spot clean with a damp cloth.',
    sizes: ['One size'],
    rank: 7,
    image: '/images/bag.jpg',
  },
  {
    id: 'after-hours-tee',
    name: 'After Hours Tee',
    category: 'T-shirts',
    color: 'Carbon',
    hex: '#242424',
    price: 58,
    tag: 'AFTER HOURS',
    fit: 'Boxy',
    material: '260 GSM heavyweight cotton',
    description:
      'For the hours that belong to you. A heavyweight box tee in deep carbon with a substantial neckline and a clean, easy drape.',
    details:
      'Wide body, slightly cropped length and reinforced shoulder seams.',
    care: 'Machine wash cold inside out. Air dry.',
    sizes,
    rank: 8,
    image: '/images/black-tee.jpg',
  },
];
