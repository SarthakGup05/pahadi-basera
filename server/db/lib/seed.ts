import { prisma } from '../prisma..js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up existing data to ensure a fresh, repeatable state
  console.log('🧹 Cleaning up existing database records...');
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (HOST and GUEST)
  console.log('👤 Creating test users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

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

  console.log(`✅ Created ${hosts.length} HOST accounts and ${guests.length} GUEST accounts.`);

  const propertiesData = [
    {
      title: 'Sereno Boho Studio Apartment',
      description: 'A cozy bohemian-styled studio apartment in Siolim, North Goa, perfect for slow mornings, beach days & cafe hopping adventures.',
      rules: 'Smoking is allowed in open balcony areas only. Appropriate swimwear must be worn in the common pool.',
      type: 'APARTMENT' as const,
      latitude: 15.6212,
      longitude: 73.7915,
      altitude: 15.0,
      basePrice: 1400.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'Welcome to Sereno Boho, your cozy 1BHK studio apartment in Siolim, North Goa that blends comfort, charm & functionality. Compact yet beautifully planned, the space features a warm bohemian-styled living area, a fully equipped kitchen & a snug queen-bedroom retreat — making it an ideal base for slow mornings, beach days & café hopping adventures.',
      space: 'What You’ll Love:\n✔ Boho-Inspired Living Room – A stylish yet cozy space with earthy tones, textured décor and comfortable seating.\n✔ Two Private Balconies – Both the living room and bedroom open out to balcony spaces.\n✔ Cozy Queen Bedroom – A plush queen-sized bed with soft linens.\n✔ Compact & Functional Layout – Smartly designed to maximize comfort without clutter.\n✔ Shared Swimming Pool – Take a refreshing dip in the complex pool.\n✔ Washing Machine & Inverter Backup – Smooth stay with convenient laundry and uninterrupted power.',
      amenities: ['TV', 'Air conditioning', 'Daily Housekeeping', 'CCTV (Exterior)', 'Bed Linen', 'Wardrobe', 'Ceiling Fan', 'Wifi', 'Electric Kettle', 'Kitchen', 'Cutlery', 'Basic Utensils', 'Hot Water', 'Lift', 'Fridge', 'Microwave', 'Induction Stove', 'No Smoking Indoors', 'Free Parking on Premises', 'Dining Table', 'Shower Gel', 'Shampoo', 'Towels', 'Outdoor Furniture', 'Full Time Caretaker', 'Patio', 'Balcony', 'Hair Dryer', 'Washing Machine'],
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      selfCheckIn: 'Self check-in with keybox code',
      maxGuests: 3,
      petsAllowed: false,
      smokingPolicy: 'Allowed in open balcony areas only',
      securityDeposit: 3000.0,
      cancellationPolicy: '100% refund if cancelled before 14 days of check-in. 50% refund if cancelled between 14 days and 7 days. No refund if cancelled less than 7 days.',
      images: [
        { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { serviceType: 'KITCHEN' as const, pricePerUnit: 600.0 },
      ],
    },
    {
      title: 'Himalayan Luxury Resort',
      description: 'A luxurious resort nestled in the snow-capped mountains of Shimla, offering breathtaking views, heated pools, and local culinary experiences.',
      rules: 'No smoking indoors. Quiet hours after 10 PM. Eco-friendly practices encouraged.',
      type: 'RESORT' as const,
      latitude: 31.1048,
      longitude: 77.1734,
      altitude: 2205.0,
      basePrice: 7500.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'A world-class luxury resort nestled in the majestic Himalayas, featuring premium rooms, full-service spa, fine dining, and panoramic valley views.',
      space: 'Spacious suites with private glass terraces overlooking snow-covered peaks, heated bathroom floors, and personalized 24/7 butler service.',
      amenities: ['TV', 'Air conditioning', 'Wifi', 'Hot Water', 'Free Parking on Premises', 'Dining Table', 'Shower Gel', 'Shampoo', 'Towels', 'Full Time Caretaker', 'Heating', 'Spa Access', 'Room Service'],
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      selfCheckIn: 'Front desk reception check-in',
      maxGuests: 4,
      petsAllowed: false,
      smokingPolicy: 'Designated smoking zones only',
      securityDeposit: 5000.0,
      cancellationPolicy: '100% refund if cancelled before 7 days of check-in. No refund after that.',
      images: [
        { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef', isFeatured: true, displayOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', isFeatured: false, displayOrder: 1 },
      ],
      services: [
        { serviceType: 'KITCHEN' as const, pricePerUnit: 1200.0 },
        { serviceType: 'COOK' as const, pricePerUnit: 1500.0 },
        { serviceType: 'GUIDE' as const, pricePerUnit: 2000.0 },
      ],
    },
    {
      title: 'Pinewood Villa',
      description: 'A stunning 3-bedroom premium villa in Manali surrounded by pine forests, featuring a stone fireplace and a private bonfire area.',
      rules: 'Pets allowed upon request. Please conserve water and electricity.',
      type: 'VILLAS' as const,
      latitude: 32.2396,
      longitude: 77.1887,
      altitude: 2050.0,
      basePrice: 12000.0,
      isActive: true,
      isFeatured: true,
      isPopular: false,
      hostId: hosts[0].id,
      about: 'A luxurious private pinewood villa tucked away in a quiet corner of Manali, offering complete privacy and rustic mountain elegance.',
      space: '3 lavish bedrooms, double-height living room with exposed wooden beams, hand-crafted stone fireplace, wrap-around deck, and private lawn with bonfire pit.',
      amenities: ['TV', 'Wifi', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Microwave', 'Free Parking on Premises', 'Dining Table', 'Outdoor Furniture', 'Washing Machine', 'Fireplace', 'Bonfire Area'],
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      selfCheckIn: 'Host meet-and-greet on arrival',
      maxGuests: 8,
      petsAllowed: true,
      smokingPolicy: 'Allowed in outdoor areas only',
      securityDeposit: 8000.0,
      cancellationPolicy: '100% refund if cancelled before 14 days of check-in.',
      images: [
        { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { serviceType: 'COOK' as const, pricePerUnit: 1800.0 },
      ],
    },
    {
      title: 'Kinner Castle Heritage Stay',
      description: 'Experience royalty in this beautifully restored 19th-century fortress in Kalpa. Marvel at the vintage woodwork and Kinnaur architecture.',
      rules: 'Respect local heritage and customs. No heavy parties.',
      type: 'CASTLE' as const,
      latitude: 31.5385,
      longitude: 78.2612,
      altitude: 2960.0,
      basePrice: 9500.0,
      isActive: true,
      isFeatured: false,
      isPopular: true,
      hostId: hosts[1].id,
      about: 'Walk through history at the Kinner Castle. Every corner of this heritage stay tells a story of local kings and Himalayan architectural brilliance.',
      space: 'Antique furnishings, hand-woven carpets, vintage corridors, and standard castle bedrooms that present an authentic Kinnaur living experience.',
      amenities: ['TV', 'Wifi', 'Bed Linen', 'Wardrobe', 'Hot Water', 'Free Parking on Premises', 'Dining Table', 'Full Time Caretaker', 'Heritage Tours', 'Local Cuisine Dinner'],
      checkInTime: '1:00 PM',
      checkOutTime: '11:00 AM',
      selfCheckIn: 'Welcome drink and host-led tour check-in',
      maxGuests: 4,
      petsAllowed: false,
      smokingPolicy: 'Non-smoking property',
      securityDeposit: 4000.0,
      cancellationPolicy: '100% refund if cancelled before 10 days of check-in.',
      images: [
        { url: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { serviceType: 'GUIDE' as const, pricePerUnit: 2500.0 },
      ],
    },
    {
      title: 'Traditional Apple Orchard Homestay',
      description: 'Live like a local in this cozy traditional homestay in Kotgarh. Help pick apples, enjoy homemade Siddu, and experience authentic pahadi life.',
      rules: 'Treat it like your own home. Respect the host family.',
      type: 'HOMESAYS' as const,
      latitude: 31.3168,
      longitude: 77.4722,
      altitude: 2280.0,
      basePrice: 2500.0,
      isActive: true,
      isFeatured: false,
      isPopular: true,
      hostId: hosts[1].id,
      about: 'Tucked inside a sprawling apple orchard, this traditional homestay offers you a chance to unplug and experience genuine Himachali warmth.',
      space: 'Cozy guest rooms with high wooden ceilings, shared family dining space, and scenic walking trails stretching right outside your door.',
      amenities: ['Wifi', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Free Parking on Premises', 'Dining Table', 'Home-cooked Meals', 'Orchard Walks', 'Organic Garden Access'],
      checkInTime: '12:00 PM',
      checkOutTime: '10:00 AM',
      selfCheckIn: 'Warm family reception',
      maxGuests: 5,
      petsAllowed: true,
      smokingPolicy: 'Allowed in outdoor gardens only',
      securityDeposit: 1500.0,
      cancellationPolicy: '100% refund if cancelled before 5 days of check-in.',
      images: [
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { serviceType: 'KITCHEN' as const, pricePerUnit: 500.0 },
        { serviceType: 'COOK' as const, pricePerUnit: 800.0 },
      ],
    },
    {
      title: 'Forest View Wood Cottage',
      description: 'A cozy wooden A-frame cottage in Jibhi, right next to a bubbling stream. The perfect place for writers, artists, and nature lovers.',
      rules: 'Dispose of plastic responsibly. Do not litter in the river.',
      type: 'COTTAGE' as const,
      latitude: 31.6375,
      longitude: 77.3488,
      altitude: 1600.0,
      basePrice: 3500.0,
      isActive: true,
      isFeatured: true,
      isPopular: true,
      hostId: hosts[0].id,
      about: 'A modern wood-and-glass A-frame cottage surrounded by pine and cedar forests, featuring an outdoor hammock right above a rushing mountain river.',
      space: 'Attic-style loft bedroom with glass roof for stargazing, micro-kitchen, cozy reading nook, and private patio projecting over the freshwater stream.',
      amenities: ['Wifi', 'Electric Kettle', 'Kitchen', 'Basic Utensils', 'Hot Water', 'Fridge', 'Outdoor Furniture', 'Patio', 'Balcony', 'Hammock', 'Stargazing Roof', 'Heater'],
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      selfCheckIn: 'Keybox access with pin code',
      maxGuests: 2,
      petsAllowed: true,
      smokingPolicy: 'Allowed on the outdoor patio only',
      securityDeposit: 2000.0,
      cancellationPolicy: '100% refund if cancelled before 7 days of check-in.',
      images: [
        { url: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { serviceType: 'GUIDE' as const, pricePerUnit: 1500.0 },
      ],
    },
    {
      title: 'Mountain Breeze Guest House',
      description: 'Affordable, neat, and highly rated guest house rooms in Dharamshala, close to the Mcleodganj monastery.',
      rules: 'Maintain cleanliness. Inform about late entry.',
      type: 'GUEST_HOUSE' as const,
      latitude: 32.2190,
      longitude: 76.3234,
      altitude: 1457.0,
      basePrice: 1800.0,
      isActive: true,
      isFeatured: false,
      isPopular: false,
      hostId: hosts[1].id,
      about: 'Enjoy stunning valley views and ultimate convenience at our guest house, situated just minutes away from the famous Dalai Lama temple.',
      space: 'Clean, airy, independent double rooms with private attached bathrooms, balconies, and access to a shared scenic rooftop terrace.',
      amenities: ['TV', 'Wifi', 'Bed Linen', 'Wardrobe', 'Ceiling Fan', 'Hot Water', 'Balcony', 'Rooftop Terrace Access', 'Daily Housekeeping'],
      checkInTime: '12:00 PM',
      checkOutTime: '11:00 AM',
      selfCheckIn: 'Front desk manager check-in',
      maxGuests: 3,
      petsAllowed: false,
      smokingPolicy: 'Rooftop smoking zone only',
      securityDeposit: 1000.0,
      cancellationPolicy: '100% refund if cancelled before 3 days of check-in.',
      images: [
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', isFeatured: true, displayOrder: 0 },
      ],
      services: [],
    },
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
          create: services,
        },
      },
    });
    createdProperties.push(property);
  }

  console.log(`✅ Created ${createdProperties.length} properties with complete services/images.`);

  // 4. Create Bookings
  console.log('📅 Creating test bookings...');
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 3);
  const checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + 7);

  const stayNights = 4;
  const baseStayCost = createdProperties[0].basePrice * stayNights;
  const securityDeposit = createdProperties[0].securityDeposit || 0;
  const servicesCost = 0.0;
  const totalCost = baseStayCost + securityDeposit + servicesCost;

  const booking = await prisma.booking.create({
    data: {
      guestId: guests[0].id,
      propertyId: createdProperties[0].id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      baseStayCost,
      servicesCost,
      securityDeposit,
      totalCost,
      status: 'CONFIRMED',
    },
  });

  console.log(`✅ Created active booking for ${guests[0].email} on property: "${createdProperties[0].title}".`);

  // 5. Create Reviews
  console.log('⭐️ Creating test reviews...');
  const reviewsData = [
    {
      userId: guests[0].id,
      propertyId: createdProperties[0].id,
      rating: 5,
      comment: 'An absolutely magical stay! The views from the resort are unmatched, and the staff treated us like family. Highly recommend the guided treks.',
    },
    {
      userId: guests[1].id,
      propertyId: createdProperties[0].id,
      rating: 4,
      comment: 'Excellent luxury resort. The heated pool was amazing. Food could be slightly faster, but the quality was incredible!',
    },
    {
      userId: guests[1].id,
      propertyId: createdProperties[3].id,
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
