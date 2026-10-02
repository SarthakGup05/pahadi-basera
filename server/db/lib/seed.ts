import { prisma } from '../prisma.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding...');
  console.log('DEBUG - PRISMA KEYS:', Object.keys(prisma));
  console.log('DEBUG - IS BLOGPOST DEFINED:', prisma.blogPost !== undefined);

  // 1. Clean up existing data to ensure a fresh, repeatable state
  console.log('🧹 Cleaning up existing database records...');
  await prisma.review.deleteMany();
  await prisma.bookingService.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.communityTrail.deleteMany();
  await prisma.communityThread.deleteMany();
  await prisma.localRecipe.deleteMany();
  await prisma.package.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (HOST, GUEST and ADMIN)
  console.log('👤 Creating test users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('AdminPassword123', 10);

  // Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@pahadibasera.com',
      phoneNumber: '+919999999999',
      password: adminPassword,
      role: 'ADMIN',
      kycStatus: 'VERIFIED',
    },
  });
  console.log('✅ Created Super Admin account: admin@pahadibasera.com');

  const hosts = [];
  const hostData = [
    { email: 'host1@pahadibasera.com', phone: '+919876543210', role: 'HOST' },
    { email: 'host2@pahadibasera.com', phone: '+919876543211', role: 'HOST' },
  ];

  for (const h of hostData) {
    const user = await prisma.user.create({
      data: {
        email: h.email,
        phoneNumber: h.phone,
        password: hashedPassword,
        role: 'HOST',
        kycStatus: 'VERIFIED',
      },
    });
    hosts.push(user);
  }

  const guests = [];
  const guestData = [
    { email: 'guest1@pahadibasera.com', phone: '+919876543212' },
    { email: 'guest2@pahadibasera.com', phone: '+919876543213' },
  ];

  for (const g of guestData) {
    const user = await prisma.user.create({
      data: {
        email: g.email,
        phoneNumber: g.phone,
        password: hashedPassword,
        role: 'GUEST',
        kycStatus: 'VERIFIED',
      },
    });
    guests.push(user);
  }

  console.log(`✅ Created ${hosts.length} HOST accounts, ${guests.length} GUEST accounts, and 1 ADMIN.`);

  // 3. Define 12 Properties mapping propertiesCatalog
  const propertiesData = [
    {
      id: '1',
      title: 'Oakwood Premium Chalet',
      description: 'Perched on a quiet cedar ridge in Manali. Features floor-to-ceiling wilderness views, a native stone fireplace, stargazing decks, and private slow gastronomy chef service.',
      rules: 'Pets allowed upon request. Please conserve water and electricity. No indoor smoking.',
      type: 'VILLAS' as const,
      location: 'Manali, Himachal Pradesh',
      bedrooms: 3,
      bathrooms: 3,
      latitude: 32.2396,
      longitude: 77.1887,
      altitude: 2050,
      basePrice: 8500.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'Perched on a quiet cedar ridge in Manali. Features floor-to-ceiling wilderness views, a native stone fireplace, stargazing decks, and private slow gastronomy chef service.',
      space: 'Experience glass-walled bedrooms looking straight onto snow-capped peaks, bohemian decor styled with handwoven local rugs, private balconies, and dedicated high-altitude heating systems.',
      maxGuests: 6,
      petsAllowed: true,
      smokingPolicy: 'Balcony only, no indoor smoking',
      securityDeposit: 3000.0,
      cancellationPolicy: 'Super flexible - 100% refund up to 72 hours before check-in',
      amenities: ['High-speed Wi-Fi', 'Fireplace', 'Central Heating', 'Balcony w/ Mountain View', 'Local organic tea bar', 'Private stargazing telescope', 'Organic toiletries', 'Hair dryer', 'Washing machine'],
      images: [
        { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'chef', serviceType: 'LOCAL_CHEF' as const, pricePerUnit: 2500, label: 'Private Gastronomy Chef (Per Day)' },
        { id: 'sauna', serviceType: 'FOREST_SAUNA' as const, pricePerUnit: 1500, label: 'Forest Pine Sauna Session (Per Session)' },
        { id: 'guide', serviceType: 'NATIVE_GUIDE' as const, pricePerUnit: 3500, label: 'Certified Alpine Trekking Guide (Per Day)' }
      ]
    },
    {
      id: '2',
      title: 'Sereno Boho Studio Apartment',
      description: 'A cozy bohemian-styled studio apartment in Siolim, North Goa, perfect for slow mornings, beach days & cafe hopping adventures.',
      rules: 'Smoking is allowed in open balcony areas only. Appropriate swimwear must be worn in the common pool.',
      type: 'APARTMENT' as const,
      location: 'Siolim, Goa',
      bedrooms: 1,
      bathrooms: 1,
      latitude: 15.6212,
      longitude: 73.7915,
      altitude: 15,
      basePrice: 1400.0,
      isActive: true,
      isFeatured: false,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'Welcome to Sereno Boho, your cozy studio apartment in Siolim that blends comfort, charm & functionality. Compact yet beautifully planned, the space features a bohemian living area, fully equipped kitchen & a snug queen-bedroom retreat.',
      space: 'Delightful 1BHK featuring two private balconies with palm views, shared swimming pool access, smart TV with high-speed Wi-Fi, laundry facilities, and complete power inverter backup.',
      maxGuests: 3,
      petsAllowed: false,
      smokingPolicy: 'Allowed in open balcony areas only',
      securityDeposit: 3000.0,
      cancellationPolicy: '100% refund if cancelled before 14 days of check-in.',
      amenities: ['TV', 'Air conditioning', 'Ceiling Fan', 'Wifi', 'Electric Kettle', 'Kitchen', 'Fridge', 'Microwave', 'Induction Stove', 'Free Parking on Premises', 'Patio', 'Balcony', 'Washing Machine'],
      images: [
        { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'kitchen', serviceType: 'KITCHEN' as const, pricePerUnit: 600, label: 'Fully Stocked Pantry (On Arrival)' }
      ]
    },
    {
      id: '3',
      title: 'Himalayan Luxury Resort & Spa',
      description: 'A luxurious resort nestled in the snow-capped mountains of Shimla, offering breathtaking views, heated pools, and local culinary experiences.',
      rules: 'No smoking indoors. Quiet hours after 10 PM. Eco-friendly practices encouraged.',
      type: 'RESORT' as const,
      location: 'Shimla, Himachal Pradesh',
      bedrooms: 2,
      bathrooms: 2,
      latitude: 31.1048,
      longitude: 77.1734,
      altitude: 2205,
      basePrice: 7500.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'A world-class luxury resort nestled in the majestic Himalayas, featuring premium rooms, full-service spa, fine dining, and panoramic valley views.',
      space: 'Spacious suites with private glass terraces overlooking snow-covered peaks, heated bathroom floors, and personalized 24/7 butler service.',
      maxGuests: 4,
      petsAllowed: false,
      smokingPolicy: 'Designated smoking zones only',
      securityDeposit: 5000.0,
      cancellationPolicy: '100% refund if cancelled before 7 days of check-in.',
      amenities: ['TV', 'Air conditioning', 'Wifi', 'Hot Water', 'Free Parking on Premises', 'Dining Table', 'Shower Gel', 'Shampoo', 'Towels', 'Full Time Caretaker', 'Heating', 'Spa Access', 'Room Service'],
      images: [
        { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'kitchen', serviceType: 'KITCHEN' as const, pricePerUnit: 1200, label: 'All Inclusive Buffet Meal Plan (Per Day)' },
        { id: 'cook', serviceType: 'COOK' as const, pricePerUnit: 1500, label: 'Private Traditional Cook (Per Meal)' },
        { id: 'guide', serviceType: 'GUIDE' as const, pricePerUnit: 2000, label: 'Guided Heritage Walk (Per Session)' }
      ]
    },
    {
      id: '4',
      title: 'The Whispering Pines Cabin',
      description: 'A stunning 3-bedroom premium villa in Manali surrounded by pine forests, featuring a stone fireplace and a private bonfire area.',
      rules: 'Pets allowed upon request. Please conserve water and electricity.',
      type: 'VILLAS' as const,
      location: 'Manali, Himachal Pradesh',
      bedrooms: 3,
      bathrooms: 3,
      latitude: 32.2450,
      longitude: 77.1920,
      altitude: 2050,
      basePrice: 12000.0,
      isActive: true,
      isFeatured: true,
      isPopular: false,
      hostId: hosts[1].id,
      about: 'A luxurious private pinewood villa tucked away in a quiet corner of Manali, offering complete privacy, rustic mountain elegance, and majestic forest views.',
      space: '3 lavish bedrooms, double-height living room with exposed wooden beams, hand-crafted stone fireplace, wrap-around deck, and private lawn with bonfire pit.',
      maxGuests: 8,
      petsAllowed: true,
      smokingPolicy: 'Allowed in outdoor areas only',
      securityDeposit: 8000.0,
      cancellationPolicy: '100% refund if cancelled before 14 days of check-in.',
      amenities: ['TV', 'Wifi', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Microwave', 'Free Parking on Premises', 'Dining Table', 'Outdoor Furniture', 'Washing Machine', 'Fireplace', 'Bonfire Area'],
      images: [
        { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'cook', serviceType: 'COOK' as const, pricePerUnit: 1800, label: 'Personal Tandoori & BBQ Chef (Per Evening)' }
      ]
    },
    {
      id: '5',
      title: 'Kinner Castle Heritage Stay',
      description: 'Experience royalty in this beautifully restored 19th-century fortress in Kalpa. Marvel at the vintage woodwork and Kinnaur architecture.',
      rules: 'Respect local heritage and customs. No heavy parties.',
      type: 'CASTLE' as const,
      location: 'Kalpa, Himachal Pradesh',
      bedrooms: 2,
      bathrooms: 2,
      latitude: 31.5385,
      longitude: 78.2612,
      altitude: 2960,
      basePrice: 9500.0,
      isActive: true,
      isFeatured: false,
      isPopular: true,
      hostId: hosts[1].id,
      about: 'Walk through history at the Kinner Castle. Every corner of this heritage stay tells a story of local kings, cultural legacies, and Himalayan architectural brilliance.',
      space: 'Antique furnishings, hand-woven carpets, vintage corridors, and standard castle bedrooms that present an authentic Kinnaur living experience.',
      maxGuests: 4,
      petsAllowed: false,
      smokingPolicy: 'Non-smoking property',
      securityDeposit: 4000.0,
      cancellationPolicy: '100% refund if cancelled before 10 days of check-in.',
      amenities: ['TV', 'Wifi', 'Bed Linen', 'Wardrobe', 'Hot Water', 'Free Parking on Premises', 'Dining Table', 'Full Time Caretaker', 'Heritage Tours', 'Local Cuisine Dinner'],
      images: [
        { url: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'guide', serviceType: 'GUIDE' as const, pricePerUnit: 2500, label: 'Kinnaur Fortress & Monastery Historian Guide (Per Day)' }
      ]
    },
    {
      id: '6',
      title: 'Traditional Apple Orchard Homestay',
      description: 'Live like a local in this cozy traditional homestay in Kotgarh. Help pick apples, enjoy homemade Siddu, and experience authentic pahadi life.',
      rules: 'Treat it like your own home. Respect the host family.',
      type: 'HOMESTAYS' as const,
      location: 'Kotgarh, Himachal Pradesh',
      bedrooms: 2,
      bathrooms: 2,
      latitude: 31.3168,
      longitude: 77.4722,
      altitude: 2280,
      basePrice: 2500.0,
      isActive: true,
      isFeatured: false,
      isPopular: true,
      hostId: hosts[1].id,
      about: 'Tucked inside a sprawling apple orchard, this traditional homestay offers you a chance to unplug, slow down, and experience genuine Himachali warmth.',
      space: 'Cozy guest rooms with high wooden ceilings, shared family dining space, wood-fire ovens, and scenic walking trails stretching right outside your door.',
      maxGuests: 5,
      petsAllowed: true,
      smokingPolicy: 'Allowed in outdoor gardens only',
      securityDeposit: 1500.0,
      cancellationPolicy: '100% refund if cancelled before 5 days of check-in.',
      amenities: ['Wifi', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Free Parking on Premises', 'Dining Table', 'Home-cooked Meals', 'Orchard Walks', 'Organic Garden Access'],
      images: [
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'kitchen', serviceType: 'KITCHEN' as const, pricePerUnit: 500, label: 'Farm-to-Table Organic Meal Bundle (Per Day)' },
        { id: 'cook', serviceType: 'COOK' as const, pricePerUnit: 800, label: 'Local Siddu Cooking Masterclass (Per Session)' }
      ]
    },
    {
      id: '7',
      title: 'Forest View Wood Cottage',
      description: 'A cozy wooden A-frame cottage in Jibhi, right next to a bubbling stream. The perfect place for writers, artists, and nature lovers.',
      rules: 'Dispose of plastic responsibly. Do not litter in the river.',
      type: 'COTTAGE' as const,
      location: 'Jibhi, Himachal Pradesh',
      bedrooms: 1,
      bathrooms: 1,
      latitude: 31.6375,
      longitude: 77.3488,
      altitude: 1600,
      basePrice: 3500.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'A modern wood-and-glass A-frame cottage surrounded by thick pine and cedar forests, featuring an outdoor hammock right above a rushing mountain river.',
      space: 'Attic-style loft bedroom with glass roof for stargazing, micro-kitchen, cozy reading nook, and private patio projecting over the freshwater stream.',
      maxGuests: 2,
      petsAllowed: true,
      smokingPolicy: 'Allowed on the outdoor patio only',
      securityDeposit: 2000.0,
      cancellationPolicy: '100% refund if cancelled before 7 days of check-in.',
      amenities: ['Wifi', 'Electric Kettle', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Outdoor Furniture', 'Patio', 'Balcony', 'Hammock', 'Stargazing Roof', 'Heater'],
      images: [
        { url: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'guide', serviceType: 'GUIDE' as const, pricePerUnit: 1500, label: 'Hidden Jalori Pass Trek Guide (Per Day)' }
      ]
    },
    {
      id: '8',
      title: 'Mountain Breeze Guest House',
      description: 'Affordable, neat, and highly rated guest house rooms in Dharamshala, close to the Mcleodganj monastery.',
      rules: 'Maintain cleanliness. Inform about late entry.',
      type: 'GUEST_HOUSE' as const,
      location: 'Dharamshala, Himachal Pradesh',
      bedrooms: 1,
      bathrooms: 1,
      latitude: 32.2190,
      longitude: 76.3234,
      altitude: 1457,
      basePrice: 1800.0,
      isActive: true,
      isFeatured: false,
      isPopular: false,
      hostId: hosts[1].id,
      about: 'Enjoy stunning valley views and ultimate convenience at our guest house, situated just minutes away from the famous Dalai Lama temple.',
      space: 'Clean, airy, independent double rooms with private attached bathrooms, balconies, and access to a shared scenic rooftop terrace.',
      maxGuests: 3,
      petsAllowed: false,
      smokingPolicy: 'Rooftop smoking zone only',
      securityDeposit: 1000.0,
      cancellationPolicy: '100% refund if cancelled before 3 days of check-in.',
      amenities: ['TV', 'Wifi', 'Bed Linen', 'Wardrobe', 'Ceiling Fan', 'Hot Water', 'Balcony', 'Rooftop Terrace Access', 'Daily Housekeeping'],
      images: [
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: []
    },
    {
      id: 'tungnath-eco-glamp',
      title: 'Tungnath Eco-Glamping Meadows',
      description: 'An alpine meadow haven nestled within the Kedarnath Wildlife Sanctuary. Home to ancient stone trails and the highest temple summit.',
      rules: 'No smoking inside dome complexes. Dispose of waste at designated bins.',
      type: 'COTTAGE' as const,
      location: 'Chopta, Uttarakhand',
      bedrooms: 2,
      bathrooms: 2,
      latitude: 30.4853,
      longitude: 79.2154,
      altitude: 2680,
      basePrice: 6500.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'Experience Chopta like Switzerland. Geodesic insulated glass domes set on high-altitude meadow platforms with direct views of the Chaukhamba massif.',
      space: 'Wrap-around clear domes with premium heating, thick blankets, composting toilets, high-intensity telescopes, and native guides for early sunrise treks.',
      maxGuests: 4,
      petsAllowed: false,
      smokingPolicy: 'No smoking inside dome complexes',
      securityDeposit: 3000.0,
      cancellationPolicy: '100% refund if cancelled 7 days in advance.',
      amenities: ['Wifi', 'Hot Water', 'Heating', 'Nature Guide', 'Star Gazing Kit', 'Private Deck', 'Bonfire Pit', 'Traditional Dining'],
      images: [
        { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'guide', serviceType: 'NATIVE_GUIDE' as const, pricePerUnit: 2000, label: 'Chopta-Tungnath Summit Trek Escort (Per Day)' }
      ]
    },
    {
      id: 'panchachuli-stone-lodge',
      title: 'Panchachuli Panoramic Stone Lodge',
      description: 'A high-altitude paradise tucked away under the Panchachuli peaks. Known for its clear nights, ancient pathways, and raw mountain aesthetics.',
      rules: 'Maintain quiet hours after 10 PM. Do not litter in nearby trails.',
      type: 'VILLAS' as const,
      location: 'Munsiyari, Uttarakhand',
      bedrooms: 3,
      bathrooms: 3,
      latitude: 30.0668,
      longitude: 80.2376,
      altitude: 2200,
      basePrice: 7800.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'Faced directly against the five colossal summits of the Panchachuli range, this Kumaoni stone lodge blends traditional mountain architecture with luxury comforts.',
      space: 'Crafted with local slate and pine boards, features a dedicated glass observatory balcony, premium fireplace, heated mattresses, and locally sourced Kumaoni dining.',
      maxGuests: 6,
      petsAllowed: true,
      smokingPolicy: 'Allowed on stargazing decks',
      securityDeposit: 4000.0,
      cancellationPolicy: '100% refund up to 10 days before check-in.',
      amenities: ['Private Telescope', 'Fireplace', 'Heated Bedding', 'Ayurvedic Tea', 'Wifi', 'Hot Water', 'Fridge', 'Local Kitchen Access'],
      images: [
        { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'guide', serviceType: 'NATIVE_GUIDE' as const, pricePerUnit: 3500, label: 'Khalia Top Ridge Alpine Trekking Guide (Per Day)' }
      ]
    },
    {
      id: 'nanda-devi-ski-chalet',
      title: 'Nanda Devi Ski & Alpine Chalet',
      description: 'India’s premier ski destination surrounded by giant Himalayan massifs. Featuring lush summer meadows and crystal blue artificial high reservoirs.',
      rules: 'Strictly non-smoking indoors. Clean and store skiing gear in lockers.',
      type: 'CASTLE' as const,
      location: 'Auli, Uttarakhand',
      bedrooms: 3,
      bathrooms: 4,
      latitude: 30.5283,
      longitude: 79.5667,
      altitude: 2800,
      basePrice: 9500.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'A luxurious alpine chalet built in traditional ski-lodge style, located right on the pristine, snow-draped ski slopes of Auli with panoramic views of Nanda Devi peak.',
      space: 'Sweeping wood interiors, floor heating, private ski lockers, access to outdoor hot tub, and private balconies directly facing Auli’s slopes.',
      maxGuests: 6,
      petsAllowed: false,
      smokingPolicy: 'Strictly non-smoking indoors',
      securityDeposit: 6000.0,
      cancellationPolicy: '100% refund up to 14 days before stay.',
      amenities: ['Ski Locker', 'Sauna Access', 'Jacuzzi Tub', 'Himalayan Coffee Bar', 'Wifi', 'Central Heating', 'Hot Water', 'Washing Machine'],
      images: [
        { url: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'sauna', serviceType: 'FOREST_SAUNA' as const, pricePerUnit: 2000, label: 'Alpine Outdoor Hot Cedar Sauna (Per Session)' }
      ]
    },
    {
      id: 'trishul-heritage-homestead',
      title: 'Trishul View Ancestral Homestead',
      description: 'A quiet pine-wooded ridge offering an uninterrupted 300km panorama of the high snow peaks. The Switzerland of India.',
      rules: 'Allowed in tea gardens only. Respect Kumaoni traditions.',
      type: 'HOMESTAYS' as const,
      location: 'Kausani, Uttarakhand',
      bedrooms: 2,
      bathrooms: 2,
      latitude: 29.8543,
      longitude: 79.5959,
      altitude: 1890,
      basePrice: 5400.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[1].id,
      about: 'A lovingly restored 80-year-old traditional slate-roofed homestay offering an uninterrupted 300km wall of towering Himalayan summits directly in front.',
      space: 'Constructed with local mud-clay plaster and hand-carved deodar wood, organic tea farm trails right outside, private yoga deck, and a clay-oven kitchen.',
      maxGuests: 4,
      petsAllowed: true,
      smokingPolicy: 'Allowed in tea gardens only',
      securityDeposit: 2500.0,
      cancellationPolicy: '100% refund up to 5 days before check-in.',
      amenities: ['Clay-oven Kitchen', 'Organic Tea Farm Walk', 'Yoga Deck', 'Local Guide', 'Wifi', 'Hot Water', 'Home-cooked Kumaoni Meals'],
      images: [
        { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1920&auto=format&fit=crop', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { id: 'cook', serviceType: 'COOK' as const, pricePerUnit: 1000, label: 'Traditional Kumaoni Black Soybean Meal Cooking (Per Day)' }
      ]
    }
  ];

  const createdProperties = [];
  for (const p of propertiesData) {
    const { images, services, ...propFields } = p;
    const property = await prisma.property.create({
      data: {
        ...propFields,
        images: {
          create: images,
        },
        services: {
          create: services.map(s => ({
            id: `${p.id}-${s.id}`,
            serviceType: s.serviceType,
            pricePerUnit: s.pricePerUnit,
            label: s.label,
            isAvailable: true
          })),
        },
      },
    });
    createdProperties.push(property);
  }

  console.log(`✅ Created ${createdProperties.length} properties with complete services/images.`);

  // 4. Create Bookings
  console.log('📅 Creating test bookings...');

  // Helper to generate dates relative to now
  const getDateOffsetMonths = (monthsOffset: number, dayOffset: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsOffset);
    d.setDate(d.getDate() + dayOffset);
    return d;
  };

  const mockBookings = [
    {
      monthsOffset: -5,
      dayOffset: 5,
      nights: 3,
      baseStayCost: 25500,
      servicesCost: 7500,
      securityDeposit: 3000,
      totalCost: 36000,
      status: 'COMPLETED' as const,
      propertyId: '1',
      serviceId: '1-chef',
      servicePrice: 2500
    },
    {
      monthsOffset: -4,
      dayOffset: 12,
      nights: 2,
      baseStayCost: 2800,
      servicesCost: 1200,
      securityDeposit: 3000,
      totalCost: 7000,
      status: 'COMPLETED' as const,
      propertyId: '2',
      serviceId: '2-kitchen',
      servicePrice: 600
    },
    {
      monthsOffset: -3,
      dayOffset: 1,
      nights: 4,
      baseStayCost: 30000,
      servicesCost: 8000,
      securityDeposit: 5000,
      totalCost: 43000,
      status: 'CANCELLED' as const,
      propertyId: '3',
      serviceId: '3-kitchen',
      servicePrice: 1200
    },
    {
      monthsOffset: -2,
      dayOffset: 20,
      nights: 5,
      baseStayCost: 47500,
      servicesCost: 10000,
      securityDeposit: 6000,
      totalCost: 63500,
      status: 'COMPLETED' as const,
      propertyId: 'nanda-devi-ski-chalet',
      serviceId: 'nanda-devi-ski-chalet-sauna',
      servicePrice: 2000
    },
    {
      monthsOffset: -1,
      dayOffset: 10,
      nights: 2,
      baseStayCost: 13000,
      servicesCost: 4000,
      securityDeposit: 3000,
      totalCost: 20000,
      status: 'CONFIRMED' as const,
      propertyId: 'tungnath-eco-glamp',
      serviceId: 'tungnath-eco-glamp-guide',
      servicePrice: 2000
    },
    {
      monthsOffset: 0,
      dayOffset: 3,
      nights: 4,
      baseStayCost: 34000,
      servicesCost: 10000,
      securityDeposit: 3000,
      totalCost: 47000,
      status: 'CONFIRMED' as const,
      propertyId: '1',
      serviceId: '1-chef',
      servicePrice: 2500
    },
    {
      monthsOffset: 1,
      dayOffset: 15,
      nights: 2,
      baseStayCost: 15600,
      servicesCost: 7000,
      securityDeposit: 4000,
      totalCost: 26600,
      status: 'PENDING' as const,
      propertyId: 'panchachuli-stone-lodge',
      serviceId: 'panchachuli-stone-lodge-guide',
      servicePrice: 3500
    }
  ];

  for (let idx = 0; idx < mockBookings.length; idx++) {
    const mb = mockBookings[idx];
    const checkIn = getDateOffsetMonths(mb.monthsOffset, mb.dayOffset);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + mb.nights);

    // Create the booking record
    const createdBooking = await prisma.booking.create({
      data: {
        guestId: guests[idx % guests.length].id,
        propertyId: mb.propertyId,
        checkIn,
        checkOut,
        baseStayCost: mb.baseStayCost,
        servicesCost: mb.servicesCost,
        securityDeposit: mb.securityDeposit,
        totalCost: mb.totalCost,
        status: mb.status,
        selectedServices: {
          create: [
            {
              serviceId: mb.serviceId,
              priceAtTime: mb.servicePrice,
              quantity: mb.nights
            }
          ]
        }
      }
    });

    // Manually force-update the createdAt timestamp inside db to reflect past history
    const pastCreatedDate = new Date(checkIn);
    pastCreatedDate.setDate(pastCreatedDate.getDate() - 15); // Booked 15 days prior to stay
    await prisma.booking.update({
      where: { id: createdBooking.id },
      data: {
        createdAt: pastCreatedDate
      }
    });
  }

  console.log(`✅ Created ${mockBookings.length} bookings spanning past and future months.`);

  // 5. Create Reviews
  console.log('⭐️ Creating test reviews...');
  const reviewsData = [
    {
      userId: guests[0].id,
      propertyId: '1',
      rating: 5,
      comment: 'An absolutely magical stay! The views from the resort are unmatched, and the staff treated us like family. Highly recommend the guided treks.',
    },
    {
      userId: guests[1].id,
      propertyId: '1',
      rating: 4,
      comment: 'Excellent luxury resort. The heated pool was amazing. Food could be slightly faster, but the quality was incredible!',
    },
    {
      userId: guests[1].id,
      propertyId: '3',
      rating: 5,
      comment: 'Authentic Himachal hospitality! Living in the orchard was so peaceful, and the fresh apples were delicious.',
    },
  ];

  for (const r of reviewsData) {
    await prisma.review.create({
      data: r,
    });
  }

  console.log(`✅ Created ${reviewsData.length} property reviews.`);

  // 6. Create Blog Posts
  console.log('📝 Seeding blog posts...');
  const blogPostsData = [
    {
      id: 'chopta-meadows',
      title: 'The Silent Meadows of Chopta: A Winter Solitude Log',
      excerpt: 'Stepping off the grid into deep pine woodlands covered in thick snow. Discovering pristine silent ridges untouched by mainstream tourism.',
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
      authorName: 'Aarav Semwal',
      authorRole: 'Alpine Photographer',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
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
      authorName: 'Priyanka Rawat',
      authorRole: 'Cultural Gastronomist',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
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
      authorName: 'Vikram Negi',
      authorRole: 'Astro-Photographer',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
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
      authorName: 'Vikram Negi',
      authorRole: 'Astro-Photographer',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
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

  for (const b of blogPostsData) {
    await prisma.blogPost.create({
      data: b
    });
  }

  // 7. Create Trails
  console.log('🗺️ Seeding trails...');
  const trailsData = [
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

  for (const t of trailsData) {
    await prisma.communityTrail.create({
      data: t
    });
  }

  // 8. Create Discussion Threads
  console.log('💬 Seeding discussions...');
  const threadsData = [
    {
      id: 'thread-1',
      title: 'Is Jalori Pass trek open for self-guided snow hiking in early January?',
      category: 'Routes',
      replies: 14,
      upvotes: 28,
      authorName: 'Rohan Sharma',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'
    },
    {
      id: 'thread-2',
      title: 'Best heavy winter sleeping bags rated for -15°C in high meadow camps?',
      category: 'Gear',
      replies: 22,
      upvotes: 45,
      authorName: 'Meera Sen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80'
    },
    {
      id: 'thread-3',
      title: 'Forest entry permit checklist and office location in Joshimath for Nanda Devi sanctuary.',
      category: 'Permits',
      replies: 9,
      upvotes: 18,
      authorName: 'Kabir Dev',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&q=80'
    }
  ];

  for (const th of threadsData) {
    await prisma.communityThread.create({
      data: th
    });
  }

  // 9. Create Local Recipes
  console.log('🍲 Seeding local recipes...');
  const recipesData = [
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

  for (const re of recipesData) {
    await prisma.localRecipe.create({
      data: re
    });
  }

  // 10. Seed Packages
  console.log('📦 Seeding packages...');
  const packagesData = [
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
      description: 'Immerse your spirit in the tranquil shadows of the Dhauladhar range. Walk misty forest trails, master clay throwing at Andretta, and discover Tibetan culinary arts.',
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
      num: '06',
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
      longDescription: 'Fall in love with the absolute tranquil flow of the Lidder River. Glamp under high pines, with guided mountain horse trails and customized evening wood-fire gazebos.',
      amenities: ['Equestrian Trail Pass', 'Luxury Glamping Dome', 'Traditional Wazwan Dinners'],
      includes: [
        { name: 'Transit', iconName: 'Car' },
        { name: 'Meals', iconName: 'UtensilsCrossed' },
        { name: 'Glamping Dome', iconName: 'Tent' },
        { name: 'Horse Guide', iconName: 'Guide' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Srinagar & Chauffeur to Pahalgam', desc: 'Arrive in Srinagar. Take a scenic chauffeur drive along saffron fields to reach Pahalgam and settle into your premium dome.' },
        { day: 2, title: 'Lidder River Trail Walk & Fly Fishing', desc: 'Acclimatize with a tranquil morning forest walk next to Lidder River. Try trout fly fishing with an experienced local angler.' },
        { day: 3, title: 'Baisaran Valley Horse Trekking', desc: 'Hop on a sturdy local mountain horse for a stunning pine valley ride up to the scenic Baisaran Meadows, known as the Mini Switzerland of Kashmir.' },
        { day: 4, title: 'Local Village Visit & Wazwan Cooking', desc: 'Visit local shepherds in their pine hamlets. Learn the intricate spices and preparations of traditional Kashmiri Wazwan dishes by open embers.' },
        { day: 5, title: 'Shikara Gaze & Departure', desc: 'Enjoy a rich saffron Kahwa tea breakfast. Drive back to Srinagar for a quick Shikara ride on Dal Lake before airport drop-off.' }
      ]
    }
  ];

  for (const pkg of packagesData) {
    await prisma.package.create({
      data: pkg
    });
  }

  // 9. Seed persistent notification logs
  console.log('🔔 Creating notification logs...');
  await prisma.notification.createMany({
    data: [
      {
        title: 'New Booking Request',
        desc: 'Rohan Sharma reserved Chopta-Tungnath Summit Trek for 2 travelers starting June 15.',
        type: 'booking',
        unread: true
      },
      {
        title: 'Basera Stay Published',
        desc: 'Panchachuli Ridge Cabin in Munsiyari has been approved and listed on the live site.',
        type: 'stay',
        unread: true
      },
      {
        title: 'Host KYC Complete',
        desc: 'Partner host Vikram Negi completed identity verification checks.',
        type: 'kyc',
        unread: false
      },
      {
        title: 'Package Price Update',
        desc: 'Almora Bohemian Retreat price adjusted to ₹18,999 by system sync.',
        type: 'package',
        unread: false
      }
    ]
  });

  console.log('🎉 Database seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
