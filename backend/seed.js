// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

dotenv.config();

const categories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys'];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ DB Connection Failed:', err);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();
  await Cart.deleteMany();
  console.log('🧹 Cleared all collections');
};

const seedData = async () => {
  try {
    await clearDatabase();

    // 1️⃣ Create Users
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        address: { street: 'Admin Street', city: 'Nairobi', country: 'Kenya' },
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        role: 'user',
        address: { street: 'Ngong Road', city: 'Nairobi', country: 'Kenya' },
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        role: 'user',
        address: { street: 'Moi Avenue', city: 'Nakuru', country: 'Kenya' },
      },
    ]);

    console.log(`👥 Created ${users.length} users`);

    // 2️⃣ Create Products
    const products = [];
    for (let i = 0; i < 15; i++) {
      const category = categories[i % categories.length];
      products.push({
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i + 1}`,
        description: `High quality ${category} product.`,
        price: (Math.random() * 5000 + 500).toFixed(2),
        category,
        brand: `Brand ${String.fromCharCode(65 + (i % 5))}`,
        images: [
          { url: `https://picsum.photos/400?random=${i}`, alt: `${category} image ${i + 1}` },
        ],
        stock: Math.floor(Math.random() * 50) + 5,
        rating: Math.floor(Math.random() * 5) + 1,
        features: ['Durable', 'Lightweight', 'Affordable'],
        tags: [category, 'sale'],
      });
    }

    const createdProducts = await Product.insertMany(products);
    console.log(`🛒 Created ${createdProducts.length} products`);

    // 3️⃣ Create Carts
    const sampleCart = await Cart.create({
      user: users[1]._id,
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 2,
          price: createdProducts[0].price,
        },
        {
          product: createdProducts[1]._id,
          quantity: 1,
          price: createdProducts[1].price,
        },
      ],
    });

    console.log(`🛍️ Created sample cart for ${users[1].name}`);

    // 4️⃣ Create Orders
    const sampleOrder = await Order.create({
      orderNumber: `ORD-${Date.now()}`,
      user: users[2]._id,
      items: [
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          image: createdProducts[2].images[0].url,
          quantity: 1,
          price: createdProducts[2].price,
        },
      ],
      shippingAddress: {
        street: 'Kenyatta Avenue',
        city: 'Mombasa',
        state: 'Mombasa',
        zipCode: '80100',
        country: 'Kenya',
      },
      paymentMethod: 'paypal',
      itemsPrice: createdProducts[2].price,
      totalPrice: createdProducts[2].price,
      isPaid: true,
      paidAt: new Date(),
      status: 'delivered',
    });

    console.log(`📦 Created sample order for ${users[2].name}`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedData();
};

run();
