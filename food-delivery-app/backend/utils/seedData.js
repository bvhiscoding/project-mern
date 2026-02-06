const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
require('dotenv').config();

const seedRestaurants = [
  {
    name: "Italian Delight",
    description: "Authentic Italian cuisine",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    rating: 4.5,
    cuisine: "Italian",
    deliveryTime: "30-40 mins",
    menu: [
      {
        name: "Pasta Alfredo",
        description: "Creamy pasta with parmesan cheese",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300",
        category: "main"
      },
      {
        name: "Margherita Pizza",
        description: "Classic tomato and mozzarella pizza",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300",
        category: "main"
      },
      {
        name: "Tiramisu",
        description: "Classic Italian dessert",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300",
        category: "dessert"
      }
    ]
  },
  {
    name: "Asian Fusion",
    description: "Modern Asian cuisine",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    rating: 4.2,
    cuisine: "Asian",
    deliveryTime: "25-35 mins",
    menu: [
      {
        name: "Sushi Platter",
        description: "Assorted fresh sushi",
        price: 18.99,
        category: "main"
      },
      {
        name: "Pad Thai",
        description: "Stir-fried rice noodles",
        price: 11.99,
        category: "main"
      },
      {
        name: "Spring Rolls",
        description: "Fresh vegetable spring rolls",
        price: 5.99,
        category: "appetizer"
      }
    ]
  },
  {
    name: "Burger House",
    description: "Gourmet burgers and fries",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    rating: 4.0,
    cuisine: "American",
    deliveryTime: "20-30 mins",
    menu: [
      {
        name: "Classic Burger",
        description: "Beef patty with lettuce and tomato",
        price: 9.99,
        category: "main"
      },
      {
        name: "Cheese Fries",
        description: "Crispy fries with melted cheese",
        price: 4.99,
        category: "appetizer"
      },
      {
        name: "Milkshake",
        description: "Vanilla milkshake",
        price: 3.99,
        category: "beverage"
      }
    ]
  },
  {
    name: "Taco Fiesta",
    description: "Authentic Mexican food",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    rating: 4.3,
    cuisine: "Mexican",
    deliveryTime: "25-35 mins",
    menu: [
      {
        name: "Beef Tacos",
        description: "3 tacos with seasoned beef",
        price: 8.99,
        category: "main"
      },
      {
        name: "Nachos Supreme",
        description: "Tortilla chips with toppings",
        price: 7.99,
        category: "appetizer"
      },
      {
        name: "Churros",
        description: "Sweet fried dough with cinnamon",
        price: 5.99,
        category: "dessert"
      }
    ]
  },
  {
    name: "Veggie Garden",
    description: "Healthy vegetarian options",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    rating: 4.6,
    cuisine: "Vegetarian",
    deliveryTime: "20-30 mins",
    menu: [
      {
        name: "Buddha Bowl",
        description: "Quinoa, veggies, and tahini",
        price: 10.99,
        category: "main"
      },
      {
        name: "Green Smoothie",
        description: "Spinach, banana, and almond milk",
        price: 4.99,
        category: "beverage"
      },
      {
        name: "Veggie Wrap",
        description: "Fresh vegetables in whole wheat wrap",
        price: 7.99,
        category: "main"
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing restaurants
    await Restaurant.deleteMany();
    console.log('🗑️  Cleared existing restaurants');

    // Insert seed data
    await Restaurant.insertMany(seedRestaurants);
    console.log('✅ Database seeded successfully with 5 restaurants!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
