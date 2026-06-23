export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  socials: { instagram: string; twitter: string; substack: string };
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  altitude: string;
  duration: string;
  author: BlogAuthor;
  images: string[];
  views: string;
  tags: string[];
  difficulty: 'Easy' | 'Moderate' | 'Strenuous' | 'Demanding';
  bestSeason: string;
  gearList: string[];
  routeCoordinates: { name: string; alt: string }[];
}

export interface CommunityTrail {
  id: string;
  title: string;
  location: string;
  altitude: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  description: string;
  author: string;
  coordinates: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  badge: string;
  badgeColor: string;
  bio: string;
  tripsCount: number;
}

export interface CommunityThread {
  id: string;
  title: string;
  author: { name: string; avatar: string };
  category: 'Gear' | 'Routes' | 'Homestays' | 'Permits';
  replies: number;
  upvotes: number;
  timeAgo: string;
}

export interface LocalRecipe {
  id: string;
  name: string;
  image: string;
  origin: string;
  ingredients: string[];
  steps: string[];
}

export const blogLogs: BlogItem[] = [
  {
    id: 'chopta-meadows',
    title: 'The Silent Meadows of Chopta: A Winter Solitude Log',
    excerpt: 'Stepping off the grid into deep pine woodlands covered in thick snow. This is the story of discovering pristine silent ridges untouched by mainstream tourism.',
    content: `
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        There is a unique quality to silence when the thermometer drops below freezing in the Garhwal Himalayas. The air becomes heavy, carrying the scent of frozen cedar pine. In Chopta, known widely as the "Switzerland of Uttarakhand," the onset of winter transforms the rolling green meadows (Buqyals) into a vast, silent wilderness of white.
      </p>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        Our journey began at Sari Village, from where we hiked up to Deoria Tal. The reflections of the Chaukhamba peaks in the semi-frozen lake set a majestic tone. Continuing toward Chopta, we left behind the motorable road and walked along trails blanketed in fresh, powdery snow. Every step was deliberate, marked only by the crunch beneath our snow cleats and the occasional cry of a monal pheasant soaring through the canopy.
      </p>
      <blockquote class="border-l-4 border-emerald-500 pl-4 py-2 my-6 italic text-gray-800 font-medium">
        "In the winter mountains, self-reliance is not a preference; it is the currency of survival. The cold does not forgive, but the visual purity it brings is worth every freezing breath."
      </blockquote>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        Reaching the high meadows of Chopta at 2,680 meters, we pitched our geodesic insulated dome platforms. As night fell, the temperature plummeted to -7°C. Yet, stepping out of the dome was like entering a celestial theater. Free from light pollution, the Milky Way was painted vividly across the sky, wrapping around the dark silhouetted peaks of Tungnath. It is a solitude that humbles you, proving that the best parts of the Himalayas are often those reached after the roads end.
      </p>
    `,
    altitude: '2,680m',
    duration: '3 Days Trek',
    author: {
      name: 'Aarav Semwal',
      role: 'Alpine Photographer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      socials: { instagram: '#', twitter: '#', substack: '#' }
    },
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
    ],
    views: '12.4K',
    tags: ['Chopta', 'Garhwal', 'Solo Trek'],
    difficulty: 'Moderate',
    bestSeason: 'December to March',
    gearList: ['Cleats / Microspikes', 'Insulated Winter Parka', '-10°C Sleeping Bag', 'Alpine Staves', 'Headlamp with spare batteries'],
    routeCoordinates: [
      { name: 'Sari Village Base', alt: '2,000m' },
      { name: 'Deoria Tal camp', alt: '2,438m' },
      { name: 'Chopta Meadows', alt: '2,680m' },
      { name: 'Tungnath Temple Peak', alt: '3,680m' }
    ]
  },
  {
    id: 'almora-retreat',
    title: 'Discovering Secret Wild Orchards in Almora',
    excerpt: 'Living alongside local Kumaoni farmers in ancestral stone houses. A journey into sustainable organic farming, slow forest bathing, and traditional local cuisine.',
    content: `
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        Almora has long been the cultural heart of the Kumaon region. While tourists throng the lake districts of Nainital, the higher ridge hamlets of Almora offer something far more raw and experiential: wild orchards, ancient slate-roofed stone homestays, and a pace of life that aligns directly with the sun.
      </p>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        We stayed with the Negi family in a beautifully preserved, 90-year-old homestead constructed with hand-carved deodar lintels and local mud mortar. Mornings here start with a cup of fresh rhododendron tea, followed by orchard maintenance. Harvesting wild apples and plums beside Kumaoni elders teaches you the value of patient, organic farming in terraced fields.
      </p>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        In the afternoons, we walked through thick oak and pine forests, participating in local forest conservation hikes. The highlighting experience of Kumaoni slow travel is the community kitchen. We gathered around the clay stove (Chulha) as the grandmother prepared traditional black soybean soup (Bhatt ki Churkani) and millet flatbreads. It is food that tastes of the mountains—hearty, earthy, and warm.
      </p>
    `,
    altitude: '1,600m',
    duration: '5 Days Rest',
    author: {
      name: 'Priyanka Rawat',
      role: 'Cultural Gastronomist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      socials: { instagram: '#', twitter: '#', substack: '#' }
    },
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ],
    views: '9.8K',
    tags: ['Almora', 'Kumaon', 'Organic'],
    difficulty: 'Easy',
    bestSeason: 'April to October',
    gearList: ['Daypack (20L)', 'Light fleece jacket', 'Sturdy walking shoes', 'Journal notebook', 'Refillable water bottle'],
    routeCoordinates: [
      { name: 'Almora Market Base', alt: '1,600m' },
      { name: 'Eco-Orchard Ridge', alt: '1,720m' },
      { name: 'Pine Forest Trail', alt: '1,650m' }
    ]
  },
  {
    id: 'auli-slopes',
    title: 'Living Under the Panchachuli Stars in Auli',
    excerpt: 'An expedition report detailing the sub-zero stargazing conditions, astrophotography techniques, and building fires underneath high Himalayan peaks.',
    content: `
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        Auli is famously known for its pristine ski slopes, but its high-altitude vantage points make it one of the absolute best dark-sky observatories in the subcontinent. Perched at 3,050 meters, the view looking out onto Nanda Devi, Trishul, and the Panchachuli range is breathtaking by day, and otherworldly by night.
      </p>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        As the ski elevators shut down, we packed our camera gear and hiked to a high alpine meadow ridge. Setting up astrophotography trackers in sub-zero winds is a test of patience. The air at this height is exceptionally thin and dry, creating crystal-clear atmospheric transparency.
      </p>
      <blockquote class="border-l-4 border-emerald-500 pl-4 py-2 my-6 italic text-gray-800 font-medium">
        "At 3,000 meters, the sky doesn't look like a ceiling anymore. It looks like an open window into the deep universe, framed by the white walls of the Himalayas."
      </blockquote>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        We kept warm by a small stone-lined fire pit, monitoring our exposures as the camera captured the arc of the Milky Way rising over Trishul peak. The resulting images detailed the cosmic dust clouds in rich, vibrant hues. It is an experience that reminds us of our place in the cosmos, set against the permanent scale of the high peaks.
      </p>
    `,
    altitude: '3,050m',
    duration: '4 Days Camp',
    author: {
      name: 'Vikram Negi',
      role: 'Astro-Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      socials: { instagram: '#', twitter: '#', substack: '#' }
    },
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80'
    ],
    views: '15.6K',
    tags: ['Auli', 'Stargazing', 'Telescope'],
    difficulty: 'Moderate',
    bestSeason: 'October to February',
    gearList: ['Heavy tripod', 'Star tracker mount', 'Wide aperture lens', 'Thermal gloves', 'Heated boots'],
    routeCoordinates: [
      { name: 'Joshimath Base', alt: '1,875m' },
      { name: 'Auli Ski Slopes', alt: '2,500m' },
      { name: 'Gorson Bugyal Ridge', alt: '3,050m' }
    ]
  },
  {
    id: 'munsiyari-secrets',
    title: 'Munsiyari: The High-Altitude Borderlands',
    excerpt: 'An expedition log exploring Johar Valley, ancient trade routes to Tibet, and viewing the majestic Panchachuli peaks right from a stone hearth.',
    content: `
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        Munsiyari sits like a sentinel at the edge of the Indian border, where the Gori River cuts a path between colossal mountains. Historically the gateway of the ancient trans-Himalayan salt route to Tibet, it remains a sanctuary of Kumaoni heritage, raw weather, and deep valleys.
      </p>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        We hiked the legendary Khaliya Top route, climbing through dense rhododendron and alpine forests to reach an open ridge at 3,500 meters. The panoramic view of the five peaks of Panchachuli from this altitude is colossal. Local guides shared tales of trade caravans that crossed these high passes centuries ago.
      </p>
      <p class="text-base text-gray-700 leading-relaxed mb-6">
        Returning to the stone lodge at night, we huddled around a roaring fireplace, eating hemp-seed chutney and local red rice. The combination of absolute isolation, thin mountain air, and rich cultural legacy makes Munsiyari an unforgettable slow-travel destination.
      </p>
    `,
    altitude: '2,200m',
    duration: '6 Days Trek',
    author: {
      name: 'Vikram Negi',
      role: 'Astro-Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      socials: { instagram: '#', twitter: '#', substack: '#' }
    },
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1920&q=80'
    ],
    views: '8.4K',
    tags: ['Munsiyari', 'Panchachuli', 'Borderlands'],
    difficulty: 'Strenuous',
    bestSeason: 'September to June',
    gearList: ['Hiking poles', 'Rainproof poncho', 'Gore-Tex boots', 'Windproof jacket', 'Oximeter'],
    routeCoordinates: [
      { name: 'Munsiyari Town', alt: '2,200m' },
      { name: 'Balati Bend starting point', alt: '2,450m' },
      { name: 'Khaliya Alpine Meadow', alt: '3,250m' },
      { name: 'Khaliya Peak Summit', alt: '3,500m' }
    ]
  }
];

export const communityTrails: CommunityTrail[] = [
  {
    id: 'trail-1',
    title: 'Kartik Swami Temple Ridge',
    location: 'Rudraprayag, Uttarakhand',
    altitude: '3,050m',
    difficulty: 'Moderate',
    description: 'A stunning ridge trail leading to the ancient temple of Kartik Swami. Offers 360-degree views of Kedarnath, Chaukhamba, and Trishul summits.',
    author: 'Aarav Semwal',
    coordinates: '30.4725° N, 78.9664° E'
  },
  {
    id: 'trail-2',
    title: 'Khaliya Top Ridge Route',
    location: 'Munsiyari, Uttarakhand',
    altitude: '3,500m',
    difficulty: 'Hard',
    description: 'Steep climb through dense oak and rhododendron forest opening into high alpine meadows. Unobstructed, direct front views of Panchachuli.',
    author: 'Vikram Negi',
    coordinates: '30.0768° N, 80.2215° E'
  },
  {
    id: 'trail-3',
    title: 'Deoria Tal to Chopta Forest Trail',
    location: 'Chopta, Uttarakhand',
    altitude: '2,680m',
    difficulty: 'Moderate',
    description: 'A pristine canopy-covered trail going through Kedarnath Musk Deer Sanctuary. Best for birdwatching, winter snow trekking, and viewing peak reflections.',
    author: 'Priyanka Rawat',
    coordinates: '30.4851° N, 79.2087° E'
  }
];

export const communityMembers: CommunityMember[] = [
  {
    id: 'member-1',
    name: 'Aarav Semwal',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'Alpine Photographer',
    badge: 'Expedition Leader',
    badgeColor: 'bg-emerald-500 text-white',
    bio: 'Photographer and mountaineer mapping high-altitude passes in Garhwal. Leads winter photography expeditions.',
    tripsCount: 42
  },
  {
    id: 'member-2',
    name: 'Priyanka Rawat',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'Cultural Gastronomist',
    badge: 'Local Legend',
    badgeColor: 'bg-amber-500 text-white',
    bio: 'Preserving Himalayan slow food recipes and oral folk traditions. Curates agricultural farm stays.',
    tripsCount: 29
  },
  {
    id: 'member-3',
    name: 'Vikram Negi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'Astro-Photographer',
    badge: 'Stargazer Master',
    badgeColor: 'bg-indigo-600 text-white',
    bio: 'Astrophotographer tracking clear-sky anomalies in Kumaon valleys. Creator of alpine telescope camps.',
    tripsCount: 35
  }
];

export const communityThreads: CommunityThread[] = [
  {
    id: 'thread-1',
    title: 'Is Jalori Pass trek open for self-guided snow hiking in early January?',
    author: { name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80' },
    category: 'Routes',
    replies: 14,
    upvotes: 28,
    timeAgo: '4 hours ago'
  },
  {
    id: 'thread-2',
    title: 'Best heavy winter sleeping bags rated for -15°C in high meadow camps?',
    author: { name: 'Meera Sen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80' },
    category: 'Gear',
    replies: 22,
    upvotes: 45,
    timeAgo: '1 day ago'
  },
  {
    id: 'thread-3',
    title: 'Forest entry permit checklist and office location in Joshimath for Nanda Devi sanctuary.',
    author: { name: 'Kabir Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&q=80' },
    category: 'Permits',
    replies: 9,
    upvotes: 18,
    timeAgo: '3 days ago'
  }
];

export const localRecipes: LocalRecipe[] = [
  {
    id: 'recipe-1',
    name: 'Bhaang ki Chutney',
    origin: 'Kumaon Valley',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
    ingredients: [
      'Hemp seeds (Bhaang) - 50g',
      'Fresh mint leaves - 1 cup',
      'Fresh coriander - 1/2 cup',
      'Lemon juice - 2 tbsp',
      'Green chilies - 2',
      'Salt & roasted cumin seeds'
    ],
    steps: [
      'Gently roast the hemp seeds in a dry pan until they crackle and release a nutty aroma.',
      'Allow seeds to cool, then grind them into a smooth dry powder.',
      'Blend mint, coriander, green chilies, cumin, salt, and water with the hemp powder.',
      'Stir in fresh lemon juice and serve as a tangy accompaniment to main meals.'
    ]
  },
  {
    id: 'recipe-2',
    name: 'Millet Siddu',
    origin: 'Kullu Valley / Outer Seraj',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
    ingredients: [
      'Finger millet (Madua) flour - 250g',
      'Wheat flour - 100g',
      'Yeast - 1 tsp',
      'Poppy seeds (Khashkhash) paste - 1/2 cup',
      'Chopped walnuts & green chilies',
      'Spices & ghee'
    ],
    steps: [
      'Mix millet flour, wheat flour, yeast, and warm water. Knead into a soft dough and let rise.',
      'Prepare filling by grinding poppy seeds, walnuts, green chilies, coriander, and spices.',
      'Roll dough into thick circles, place filling inside, fold and seal the edges.',
      'Steam for 20-25 minutes. Cut into thick slices, pour hot melted ghee on top and serve.'
    ]
  }
];
