const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes'); // or wherever your file is
app.use('/api/users', userRoutes);

const meRoute = require('./api/users/me');
app.use('/api/users/me', meRoute);

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
  