const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

// Sample products data
const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "The latest iPhone with advanced camera system and A17 Pro chip",
    price: 999,
    category: "electronics",
    brand: "Apple",
    images: [
      { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", alt: "iPhone 15 Pro" }
    ],
    stock: 50,
    features: ["A17 Pro Chip", "48MP Camera", "Titanium Design", "USB-C"],
    specifications: {
      display: "6.1-inch Super Retina XDR",
      storage: "128GB",
      camera: "48MP Main Camera",
      battery: "Up to 23 hours video playback"
    },
    tags: ["smartphone", "apple", "premium", "camera"]
  },
  {
    name: "MacBook Air M2",
    description: "Ultra-thin laptop with M2 chip for incredible performance",
    price: 1199,
    category: "electronics",
    brand: "Apple",
    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", alt: "MacBook Air M2" }
    ],
    stock: 30,
    features: ["M2 Chip", "13.6-inch Display", "18-hour Battery", "8GB RAM"],
    specifications: {
      processor: "Apple M2",
      memory: "8GB Unified Memory",
      storage: "256GB SSD",
      display: "13.6-inch Liquid Retina"
    },
    tags: ["laptop", "apple", "m2", "portable"]
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air cushioning",
    price: 150,
    category: "clothing",
    brand: "Nike",
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", alt: "Nike Air Max 270" }
    ],
    stock: 100,
    features: ["Max Air Cushioning", "Breathable Upper", "Rubber Outsole", "Lightweight"],
    specifications: {
      material: "Mesh and Synthetic",
      sole: "Rubber",
      closure: "Lace-up",
      weight: "Lightweight"
    },
    tags: ["shoes", "nike", "running", "sports"]
  },
  {
    name: "Samsung Galaxy S24",
    description: "Premium Android smartphone with advanced AI features",
    price: 799,
    category: "electronics",
    brand: "Samsung",
    images: [
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", alt: "Samsung Galaxy S24" }
    ],
    stock: 75,
    features: ["AI-Powered Camera", "Snapdragon 8 Gen 3", "120Hz Display", "5G"],
    specifications: {
      display: "6.2-inch Dynamic AMOLED",
      processor: "Snapdragon 8 Gen 3",
      storage: "128GB",
      camera: "50MP Main Camera"
    },
    tags: ["smartphone", "samsung", "android", "5g"]
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling wireless headphones",
    price: 399,
    category: "electronics",
    brand: "Sony",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", alt: "Sony WH-1000XM5" }
    ],
    stock: 40,
    features: ["Industry-Leading Noise Canceling", "30-hour Battery", "Quick Charge", "Hi-Res Audio"],
    specifications: {
      battery: "30 hours",
      charging: "Quick Charge (3 min = 3 hours)",
      connectivity: "Bluetooth 5.2",
      weight: "250g"
    },
    tags: ["headphones", "sony", "noise-canceling", "wireless"]
  },
  {
    name: "Adidas Ultraboost 22",
    description: "High-performance running shoes with Boost technology",
    price: 180,
    category: "clothing",
    brand: "Adidas",
    images: [
      { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500", alt: "Adidas Ultraboost 22" }
    ],
    stock: 80,
    features: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Energy Return"],
    specifications: {
      material: "Primeknit",
      sole: "Boost Midsole",
      closure: "Lace-up",
      type: "Running"
    },
    tags: ["shoes", "adidas", "running", "boost"]
  }
];

// Sample admin user
const sampleAdmin = {
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  role: "admin"
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} products`);

    // Create admin user
    const admin = new User(sampleAdmin);
    await admin.save();
    console.log('Created admin user');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
