// ================================================
// PORTFOLIO BACKEND - LOCAL MONGODB COMPASS KE SAATH
// ================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ================================================
// MONGODB CONNECTION - LOCAL COMPASS SE CONNECT
// Compass install kar liya hai toh yeh kaam karega
// ================================================
mongoose.connect('mongodb://localhost:27017/portfolioDB')
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ================================================
// SCHEMA - Message ka structure
// ================================================
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// ================================================
// API ROUTE - Form submit yahan aayega
// ================================================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all fields' 
      });
    }
    
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    
    console.log(`✅ Message saved: ${name} - ${email}`);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ================================================
// Saare messages dekhne ke liye (Admin)
// Browser mein http://localhost:3000/api/messages
// ================================================
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend serve karna
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📝 See messages at http://localhost:${PORT}/api/messages`);
});