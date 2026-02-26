const mongoose = require('mongoose');

const connect = async () => {
  const atlasUri = process.env.ATLAS_URI;

  if (!atlasUri) {
    throw new Error('ATLAS_URI is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(atlasUri);
  console.log('Database connected');
};

module.exports = connect;
