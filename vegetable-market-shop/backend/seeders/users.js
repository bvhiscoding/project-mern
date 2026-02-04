const users = [
  {
    name: 'Admin User',
    email: 'admin@vegmarket.com',
    password: '123456',
    phone: '0900000001',
    address: {
      street: '1 Admin Street',
      city: 'Ho Chi Minh City',
      state: 'HCM',
      zipCode: '700000',
      country: 'Vietnam',
    },
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'Nguyen Minh',
    email: 'minh@vegmarket.com',
    password: '123456',
    phone: '0900000002',
    address: {
      street: '12 Green Road',
      city: 'Da Nang',
      state: 'DN',
      zipCode: '550000',
      country: 'Vietnam',
    },
    role: 'customer',
  },
  {
    name: 'Tran Hoa',
    email: 'hoa@vegmarket.com',
    password: '123456',
    phone: '0900000003',
    address: {
      street: '45 Fresh Lane',
      city: 'Ha Noi',
      state: 'HN',
      zipCode: '100000',
      country: 'Vietnam',
    },
    role: 'customer',
  },
  {
    name: 'Le An',
    email: 'an@vegmarket.com',
    password: '123456',
    phone: '0900000004',
    address: {
      street: '78 Market Avenue',
      city: 'Can Tho',
      state: 'CT',
      zipCode: '900000',
      country: 'Vietnam',
    },
    role: 'customer',
  },
];

module.exports = users;
