export const demoBooks = [
  {
    _id: "book-1",
    title: "Mornings at Ember Harbor",
    author: "Clara Winslow",
    genre: "Fiction",
    description: "A coastal drama with slow-burning secrets.",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1455885666463-1a2f5e7f2f3a?auto=format&fit=crop&w=900&q=80",
    stock: 12,
    rating: 4.6,
    numReviews: 124,
  },
  {
    _id: "book-2",
    title: "Atlas of Quiet Cities",
    author: "Maya Holt",
    genre: "Non-fiction",
    description: "Design essays on small places with big stories.",
    price: 28.0,
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80",
    stock: 8,
    rating: 4.2,
    numReviews: 78,
  },
  {
    _id: "book-3",
    title: "The Pine Needle Society",
    author: "Rowan Vale",
    genre: "Mystery",
    description: "A woodland mystery wrapped in folklore.",
    price: 22.0,
    image:
      "https://images.unsplash.com/photo-1455885666226-7f8a4aa5b8d9?auto=format&fit=crop&w=900&q=80",
    stock: 0,
    rating: 4.4,
    numReviews: 91,
  },
  {
    _id: "book-4",
    title: "Velvet and Ash",
    author: "June Castillo",
    genre: "Romance",
    description: "A romance that lingers long after the last page.",
    price: 16.0,
    image:
      "https://images.unsplash.com/photo-1455885666463-8a6d05c76c3c?auto=format&fit=crop&w=900&q=80",
    stock: 22,
    rating: 4.8,
    numReviews: 210,
  },
  {
    _id: "book-5",
    title: "Echoes of Tomorrow",
    author: "Theo Brenn",
    genre: "Dystopian",
    description: "A near-future saga about memory and belonging.",
    price: 19.5,
    image:
      "https://images.unsplash.com/photo-1449024540548-94f5d5a59230?auto=format&fit=crop&w=900&q=80",
    stock: 9,
    rating: 4.5,
    numReviews: 142,
  },
  {
    _id: "book-6",
    title: "Woven Skies",
    author: "Ari Lennox",
    genre: "Fantasy",
    description: "A sweeping fantasy across floating archipelagos.",
    price: 24.0,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
    stock: 14,
    rating: 4.7,
    numReviews: 156,
  },
];

export const demoCartItems = [
  {
    _id: "book-1",
    book: "book-1",
    title: "Mornings at Ember Harbor",
    author: "Clara Winslow",
    price: 18.0,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1455885666463-1a2f5e7f2f3a?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "book-6",
    book: "book-6",
    title: "Woven Skies",
    author: "Ari Lennox",
    price: 24.0,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
  },
];

export const demoOrders = [
  {
    _id: "order-1024",
    createdAt: "2026-01-12",
    totalPrice: 68.95,
    isPaid: true,
    isDelivered: false,
  },
  {
    _id: "order-1025",
    createdAt: "2026-01-18",
    totalPrice: 42.5,
    isPaid: false,
    isDelivered: false,
  },
  {
    _id: "order-1026",
    createdAt: "2026-01-22",
    totalPrice: 110.2,
    isPaid: true,
    isDelivered: true,
  },
];

export const demoUser = {
  name: "Avery Chen",
  email: "avery@inkandoak.com",
  isAdmin: true,
};
