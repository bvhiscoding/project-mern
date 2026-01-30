const Book = require('../models/Book');
const User = require('../models/User');
const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    description:
      'A classic American novel about the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.',
    price: 12.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81Q6WkLhX4L.jpg',
    stock: 50,
    rating: 4.5,
    numReviews: 120,
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    description:
      'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
    price: 14.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
    stock: 30,
    rating: 4.8,
    numReviews: 250,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description:
      'A novel about racial injustice and the loss of innocence in the American South.',
    price: 11.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81gepf1eMqL.jpg',
    stock: 40,
    rating: 4.7,
    numReviews: 180,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description:
      'A romantic novel following the emotional development of Elizabeth Bennet.',
    price: 9.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg',
    stock: 60,
    rating: 4.6,
    numReviews: 200,
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    description:
      'A story about teenage alienation and loss of innocence in the modern world.',
    price: 10.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg',
    stock: 35,
    rating: 4.3,
    numReviews: 95,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description:
      'A fantasy novel about the adventures of hobbit Bilbo Baggins.',
    price: 16.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg',
    stock: 45,
    rating: 4.9,
    numReviews: 300,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description:
      'The first book in the Harry Potter series about a young wizard.',
    price: 19.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg',
    stock: 100,
    rating: 4.9,
    numReviews: 500,
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    description:
      'A mystery thriller involving the discovery of a secret kept hidden for centuries.',
    price: 13.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/91Q5dCjc2KL.jpg',
    stock: 25,
    rating: 4.2,
    numReviews: 150,
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    description:
      "A philosophical book about a shepherd boy's journey to find treasure.",
    price: 11.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
    stock: 55,
    rating: 4.7,
    numReviews: 220,
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    description:
      'A dystopian novel set in a futuristic World State of genetically modified citizens.',
    price: 13.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81zE42gT3xL.jpg',
    stock: 28,
    rating: 4.4,
    numReviews: 130,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'Non-fiction',
    description:
      'A sweeping exploration of human history from the Stone Age to today.',
    price: 21.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg',
    stock: 42,
    rating: 4.6,
    numReviews: 310,
  },
  {
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    genre: 'Fantasy',
    description:
      'A magical competition unfolds within a mysterious traveling circus.',
    price: 15.99,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81X7G5z5J-L.jpg',
    stock: 27,
    rating: 4.5,
    numReviews: 170,
  },
];
const seedBooks = async () => {
  try {
    await Book.deleteMany();
    await Book.insertMany(sampleBooks);
    console.log('Sample books seeded successfully');
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
  }
};

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@bookstore.dev',
    password: 'Admin123!',
    isAdmin: true,
  },
  {
    name: 'Regular User',
    email: 'user@bookstore.dev',
    password: 'User123!',
    isAdmin: false,
  },
];

const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.create(sampleUsers);
    console.log('Sample users seeded successfully');
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
  }
};

module.exports = { seedBooks, sampleBooks, seedUsers, sampleUsers };
