require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/db');

const userRoutes = require('./routes/user');
const vmcRoutes = require('./routes/vmcRoutes');
const goalRoutes = require('./routes/goalRoutes');
const companyProfileRoutes = require('./routes/companyProfileRoutes');

const app = express();

const corsOptions = {
  origin: ['https://sysline.in', 'https://api.sysline.in', 'http://localhost:3000'],
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


app.use(cors(corsOptions));
// app.options('/*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/companyLogos', express.static(path.join(__dirname, 'uploads/companyLogos')));
app.use('/visions', express.static(path.join(__dirname, 'uploads/visions')));
app.use('/missions', express.static(path.join(__dirname, 'uploads/missions')));
app.use('/cores', express.static(path.join(__dirname, 'uploads/cores')));

// API routes
app.use('/api/user', userRoutes);
app.use('/api/vmc', vmcRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/company-profiles', companyProfileRoutes);

app.get('/', (req, res) => {res.send('Server is running...');});

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully.'))
  .catch((err) => console.error('❌ Database connection failed:', err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
