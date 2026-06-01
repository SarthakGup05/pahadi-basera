export interface PropertyService {
  id: string;
  serviceType: 'STAY' | 'KITCHEN' | 'COOK' | 'GUIDE' | 'LOCAL_CHEF' | 'FOREST_SAUNA' | 'NATIVE_GUIDE';
  pricePerUnit: number;
  label: string;
}

export interface PropertyImage {
  url: string;
  isFeatured: boolean;
  displayOrder: number;
}

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  rating: string | null;
  reviewsCount: number;
  badge: string | null;
  bgImage: string;
  image: string; // for compatibility with older code
  about: string;
  space: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  securityDeposit: number;
  checkInTime: string;
  checkOutTime: string;
  selfCheckIn: string;
  petsAllowed: boolean;
  smokingPolicy: string;
  cancellationPolicy: string;
  amenities: string[];
  altitude: number; // in meters
  type: 'RESORT' | 'VILLAS' | 'CASTLE' | 'HOMESAYS' | 'COTTAGE' | 'GUEST_HOUSE' | 'APARTMENT';
  services: PropertyService[];
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
}

export const propertiesCatalog: Record<string, PropertyItem> = {
  '1': {
    id: '1',
    title: 'Oakwood Premium Chalet',
    description: 'Perched on a quiet cedar ridge in Manali. Features floor-to-ceiling wilderness views, a native stone fireplace, stargazing decks, and private slow gastronomy chef service.',
    location: 'Manali, Himachal Pradesh',
    pricePerNight: 8500,
    rating: '4.9',
    reviewsCount: 124,
    badge: 'Best Seller',
    bgImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop',
    about: 'Perched on a quiet cedar ridge in Manali. Features floor-to-ceiling wilderness views, a native stone fireplace, stargazing decks, and private slow gastronomy chef service.',
    space: 'Experience glass-walled bedrooms looking straight onto snow-capped peaks, bohemian decor styled with handwoven local rugs, private balconies, and dedicated high-altitude heating systems.',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    securityDeposit: 3000,
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Self check-in with private secure lockbox',
    petsAllowed: true,
    smokingPolicy: 'Balcony only, no indoor smoking',
    cancellationPolicy: 'Super flexible - 100% refund up to 72 hours before check-in',
    amenities: ['High-speed Wi-Fi', 'Fireplace', 'Central Heating', 'Balcony w/ Mountain View', 'Local organic tea bar', 'Private stargazing telescope', 'Organic toiletries', 'Hair dryer', 'Washing machine'],
    altitude: 2050,
    type: 'VILLAS',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    services: [
      { id: 'chef', serviceType: 'LOCAL_CHEF', pricePerUnit: 2500, label: 'Private Gastronomy Chef (Per Day)' },
      { id: 'sauna', serviceType: 'FOREST_SAUNA', pricePerUnit: 1500, label: 'Forest Pine Sauna Session (Per Session)' },
      { id: 'guide', serviceType: 'NATIVE_GUIDE', pricePerUnit: 3500, label: 'Certified Alpine Trekking Guide (Per Day)' }
    ]
  },
  '2': {
    id: '2',
    title: 'Sereno Boho Studio Apartment',
    description: 'A cozy bohemian-styled studio apartment in Siolim, North Goa, perfect for slow mornings, beach days & cafe hopping adventures.',
    location: 'Siolim, Goa',
    pricePerNight: 1400,
    rating: '4.8',
    reviewsCount: 34,
    badge: 'Cozy Escape',
    bgImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    about: 'Welcome to Sereno Boho, your cozy studio apartment in Siolim that blends comfort, charm & functionality. Compact yet beautifully planned, the space features a bohemian living area, fully equipped kitchen & a snug queen-bedroom retreat.',
    space: 'Delightful 1BHK featuring two private balconies with palm views, shared swimming pool access, smart TV with high-speed Wi-Fi, laundry facilities, and complete power inverter backup.',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    securityDeposit: 3000,
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Self check-in with keybox code',
    petsAllowed: false,
    smokingPolicy: 'Allowed in open balcony areas only',
    cancellationPolicy: '100% refund if cancelled before 14 days of check-in.',
    amenities: ['TV', 'Air conditioning', 'Ceiling Fan', 'Wifi', 'Electric Kettle', 'Kitchen', 'Fridge', 'Microwave', 'Induction Stove', 'Free Parking on Premises', 'Patio', 'Balcony', 'Washing Machine'],
    altitude: 15,
    type: 'APARTMENT',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    services: [
      { id: 'kitchen', serviceType: 'KITCHEN', pricePerUnit: 600, label: 'Fully Stocked Pantry (On Arrival)' }
    ]
  },
  '3': {
    id: '3',
    title: 'Himalayan Luxury Resort & Spa',
    description: 'A luxurious resort nestled in the snow-capped mountains of Shimla, offering breathtaking views, heated pools, and local culinary experiences.',
    location: 'Shimla, Himachal Pradesh',
    pricePerNight: 7500,
    rating: '4.95',
    reviewsCount: 220,
    badge: 'Luxury Stay',
    bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    about: 'A world-class luxury resort nestled in the majestic Himalayas, featuring premium rooms, full-service spa, fine dining, and panoramic valley views.',
    space: 'Spacious suites with private glass terraces overlooking snow-covered peaks, heated bathroom floors, and personalized 24/7 butler service.',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    securityDeposit: 5000,
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    selfCheckIn: 'Front desk reception check-in',
    petsAllowed: false,
    smokingPolicy: 'Designated smoking zones only',
    cancellationPolicy: '100% refund if cancelled before 7 days of check-in.',
    amenities: ['TV', 'Air conditioning', 'Wifi', 'Hot Water', 'Free Parking on Premises', 'Dining Table', 'Shower Gel', 'Shampoo', 'Towels', 'Full Time Caretaker', 'Heating', 'Spa Access', 'Room Service'],
    altitude: 2205,
    type: 'RESORT',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    services: [
      { id: 'kitchen', serviceType: 'KITCHEN', pricePerUnit: 1200, label: 'All Inclusive Buffet Meal Plan (Per Day)' },
      { id: 'cook', serviceType: 'COOK', pricePerUnit: 1500, label: 'Private Traditional Cook (Per Meal)' },
      { id: 'guide', serviceType: 'GUIDE', pricePerUnit: 2000, label: 'Guided Heritage Walk (Per Session)' }
    ]
  },
  '4': {
    id: '4',
    title: 'The Whispering Pines Cabin',
    description: 'A stunning 3-bedroom premium villa in Manali surrounded by pine forests, featuring a stone fireplace and a private bonfire area.',
    location: 'Manali, Himachal Pradesh',
    pricePerNight: 12000,
    rating: '4.8',
    reviewsCount: 98,
    badge: 'Cozy Escape',
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    about: 'A luxurious private pinewood villa tucked away in a quiet corner of Manali, offering complete privacy, rustic mountain elegance, and majestic forest views.',
    space: '3 lavish bedrooms, double-height living room with exposed wooden beams, hand-crafted stone fireplace, wrap-around deck, and private lawn with bonfire pit.',
    maxGuests: 8,
    bedrooms: 3,
    bathrooms: 3,
    securityDeposit: 8000,
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Host meet-and-greet on arrival',
    petsAllowed: true,
    smokingPolicy: 'Allowed in outdoor areas only',
    cancellationPolicy: '100% refund if cancelled before 14 days of check-in.',
    amenities: ['TV', 'Wifi', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Microwave', 'Free Parking on Premises', 'Dining Table', 'Outdoor Furniture', 'Washing Machine', 'Fireplace', 'Bonfire Area'],
    altitude: 2050,
    type: 'VILLAS',
    isActive: true,
    isFeatured: true,
    isPopular: false,
    services: [
      { id: 'cook', serviceType: 'COOK', pricePerUnit: 1800, label: 'Personal Tandoori & BBQ Chef (Per Evening)' }
    ]
  },
  '5': {
    id: '5',
    title: 'Kinner Castle Heritage Stay',
    description: 'Experience royalty in this beautifully restored 19th-century fortress in Kalpa. Marvel at the vintage woodwork and Kinnaur architecture.',
    location: 'Kalpa, Himachal Pradesh',
    pricePerNight: 9500,
    rating: '4.7',
    reviewsCount: 45,
    badge: 'Historic Stay',
    bgImage: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=800&auto=format&fit=crop',
    about: 'Walk through history at the Kinner Castle. Every corner of this heritage stay tells a story of local kings, cultural legacies, and Himalayan architectural brilliance.',
    space: 'Antique furnishings, hand-woven carpets, vintage corridors, and standard castle bedrooms that present an authentic Kinnaur living experience.',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    securityDeposit: 4000,
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Welcome drink and host-led tour check-in',
    petsAllowed: false,
    smokingPolicy: 'Non-smoking property',
    cancellationPolicy: '100% refund if cancelled before 10 days of check-in.',
    amenities: ['TV', 'Wifi', 'Bed Linen', 'Wardrobe', 'Hot Water', 'Free Parking on Premises', 'Dining Table', 'Full Time Caretaker', 'Heritage Tours', 'Local Cuisine Dinner'],
    altitude: 2960,
    type: 'CASTLE',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    services: [
      { id: 'guide', serviceType: 'GUIDE', pricePerUnit: 2500, label: 'Kinnaur Fortress & Monastery Historian Guide (Per Day)' }
    ]
  },
  '6': {
    id: '6',
    title: 'Traditional Apple Orchard Homestay',
    description: 'Live like a local in this cozy traditional homestay in Kotgarh. Help pick apples, enjoy homemade Siddu, and experience authentic pahadi life.',
    location: 'Kotgarh, Himachal Pradesh',
    pricePerNight: 2500,
    rating: '4.9',
    reviewsCount: 67,
    badge: 'Organic Farm',
    bgImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    about: 'Tucked inside a sprawling apple orchard, this traditional homestay offers you a chance to unplug, slow down, and experience genuine Himachali warmth.',
    space: 'Cozy guest rooms with high wooden ceilings, shared family dining space, wood-fire ovens, and scenic walking trails stretching right outside your door.',
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2,
    securityDeposit: 1500,
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    selfCheckIn: 'Warm family reception',
    petsAllowed: true,
    smokingPolicy: 'Allowed in outdoor gardens only',
    cancellationPolicy: '100% refund if cancelled before 5 days of check-in.',
    amenities: ['Wifi', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Free Parking on Premises', 'Dining Table', 'Home-cooked Meals', 'Orchard Walks', 'Organic Garden Access'],
    altitude: 2280,
    type: 'HOMESAYS',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    services: [
      { id: 'kitchen', serviceType: 'KITCHEN', pricePerUnit: 500, label: 'Farm-to-Table Organic Meal Bundle (Per Day)' },
      { id: 'cook', serviceType: 'COOK', pricePerUnit: 800, label: 'Local Siddu Cooking Masterclass (Per Session)' }
    ]
  },
  '7': {
    id: '7',
    title: 'Forest View Wood Cottage',
    description: 'A cozy wooden A-frame cottage in Jibhi, right next to a bubbling stream. The perfect place for writers, artists, and nature lovers.',
    location: 'Jibhi, Himachal Pradesh',
    pricePerNight: 3500,
    rating: '4.95',
    reviewsCount: 88,
    badge: 'Riverside Retreat',
    bgImage: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=800&auto=format&fit=crop',
    about: 'A modern wood-and-glass A-frame cottage surrounded by thick pine and cedar forests, featuring an outdoor hammock right above a rushing mountain river.',
    space: 'Attic-style loft bedroom with glass roof for stargazing, micro-kitchen, cozy reading nook, and private patio projecting over the freshwater stream.',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    securityDeposit: 2000,
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Keybox access with pin code',
    petsAllowed: true,
    smokingPolicy: 'Allowed on the outdoor patio only',
    cancellationPolicy: '100% refund if cancelled before 7 days of check-in.',
    amenities: ['Wifi', 'Electric Kettle', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Outdoor Furniture', 'Patio', 'Balcony', 'Hammock', 'Stargazing Roof', 'Heater'],
    altitude: 1600,
    type: 'COTTAGE',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    services: [
      { id: 'guide', serviceType: 'GUIDE', pricePerUnit: 1500, label: 'Hidden Jalori Pass Trek Guide (Per Day)' }
    ]
  },
  '8': {
    id: '8',
    title: 'Mountain Breeze Guest House',
    description: 'Affordable, neat, and highly rated guest house rooms in Dharamshala, close to the Mcleodganj monastery.',
    location: 'Dharamshala, Himachal Pradesh',
    pricePerNight: 1800,
    rating: '4.6',
    reviewsCount: 72,
    badge: 'Budget Choice',
    bgImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop',
    about: 'Enjoy stunning valley views and ultimate convenience at our guest house, situated just minutes away from the famous Dalai Lama temple.',
    space: 'Clean, airy, independent double rooms with private attached bathrooms, balconies, and access to a shared scenic rooftop terrace.',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    securityDeposit: 1000,
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Front desk manager check-in',
    petsAllowed: false,
    smokingPolicy: 'Rooftop smoking zone only',
    cancellationPolicy: '100% refund if cancelled before 3 days of check-in.',
    amenities: ['TV', 'Wifi', 'Bed Linen', 'Wardrobe', 'Ceiling Fan', 'Hot Water', 'Balcony', 'Rooftop Terrace Access', 'Daily Housekeeping'],
    altitude: 1457,
    type: 'GUEST_HOUSE',
    isActive: true,
    isFeatured: false,
    isPopular: false,
    services: []
  },
  'tungnath-eco-glamp': {
    id: 'tungnath-eco-glamp',
    title: 'Tungnath Eco-Glamping Meadows',
    description: 'An alpine meadow haven nestled within the Kedarnath Wildlife Sanctuary. Home to ancient stone trails and the highest temple summit.',
    location: 'Chopta, Uttarakhand',
    pricePerNight: 6500,
    rating: '4.95',
    reviewsCount: 88,
    badge: 'Eco Glamping',
    bgImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
    about: 'Experience Chopta like Switzerland. Geodesic insulated glass domes set on high-altitude meadow platforms with direct views of the Chaukhamba massif.',
    space: 'Wrap-around clear domes with premium heating, thick blankets, composting toilets, high-intensity telescopes, and native guides for early sunrise treks.',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    securityDeposit: 3000,
    checkInTime: '2:00 PM',
    checkOutTime: '10:00 AM',
    selfCheckIn: 'Glamping manager reception',
    petsAllowed: false,
    smokingPolicy: 'No smoking inside dome complexes',
    cancellationPolicy: '100% refund if cancelled 7 days in advance.',
    amenities: ['Wifi', 'Hot Water', 'Heating', 'Nature Guide', 'Star Gazing Kit', 'Private Deck', 'Bonfire Pit', 'Traditional Dining'],
    altitude: 2680,
    type: 'COTTAGE',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    services: [
      { id: 'guide', serviceType: 'NATIVE_GUIDE', pricePerUnit: 2000, label: 'Chopta-Tungnath Summit Trek Escort (Per Day)' }
    ]
  },
  'panchachuli-stone-lodge': {
    id: 'panchachuli-stone-lodge',
    title: 'Panchachuli Panoramic Stone Lodge',
    description: 'A high-altitude paradise tucked away under the Panchachuli peaks. Known for its clear nights, ancient pathways, and raw mountain aesthetics.',
    location: 'Munsiyari, Uttarakhand',
    pricePerNight: 7800,
    rating: '5.0',
    reviewsCount: 56,
    badge: 'Stargazer Deck',
    bgImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop',
    about: 'Faced directly against the five colossal summits of the Panchachuli range, this Kumaoni stone lodge blends traditional mountain architecture with luxury comforts.',
    space: 'Crafted with local slate and pine boards, features a dedicated glass observatory balcony, premium fireplace, heated mattresses, and locally sourced Kumaoni dining.',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    securityDeposit: 4000,
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Welcome by local homesteader family',
    petsAllowed: true,
    smokingPolicy: 'Allowed on stargazing decks',
    cancellationPolicy: '100% refund up to 10 days before check-in.',
    amenities: ['Private Telescope', 'Fireplace', 'Heated Bedding', 'Ayurvedic Tea', 'Wifi', 'Hot Water', 'Fridge', 'Local Kitchen Access'],
    altitude: 2200,
    type: 'VILLAS',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    services: [
      { id: 'guide', serviceType: 'NATIVE_GUIDE', pricePerUnit: 3500, label: 'Khalia Top Ridge Alpine Trekking Guide (Per Day)' }
    ]
  },
  'nanda-devi-ski-chalet': {
    id: 'nanda-devi-ski-chalet',
    title: 'Nanda Devi Ski & Alpine Chalet',
    description: 'India’s premier ski destination surrounded by giant Himalayan massifs. Featuring lush summer meadows and crystal blue artificial high reservoirs.',
    location: 'Auli, Uttarakhand',
    pricePerNight: 9500,
    rating: '4.88',
    reviewsCount: 74,
    badge: 'Ski-in Ski-out',
    bgImage: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800&auto=format&fit=crop',
    about: 'A luxurious alpine chalet built in traditional ski-lodge style, located right on the pristine, snow-draped ski slopes of Auli with panoramic views of Nanda Devi peak.',
    space: 'Sweeping wood interiors, floor heating, private ski lockers, access to outdoor hot tub, and private balconies directly facing Auli’s slopes.',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 4,
    securityDeposit: 6000,
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    selfCheckIn: 'Check-in via slopeside reception',
    petsAllowed: false,
    smokingPolicy: 'Strictly non-smoking indoors',
    cancellationPolicy: '100% refund up to 14 days before stay.',
    amenities: ['Ski Locker', 'Sauna Access', 'Jacuzzi Tub', 'Himalayan Coffee Bar', 'Wifi', 'Central Heating', 'Hot Water', 'Washing Machine'],
    altitude: 2800,
    type: 'CASTLE',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    services: [
      { id: 'sauna', serviceType: 'FOREST_SAUNA', pricePerUnit: 2000, label: 'Alpine Outdoor Hot Cedar Sauna (Per Session)' }
    ]
  },
  'trishul-heritage-homestead': {
    id: 'trishul-heritage-homestead',
    title: 'Trishul View Ancestral Homestead',
    description: 'A quiet pine-wooded ridge offering an uninterrupted 300km panorama of the high snow peaks. The Switzerland of India.',
    location: 'Kausani, Uttarakhand',
    pricePerNight: 5400,
    rating: '4.92',
    reviewsCount: 42,
    badge: 'Cultural Heritage',
    bgImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1920&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
    about: 'A lovingly restored 80-year-old traditional slate-roofed homestay offering an uninterrupted 300km wall of towering Himalayan summits directly in front.',
    space: 'Constructed with local mud-clay plaster and hand-carved deodar wood, organic tea farm trails right outside, private yoga deck, and a clay-oven kitchen.',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    securityDeposit: 2500,
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    selfCheckIn: 'Traditional family arti and tilak welcome',
    petsAllowed: true,
    smokingPolicy: 'Allowed in tea gardens only',
    cancellationPolicy: '100% refund up to 5 days before check-in.',
    amenities: ['Clay-oven Kitchen', 'Organic Tea Farm Walk', 'Yoga Deck', 'Local Guide', 'Wifi', 'Hot Water', 'Home-cooked Kumaoni Meals'],
    altitude: 1890,
    type: 'HOMESAYS',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    services: [
      { id: 'cook', serviceType: 'COOK', pricePerUnit: 1000, label: 'Traditional Kumaoni Black Soybean Meal Cooking (Per Day)' }
    ]
  }
};

export const propertiesList: PropertyItem[] = Object.values(propertiesCatalog);
