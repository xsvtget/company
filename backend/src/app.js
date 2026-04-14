const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');
const systemsRoutes = require('./routes/systemsRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const qualificationsRoutes = require('./routes/qualificationsRoutes');
const serviceRequiredSystemsRoutes = require('./routes/serviceRequiredSystemsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'EProvider backend is running 🚀' });
});

app.use('/api/employees', employeeRoutes);
app.use('/api/systems', systemsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/qualifications', qualificationsRoutes);
app.use('/api/service-required-systems', serviceRequiredSystemsRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});