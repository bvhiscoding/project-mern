const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

const users = require('./users');
const products = require('./products');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const importData = async () => {
  try {
    await connectDB();

    await Review.deleteMany();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const hashedUsers = users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    }));

    await User.insertMany(hashedUsers);
    await Product.insertMany(products);

    console.log('Data Imported');
    process.exit();
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Review.deleteMany();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed');
    process.exit();
  } catch (error) {
    console.error(`Destroy error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
