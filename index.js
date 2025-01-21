const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (replace with a real database in production)
const users = [];
const books = [];
const authors = [];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', [
  body('phone').notEmpty(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, password } = req.body;

  // Check if user exists
  if (users.find(u => u.phone === phone)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create new user
  const user = {
    id: users.length + 1,
    phone,
    password: hashedPassword
  };
  
  users.push(user);

  // Generate token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  
  res.status(201).json({ token });
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  
  const user = users.find(u => u.phone === phone);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a real implementation, you might want to blacklist the token
  res.status(200).json({ message: 'Logged out successfully' });
});

// Protected routes
app.get('/api/books', authenticateToken, (req, res) => {
  res.json(books);
});

app.get('/api/authors', authenticateToken, (req, res) => {
  res.json(authors);
});

app.get('/api/books/:id', authenticateToken, (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

app.get('/api/authors/:id', authenticateToken, (req, res) => {
  const author = authors.find(a => a.id === parseInt(req.params.id));
  if (!author) {
    return res.status(404).json({ message: 'Author not found' });
  }
  res.json(author);
});

app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Don't send password in response
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.get('/api/books/recent', authenticateToken, (req, res) => {
  // In a real implementation, you would sort by date and limit the results
  res.json(books.slice(0, 10));
});

app.get('/api/reading-progress/current', authenticateToken, (req, res) => {
  // Mock reading progress data
  res.json({
    currentBook: null,
    pagesRead: 0,
    totalPages: 0
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});