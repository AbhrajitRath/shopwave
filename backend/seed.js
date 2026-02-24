require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', isAdmin: true },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
];

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with 30-hour battery life, active noise cancellation, and studio-quality sound.',
    price: 249.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    brand: 'SoundMax',
    stock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 128,
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Handcrafted genuine leather strap with a Swiss quartz movement and sapphire crystal glass.',
    price: 189.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    brand: 'TimeCraft',
    stock: 30,
    featured: true,
    rating: 4.8,
    numReviews: 74,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'TKL layout with Cherry MX Blue switches, per-key RGB lighting, and aircraft-grade aluminum frame.',
    price: 129.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
    brand: 'KeyForce',
    stock: 75,
    featured: true,
    rating: 4.6,
    numReviews: 210,
  },
  {
    name: 'Organic Cotton Hoodie',
    description: 'Sustainably sourced 100% organic cotton French terry. Relaxed fit, unisex sizing.',
    price: 79.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400',
    brand: 'EcoWear',
    stock: 120,
    featured: true,
    rating: 4.3,
    numReviews: 56,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated. Keeps drinks cold 24h, hot 12h. BPA-free, leak-proof lid.',
    price: 34.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    brand: 'HydroFlow',
    stock: 200,
    featured: false,
    rating: 4.7,
    numReviews: 342,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'IPX7 waterproof rating, 360° surround sound, 20h playtime, and built-in powerbank.',
    price: 89.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    brand: 'SoundMax',
    stock: 45,
    featured: false,
    rating: 4.4,
    numReviews: 93,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm non-slip natural rubber mat with alignment lines. Includes carry strap.',
    price: 59.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400',
    brand: 'ZenFlex',
    stock: 80,
    featured: false,
    rating: 4.6,
    numReviews: 167,
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Handmade ceramic dripper, carafe, and two mugs. The perfect morning ritual kit.',
    price: 64.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    brand: 'BrewCraft',
    stock: 40,
    featured: false,
    rating: 4.9,
    numReviews: 88,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log('   Admin: admin@example.com / admin123');

    const createdProducts = await Product.create(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🌱 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
