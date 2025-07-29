const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());
const PORT = process.env.PORT || 5000;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

app.use('/api/snippets', require('./routes/snippets'));

app.use('/api/users', require('./routes/users'));

app.use('/api/ai', require('./routes/ai'));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});