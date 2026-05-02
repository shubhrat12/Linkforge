const express = require('express');
const cors = require('cors');
const { redirectUrl } = require('./controllers/urlController');
const urlRoutes = require('./routes/urls');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// --- ADD THIS BLOCK ---
app.use((req, res, next) => {
  console.log(`👀 Incoming Request: ${req.method} ${req.url}`);
  next();
});
// ----------------------

app.use(cors());
app.use(express.json());
app.set('trust proxy', true); // Essential for accurate IP tracking behind load balancers

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Redirect Route (Root level - must be last so it doesn't swallow API routes)
app.get('/:shortCode', redirectUrl);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, () => console.log(`🚀🚀🚀 SERVER AWAKE ON PORT ${PORT} 🚀🚀🚀`));