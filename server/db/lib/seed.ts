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

  // 3. Create Properties of different types
  console.log('🏡 Creating properties with various types, services, and images...');
  const propertiesData = [
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
      images: [
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', isFeatured: true, displayOrder: 0 },
      ],
      services: [],
    },
    {
      title: 'Modern Ridge Apartment',
      description: 'A stylish 2-bedroom modern apartment right next to The Ridge in Shimla, featuring high-speed WiFi, modern kitchen, and superb valley views.',
      rules: 'No loud music after 11 PM. Respect the neighbors.',
      type: 'APARTMENT' as const,
      latitude: 31.1042,
      longitude: 77.1742,
      altitude: 2200.0,
      basePrice: 5000.0,
      isActive: true,
      isFeatured: false,
      isPopular: false,
      hostId: hosts[0].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', isFeatured: true, displayOrder: 0 },
      ],
      services: [
        { serviceType: 'KITCHEN' as const, pricePerUnit: 600.0 },
      ],
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

  const booking = await prisma.booking.create({
    data: {
      userId: guests[0].id,
      propertyId: createdProperties[0].id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice: createdProperties[0].basePrice * 4,
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
