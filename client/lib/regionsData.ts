export interface HiddenGem {
  name: string;
  desc: string;
}

export interface RegionalProperty {
  id: string;
  title: string;
  location: string;
  rating: string;
  reviewsCount: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number;
  badge: string | null;
  image: string;
  amenities: string[];
}

export interface RegionItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  elevation: string;
  bestTime: string;
  temperature: {
    summer: string;
    winter: string;
  };
  closestHub: {
    name: string;
    distance: string;
  };
  description: string;
  longDescription: string;
  hiddenGems: HiddenGem[];
  localDelicacies: string[];
  featuredPackageIds: string[];
  featuredStayIds: string[];
}

// 1. Shared Himalayan Stays Database (Baseras)
export const regionalPropertiesList: RegionalProperty[] = [
  {
    id: 'tungnath-eco-glamp',
    title: 'Tungnath Eco-Glamping Meadows',
    location: 'Chopta, Uttarakhand',
    rating: '4.95',
    reviewsCount: 88,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    pricePerNight: 6500,
    badge: 'Eco Glamping',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
    amenities: ['Bonfire Pit', 'Traditional Dining', 'Heating', 'Nature Guide']
  },
  {
    id: 'panchachuli-stone-lodge',
    title: 'Panchachuli Panoramic Stone Lodge',
    location: 'Munsiyari, Uttarakhand',
    rating: '5.0',
    reviewsCount: 56,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    pricePerNight: 7800,
    badge: 'Stargazer Deck',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop',
    amenities: ['Private Telescope', 'Fireplace', 'Heated Bedding', 'Ayurvedic Tea']
  },
  {
    id: 'nanda-devi-ski-chalet',
    title: 'Nanda Devi Ski & Alpine Chalet',
    location: 'Auli, Uttarakhand',
    rating: '4.88',
    reviewsCount: 74,
    guests: 6,
    bedrooms: 3,
    bathrooms: 4,
    pricePerNight: 9500,
    badge: 'Ski-in Ski-out',
    image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800&auto=format&fit=crop',
    amenities: ['Ski Locker', 'Sauna Access', 'Jacuzzi Tub', 'Himalayan Coffee Bar']
  },
  {
    id: 'trishul-heritage-homestead',
    title: 'Trishul View Ancestral Homestead',
    location: 'Kausani, Uttarakhand',
    rating: '4.92',
    reviewsCount: 42,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    pricePerNight: 5400,
    badge: 'Cultural Heritage',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
    amenities: ['Clay-oven Kitchen', 'Organic Tea Farm Walk', 'Yoga Deck', 'Local Guide']
  }
];

// 2. Comprehensive Regions Catalog
export const regionsList: RegionItem[] = [
  {
    id: 'munsiyari',
    num: '01',
    title: 'Munsiyari',
    subtitle: 'Sunset over Panchachuli peaks.',
    bannerImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600&auto=format&fit=crop',
    elevation: '2,200m',
    bestTime: 'Oct to May',
    temperature: {
      summer: '10°C to 25°C',
      winter: '-3°C to 12°C'
    },
    closestHub: {
      name: 'Kathgodam Railway Station',
      distance: '275 km (approx. 9.5 hours drive)'
    },
    description: 'A high-altitude paradise tucked away under the Panchachuli peaks. Known for its clear nights, ancient pathways, and raw mountain aesthetics.',
    longDescription: 'Tucked away in the remote borders of Pithoragarh, Munsiyari stands as a spectacular high-altitude portal directly facing the five colossal summits of the Panchachuli range. Literally translating to "a place with snow," Munsiyari offers spectacular slow-travel opportunities—from quiet walks through ancient oak forests to dynamic celestial stargazing under crystal-clear night skies with zero light pollution.',
    hiddenGems: [
      { name: 'Khalia Top', desc: 'A moderate alpine ridge trek leading to a massive 3,200m viewpoint that reveals a complete panorama of the Kumaon high peaks.' },
      { name: 'Maheshwari Kund', desc: 'A deep, serene mountain lake rich in local myth, enclosed within thick rhododendron glades.' },
      { name: 'Birthi Falls', desc: 'A colossal 125m waterfall cascading over sheer cliffs, located a short scenic hike from the mountain pass roads.' }
    ],
    localDelicacies: ['Bhang ki Chutney (hemp seed relish)', 'Local Mandua Roti (finger millet bread)', 'Pahadi Gehat Dal (high-elevation horse gram soup)'],
    featuredPackageIds: ['munsiyari-sky'],
    featuredStayIds: ['panchachuli-stone-lodge']
  },
  {
    id: 'chopta',
    num: '02',
    title: 'Chopta',
    subtitle: "India's serene mini Switzerland.",
    bannerImage: 'https://images.unsplash.com/photo-1589136777351-fd6e473e09a5?q=80&w=1600&auto=format&fit=crop',
    elevation: '2,680m',
    bestTime: 'Apr to Jun, Sep to Nov',
    temperature: {
      summer: '12°C to 24°C',
      winter: '-5°C to 10°C'
    },
    closestHub: {
      name: 'Dehradun Jolly Grant Airport',
      distance: '180 km (approx. 6.5 hours drive)'
    },
    description: 'An alpine meadow haven nestled within the Kedarnath Wildlife Sanctuary. Home to ancient stone trails and the highest temple summit.',
    longDescription: 'Chopta is a pristine, untouched stretch of lush alpine meadows (Bugyals) and dense conifer woodlands in the Garhwal Himalayas. Far removed from commercialized tourism, it serves as the base for the sacred stone-laid trail to Tungnath Temple and Chandrashila Peak. Here, slow living consists of waking to golden chaukhamba reflections and enjoying slow organic meals over crackling stove fires.',
    hiddenGems: [
      { name: 'Tungnath Summit', desc: 'The highest Shiva temple in the world (3,680m), sitting along a scenic paved stone ridge trail.' },
      { name: 'Chandrashila Peak', desc: 'A 4,000m summit resting directly above Tungnath, offering 360-degree views of Trishul, Chaukhamba, and Nanda Devi.' },
      { name: 'Deoriatal Lake', desc: 'A mystical high-altitude lake reflecting the Chaukhamba massif in its crystal-still green waters.' }
    ],
    localDelicacies: ['Gahat ke Paranthe (stuffed horse gram flatbread)', 'Rhododendron Squash (sweet mountain flower nectar)', 'Pahadi Lai (local bitter mustard greens)'],
    featuredPackageIds: ['chopta-trek'],
    featuredStayIds: ['tungnath-eco-glamp']
  },
  {
    id: 'auli',
    num: '03',
    title: 'Auli',
    subtitle: 'Pristine, snow-draped ski slopes.',
    bannerImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1600&auto=format&fit=crop',
    elevation: '2,800m',
    bestTime: 'Dec to Mar (Snow), Jul to Oct (Meadows)',
    temperature: {
      summer: '10°C to 20°C',
      winter: '-8°C to 8°C'
    },
    closestHub: {
      name: 'Rishikesh Railway Station',
      distance: '235 km (approx. 7.5 hours drive)'
    },
    description: 'India’s premier ski destination surrounded by giant Himalayan massifs. Featuring lush summer meadows and crystal blue artificial high reservoirs.',
    longDescription: 'Perched in the Chamoli district, Auli is a glorious meadow-shelf flanked by giant Himalayan peaks, most notably the colossal pyramid of Mount Nanda Devi. It is globally renowned for its sweeping ski slopes in winter, and transforms into a lush, flower-strewn green alpine pasture during the monsoon. Access is gained via the iconic Joshimath cable ropeway.',
    hiddenGems: [
      { name: 'Auli Artificial Lake', desc: 'One of the world’s highest man-made lakes, designed to power snowguns, reflecting Nanda Devi beautifully.' },
      { name: 'Gorson Bugyal', desc: 'A colossal green meadow trail starting right above the Auli slopes, leading through oak woodlands.' },
      { name: 'Chattarkund Lake', desc: 'A tiny sweet-water pond surrounded by extremely dense forest, a short distance off the main trail.' }
    ],
    localDelicacies: ['Dubuk (slow-cooked high altitude black gram paste)', 'Kandali saag (nettle leaf stew)', 'Bal Mithai (roasted milk fudge coated in sugar balls)'],
    featuredPackageIds: ['chopta-trek'],
    featuredStayIds: ['nanda-devi-ski-chalet']
  },
  {
    id: 'kausani',
    num: '04',
    title: 'Kausani',
    subtitle: '300km panoramic peak views.',
    bannerImage: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1600&auto=format&fit=crop',
    elevation: '1,890m',
    bestTime: 'Sep to May',
    temperature: {
      summer: '15°C to 28°C',
      winter: '0°C to 15°C'
    },
    closestHub: {
      name: 'Kathgodam Railway Station',
      distance: '135 km (approx. 4.5 hours drive)'
    },
    description: 'A quiet pine-wooded ridge offering an uninterrupted 300km panorama of the high snow peaks. The Switzerland of India.',
    longDescription: 'Kausani sits peacefully on a narrow pine forest ridge, overlooking the lush Katyur Valley on one side and an uninterrupted 300km wall of towering Himalayan summits on the other—including Trisul, Nanda Devi, and Panchachuli. Deeply admired by Mahatma Gandhi, Kausani is a slow-travel sanctuary famous for organic tea gardens and handloom shawl weaving centers.',
    hiddenGems: [
      { name: 'Kausani Tea Estate', desc: 'Lush organic tea plantations cascading down terraced valley slopes, famous for high-elevation aromatic leaves.' },
      { name: 'Anasakti Ashram', desc: 'The quiet hillside ashram where Gandhi wrote his commentaries, hosting peaceful daily prayer circles facing the peaks.' },
      { name: 'Rudradhari Caves & Falls', desc: 'An ancient cave temple dedicated to Shiva and Vishnu, located amidst natural woodland waterfalls.' }
    ],
    localDelicacies: ['Bhatt ki Churkani (traditional black soybean curry)', 'Mandua Momos (millet flour dumplings)', 'Local Ginger Herb Chai'],
    featuredPackageIds: ['almora-wellness'],
    featuredStayIds: ['trishul-heritage-homestead']
  }
];
