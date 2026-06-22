const mongoose = require('mongoose');

const uri = 'mongodb+srv://vijay:uYkh1qS8q1rF5xdP@atlascluster.5bqstxh.mongodb.net/collage';

console.log('Connecting to database...');
mongoose.connect(uri)
  .then(() => {
    console.log('Success! Connected to MongoDB Atlas.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
