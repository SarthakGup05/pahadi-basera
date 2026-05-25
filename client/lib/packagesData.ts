export interface PackageItem {
  id: string;
  num: string;
  title: string;
  region: 'Uttarakhand' | 'Himachal' | 'Kashmir' | 'Sikkim';
  location: string;
  duration: string;
  durationDays: number;
  vibe: 'Adventure' | 'Wellness' | 'Celestial' | 'Heritage';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  price: number;
  maxGuests: number;
  image: string;
  badge: string;
  description: string;
  longDescription: string;
  amenities: string[];
  includes: { name: string; iconName: string }[];
  altitude: string;
  bestTime: string;
  itinerary: { day: number; title: string; desc: string }[];
}

export const packagesList: PackageItem[] = [
  {
    id: 'chopta-trek',
    num: '01',
    title: 'Chopta-Tungnath Summit Trek',
    region: 'Uttarakhand',
    location: 'Chopta, Uttarakhand',
    duration: '4 Days / 3 Nights',
    durationDays: 4,
    vibe: 'Adventure',
    difficulty: 'Moderate',
    price: 12499,
    maxGuests: 6,
    image: 'https://images.unsplash.com/photo-1589136777351-fd6e473e09a5?q=80&w=800&auto=format&fit=crop',
    badge: "Trekker's Choice",
    altitude: '3,680m',
    bestTime: 'Sep to Nov, Jan to Mar',
    description: "Conquer the sacred ridge trail leading to the world's highest Shiva temple. Awaken to breathtaking sunrises casting golden hues on Mount Trishul and Nanda Devi.",
    longDescription: "Venture deep into the pristine alpine glades of Kedarnath Wildlife Sanctuary. The journey takes you along stone-laid trails lined with thick rhododendrons and ancient mossy conifers, leading to the world's highest Shiva temple. Awaken to breathtaking sunrises casting golden hues on Mount Trishul, Nanda Devi, and Chaukhamba. Experience authentic slow living in premium eco-resort glamping setups.",
    amenities: ['Professional Guide', 'Premium Alpine Tents', 'All Organic Meals'],
    includes: [
      { name: 'Transit', iconName: 'Car' },
      { name: 'Meals', iconName: 'UtensilsCrossed' },
      { name: 'Shelter', iconName: 'Tent' },
      { name: 'Guide', iconName: 'Guide' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Chopta Basecamp', desc: 'Arrive at our luxury alpine camp in Chopta. Settle into premium tents, take an acclimatization walk through the rhododendron glades, and gather for a traditional wood-fire dinner.' },
      { day: 2, title: 'Sacred Ascent to Tungnath & Chandrashila Peak', desc: 'An early morning trek along the ancient paved stone trail to Tungnath Temple (3,680m). Continue to Chandrashila Summit (4,000m) for a stunning 360-degree panorama of the Himalayan snow peaks.' },
      { day: 3, title: 'Deoriatal Lake Trek & Alpine Meadow Meditations', desc: 'Drive to Sari village and hike up to the mystical Deoriatal Lake. Experience a tranquil afternoon of outdoor silent meditation facing the reflection of Chaukhamba in the mirror-like waters.' },
      { day: 4, title: 'Celestial Sunrise Gaze & Departure', desc: 'Wake up to a golden celestial sunrise on Trishul. Savor a hearty organic millet breakfast, pack your gear, and take your private transit back to Haridwar/Dehradun.' }
    ]
  },
  {
    id: 'almora-wellness',
    num: '02',
    title: 'Bohemian Wellness & Yoga Retreat',
    region: 'Uttarakhand',
    location: 'Almora, Uttarakhand',
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    vibe: 'Wellness',
    difficulty: 'Easy',
    price: 18999,
    maxGuests: 4,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    badge: 'Deep Rejuvenation',
    altitude: '1,860m',
    bestTime: 'Year-Round',
    description: 'Heal your body and soul within pristine pine forest glades. Features daily sunrise Hatha yoga sessions and quiet meditation walks along misty mountain ridges.',
    longDescription: 'Heal your body and soul within pristine pine forest glades facing the high snow peaks of Nanda Devi. Savor traditional Kumaoni organic dishes prepared on open clay hearths, receive customized Ayurvedic consultations, and take quiet forest walks to reconnect with ancestral mountain rhythms.',
    amenities: ['Certified Yoga Guru', 'Farm-to-Table Dining', 'Forest Sauna Session'],
    includes: [
      { name: 'Transit', iconName: 'Car' },
      { name: 'Vegan Meals', iconName: 'UtensilsCrossed' },
      { name: 'Glass Cabin', iconName: 'Tent' },
      { name: 'Wellness', iconName: 'Sparkles' }
    ],
    itinerary: [
      { day: 1, title: 'Welcome Sound-Bath & Silent Settling', desc: 'Arrive at our stone-clad ridge villa. Participate in a welcome botanical oil inhalation, settle into your wooden chalet, and enjoy a grounding sunset crystal sound bath.' },
      { day: 2, title: 'Sunrise Hatha & Kumaoni Culinary Workshop', desc: 'Begin with daily sunrise Hatha yoga in the pine glades. Afternoon traditional wood-fired Kumaoni culinary workshop using hand-ground local herbs and home-churned butter.' },
      { day: 3, title: 'Silent Forest Ridge Walk & Herbal Steam', desc: 'Embark on a mindful silent hiking path along the ridge lines. Complete the afternoon with a private session in our local cedar wood sauna and customized herbal compression therapy.' },
      { day: 4, title: 'Pranayama Masterclass & Astronomy Gaze', desc: 'Deepen your breathing with an advanced morning Pranayama session. Spend the evening under the incredibly clear night skies on our private stargazing deck.' },
      { day: 5, title: 'Gratitude Fire Circle & Farewell', desc: 'Conclude your healing journey with a traditional sun fire gratitude ceremony, exchange journals, and enjoy a farm-to-table organic brunch before check-out.' }
    ]
  },
  {
    id: 'munsiyari-sky',
    num: '03',
    title: 'Munsiyari Celestial Sky Escapade',
    region: 'Uttarakhand',
    location: 'Munsiyari, Uttarakhand',
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    vibe: 'Celestial',
    difficulty: 'Easy',
    price: 24500,
    maxGuests: 4,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    badge: 'Stargazer Edition',
    altitude: '2,200m',
    bestTime: 'Oct to May',
    description: 'Retreat to a high-altitude sanctuary facing the colossal Panchachuli Peaks. Gaze deep into the cosmos from our private stargazing deck equipped with a high-end telescope.',
    longDescription: 'Retreat to a high-altitude stone cabin directly facing the colossal five peaks of the Panchachuli range. Designed specifically for astronomy lovers and astrophotographers, this experiential package pairs private, computer-guided telescopic viewings with quiet high-altitude slow travel.',
    amenities: ['Astrophotography Guide', 'Private Telescope', 'Kumaoni Heritage Dining'],
    includes: [
      { name: 'Chauffeur', iconName: 'Car' },
      { name: 'Dining', iconName: 'UtensilsCrossed' },
      { name: 'Ridge Villa', iconName: 'Tent' },
      { name: 'Telescope', iconName: 'Coffee' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival at the Panchachuli Sanctuary', desc: 'Take a scenic hill ride up to Munsiyari. Check in to our bespoke stone lodge, warm up by the stone fireplace, and get your first stunning sunset look at the colossus peaks.' },
      { day: 2, title: 'Astrophotography Setup & Heritage Walk', desc: 'Explore the local traditional villages of Munsiyari. In the afternoon, receive an introductory astrophotography masterclass to calibrate camera sensors and telescope settings.' },
      { day: 3, title: 'High Peak Hike & Deep Cosmic Gazing', desc: 'Take a moderate hike to Khalia Top (3,200m) for sweeping views. Return to the lodge for a deep sky astronomy viewing of nebulae and star clusters under zero light pollution.' },
      { day: 4, title: 'Glacier Stream Picnic & Local Wool Crafts', desc: 'Enjoy a picnic lunch by a cold glacier-fed stream. Spend the afternoon meeting local Kumaoni weavers and learn the art of traditional angora wool hand-weaving.' },
      { day: 5, title: 'Milam Valley Views & Kumaoni Heritage Feast', desc: 'Gaze into the legendary Milam valley gorge. Savor a 7-course Kumaoni heritage dinner featuring locally gathered wild spices, hand-churned dairy, and organic high-altitude millets.' },
      { day: 6, title: 'Golden Peak Sunset & Departure', desc: 'Catch a glorious golden morning sunrise over the five peaks, enjoy a fresh apple juice breakfast, and return via private chauffeur transit.' }
    ]
  },
  {
    id: 'spiti-overland',
    num: '04',
    title: 'Spiti Valley Cosmic Overland',
    region: 'Himachal',
    location: 'Spiti Valley, Himachal Pradesh',
    duration: '8 Days / 7 Nights',
    durationDays: 8,
    vibe: 'Adventure',
    difficulty: 'Hard',
    price: 29999,
    maxGuests: 8,
    image: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?q=80&w=800&auto=format&fit=crop',
    badge: "Explorer's Edition",
    altitude: '4,270m',
    bestTime: 'June to September',
    description: 'Embark on an epic high-altitude road journey through cold desert plains and colossal peaks. Gaze deep into crystal night skies, discover monasteries clinging to cliffs, and stay in traditional homes.',
    longDescription: 'Embark on an epic high-altitude road journey through cold desert plains and colossal peaks. Traverse the highest motorable passes, discover 1000-year-old monasteries clinging to sheer cliffs, and share ancient stories with local families in mud-brick homestays.',
    amenities: [
      '4x4 Specialized SUV Transit',
      'Warm Traditional Mud-Brick Stays',
      'Local Monastic Guide & Historian',
      'All Inner Line Permits Handled',
      'Organic Spitian Barley Gastronomy'
    ],
    includes: [
      { name: '4x4 SUV', iconName: 'Car' },
      { name: 'Local Meals', iconName: 'UtensilsCrossed' },
      { name: 'Homestays', iconName: 'Tent' },
      { name: 'Spiti Guide', iconName: 'Guide' }
    ],
    itinerary: [
      { day: 1, title: 'Drive from Manali through Spiti Gates', desc: 'Start your expedition from Manali, driving through the Rohtang Pass tunnel and across the stunning Kunzum Pass (4,590m) to reach Kaza. Overnight in Spitian luxury tents.' },
      { day: 2, title: 'Key Monastery Exploration & Kibber Walk', desc: 'Visit Key Monastery, a magnificent cliffside spiritual center. Walk to the high-altitude village of Kibber (4,270m) and watch for rare Himalayan blue sheep.' },
      { day: 3, title: 'Dhankar Cliff Fort & Pin Valley Safari', desc: 'Journey to the ancient monastery fort of Dhankar, perched incredibly on mud-spires. Continue to the green pastures of Pin Valley, home to Ibex and snow leopards.' },
      { day: 4, title: 'Highest Post Office at Hikkim & Langza Buddha', desc: 'Send a postcard from the world’s highest post office in Hikkim (4,400m). Hike to Langza to view the massive golden Buddha statue and search for ancient marine fossils.' },
      { day: 5, title: 'Tabo Monastery & Mud-Brick Homestay Cooking', desc: 'Explore the Tabo Cave Monasteries (established 996 AD), known as the Ajanta of the Himalayas. Participate in a traditional barley flour bread culinary class at our local homestay.' },
      { day: 6, title: 'Lalung Village Heritage & Local Story Circle', desc: 'Retreat to the hidden hamlet of Lalung. Gather around the clay stove with village elders to hear local stories of spirits, deities, and trans-Himalayan caravans.' },
      { day: 7, title: 'Chandratal Lake Wilderness Glamping', desc: 'Drive to the pristine crescent-shaped Chandratal Lake (Lake of the Moon). Glamp under a colossal dome of billions of shining stars reflecting in the water.' },
      { day: 8, title: 'Rohtang Return to Manali', desc: 'Take a final rugged scenic drive back across the passes to Manali, culminating in a celebration dinner in Old Manali.' }
    ]
  },
  {
    id: 'dharamshala-art',
    num: '05',
    title: 'Dharamshala Art & Buddhist Trail',
    region: 'Himachal',
    location: 'Dharamshala, Himachal Pradesh',
    duration: '4 Days / 3 Nights',
    durationDays: 4,
    vibe: 'Heritage',
    difficulty: 'Easy',
    price: 14500,
    maxGuests: 5,
    image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800&auto=format&fit=crop',
    badge: 'Cultural Immersion',
    altitude: '1,457m',
    bestTime: 'Year-Round',
    description: 'Immerse your spirit in the tranquil shadows of the Dhauladhar range. Walk misty forest trails, master ancient clay throwing at the renowned Andretta pottery glades, and discover Tibetan culinary arts.',
    longDescription: 'Immerse your spirit in the tranquil shadows of the Dhauladhar range. Walk misty cedar trails, master ancient clay wheel-throwing at the historic Andretta pottery glades, explore monastic libraries, and learn Tibetan culinary cooking arts from local grandmothers.',
    amenities: [
      'Private Dhauladhar Foothill Cab',
      'Exclusive Andretta Pottery Class',
      'Tibetan Wellness Culinary Masterclass',
      'Private Library & Meditation Guides',
      'Organic Himalayan Tea Tasting Session'
    ],
    includes: [
      { name: 'Transit', iconName: 'Car' },
      { name: 'Organic Meals', iconName: 'UtensilsCrossed' },
      { name: 'Pine Villa', iconName: 'Tent' },
      { name: 'Guide', iconName: 'Guide' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival in McLeod Ganj & Monastery Tour', desc: 'Arrive at our pine-shaded luxury villa. Visit the complex of the Dalai Lama, explore Tibet Museum collections, and take a peaceful walking path around the prayer wheels.' },
      { day: 2, title: 'Andretta Pottery Wheel Masterclass', desc: 'Drive to the artist colony of Andretta. Spend the afternoon working on the pottery wheel, shaping wet clay under the guidance of native master artisans.' },
      { day: 3, title: 'Tibetan Culinary Lesson & Forest Walks', desc: 'Learn to fold momos and cook warm Tibetan soups in a local kitchen. Afternoon walk through thick pine woods to the historic St. John in the Wilderness Church.' },
      { day: 4, title: 'Kangra Tea Estate Tasting & Departure', desc: 'Stroll through organic green tea gardens in Kangra Valley, sample premium high-elevation tea flushes, and take your private transit return.' }
    ]
  },
  {
    id: 'pahalgam-glamp',
    num: '07',
    title: 'Pahalgam Meadows Equestrian Glamp',
    region: 'Kashmir',
    location: 'Pahalgam, Jammu & Kashmir',
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    vibe: 'Wellness',
    difficulty: 'Easy',
    price: 26500,
    maxGuests: 6,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    badge: 'Premium Glamping',
    altitude: '2,200m',
    bestTime: 'April to October',
    description: 'Fall in love with the absolute tranquil flow of the Lidder River. Glamp under high pines, with guided mountain horse trails and customized evening wood-fire gazebos.',
    longDescription: 'Fall in love with the absolute tranquil flow of the Lidder River in Pahalgam. Glamp under towering pine trees, enjoy guided equestrian mountain trails, and savor customized evening wood-fire gazebo dinners featuring slow-simmered Kashmiri cuisine.',
    amenities: ['Horse Trail Excursion', 'Premium Riverside Dome', 'Customized Evening Gazebo'],
    includes: [
      { name: 'Transit', iconName: 'Car' },
      { name: 'Forest Meals', iconName: 'UtensilsCrossed' },
      { name: 'Luxury Dome', iconName: 'Tent' },
      { name: 'Equestrian Pro', iconName: 'Guide' }
    ],
    itinerary: [
      { day: 1, title: 'Riverside Dome Settling & Evening Trout Dining', desc: 'Arrive at our luxury glamping site along the rushing Lidder River. Check in to your geodesic glass dome, and enjoy fresh, locally sourced wood-fired trout.' },
      { day: 2, title: 'Equestrian Meadow Trail to Baisaran Valley', desc: 'Mount your Kashmiri horse for a guided equestrian trail up to Baisaran Valley (popularly called Mini-Switzerland), riding through thick forests and lush meadows.' },
      { day: 3, title: 'Aru Valley Exploration & Kashmiri Kahwa Tasting', desc: 'Take a scenic mountain drive to the beautiful hamlet of Aru. Spend a relaxing afternoon with local shepherds, tasting authentic Kashmiri saffron Kahwa.' },
      { day: 4, title: 'Betaab Valley Pinewood Picnic & Gazebo dinner', desc: 'Enjoy a picnic lunch by the crystal streams of Betaab Valley. Return for a private 5-course Kashmiri Wazwan dinner under a glowing riverside gazebo.' },
      { day: 5, title: 'Golden Meadow Sunset Hike & Departure', desc: 'Take a quiet morning walk along the riverbanks, package your memories, and return via private chauffeur transit to Srinagar airport.' }
    ]
  },
  {
    id: 'sikkim-monastery',
    num: '08',
    title: 'Sikkim Monastery & Organic Valley',
    region: 'Sikkim',
    location: 'Gangtok & Lachung, Sikkim',
    duration: '7 Days / 6 Nights',
    durationDays: 7,
    vibe: 'Heritage',
    difficulty: 'Moderate',
    price: 22000,
    maxGuests: 6,
    image: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?q=80&w=800&auto=format&fit=crop',
    badge: 'Organic Sanctuary',
    altitude: '2,900m',
    bestTime: 'Oct to Dec, Mar to Jun',
    description: 'Journey to the holy lakes and hot springs of North Sikkim. Stay in ancestral wood-clad homestays and taste pure organic food grown directly in sub-zero terraced farms.',
    longDescription: 'Journey to the holy lakes and therapeutic hot springs of North Sikkim. Stay in ancestral wood-clad homestays, explore golden monasteries, and taste pure organic food grown directly in high-altitude sub-zero terraced farms.',
    amenities: ['Restricted Area Permits', 'Tibetan Herb Hot Spring Trip', 'Traditional Chhaang Tasting'],
    includes: [
      { name: 'Pahadi Chauffeur', iconName: 'Car' },
      { name: 'Organic Meals', iconName: 'UtensilsCrossed' },
      { name: 'Lodge Shelter', iconName: 'Tent' },
      { name: 'Sikkimese Guide', iconName: 'Guide' }
    ],
    itinerary: [
      { day: 1, title: 'Arrive in Gangtok & Welcome Tea Ceremony', desc: 'Check in to our heritage hotel in Gangtok. Participate in a traditional Sikkimese butter tea ceremony and visit Rumtek Monastery.' },
      { day: 2, title: 'Tsomgo Sacred Lake & Gurudongmar Briefing', desc: 'Travel to the high-elevation Tsomgo Lake (3,753m), sacred to both Buddhists and Hindus. Receive your mountain permits and briefing for the journey north.' },
      { day: 3, title: 'Drive to Lachung through Mountain Waterfalls', desc: 'Embark on a spectacular drive through the valleys of North Sikkim, passing high waterfalls and deep gorges. Overnight in a wooden chalet in Lachung (2,900m).' },
      { day: 4, title: 'Yumthang Valley of Flowers & Herbal Hot Springs', desc: 'Explore the stunning Yumthang Valley, a lush meadow filled with rhododendrons. Take a private, relaxing dip in the therapeutic natural sulphur hot springs.' },
      { day: 5, title: 'Lachen Transit & High Altitude Tibetan Stays', desc: 'Journey further to the remote outpost of Lachen. Meet high-altitude Tibetan-descent community elders, tasting traditional barley-brewed Chhaang around the fire.' },
      { day: 6, title: 'Sacred Gurudongmar Lake Expedition', desc: 'Drive at dawn to the majestic Gurudongmar Lake (5,182m), one of the highest lakes in the world, reflecting crystal blue glaciers. Return to Gangtok.' },
      { day: 7, title: 'Organic Farm Harvest & Departure', desc: 'Visit an organic terraced farm, harvest fresh Himalayan spinach and radishes for breakfast, and return via private chauffeur transit to Bagdogra.' }
    ]
  }
];
