require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-development-key-change-in-prod';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. PostgreSQL Database Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
const initDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL not set. Skipping database initialization.");
    return;
  }
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log("✅ PostgreSQL connected and tables verified.");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};
initDB();

// 2. Nodemailer Configuration
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not fully configured. Email sending will be skipped.");
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};
const transporter = createTransporter();

// Helper to send email alert
const sendEmailAlert = async (name, email, message) => {
  if (!transporter) return;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Cyber Sentinel" <noreply@cybersentinel.com>',
    to: process.env.EMAIL_TO || process.env.SMTP_USER,
    subject: `🚨 Secure Comms Initiated by ${name}`,
    text: `New contact request via Cyber Sentinel:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>New Secure Comms Initiated</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email alert dispatched to ${mailOptions.to}`);
  } catch (error) {
    console.error("❌ Error sending email alert:", error);
  }
};

// 3. API Endpoints

// Subscribe Endpoint
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!process.env.DATABASE_URL) {
    console.log(`[DEV MODE] Subscribed: ${email}`);
    return res.status(201).json({ message: 'Subscribed successfully (Dev Mode)' });
  }

  try {
    const result = await pool.query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id', [email]);
    if (result.rows.length === 0) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    console.log(`[SUBSCRIBE] New subscriber saved to DB: ${email}`);
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error("Database error in /subscribe:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  if (!process.env.DATABASE_URL) {
    console.log(`[DEV MODE] Message from: ${name} (${email})`);
    res.status(201).json({ message: 'Message received successfully (Dev Mode)' });
    // Still try to send email if SMTP is configured
    await sendEmailAlert(name, email, message);
    return;
  }

  try {
    await pool.query('INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)', [name, email, message]);
    console.log(`[CONTACT] New message saved to DB from: ${name} (${email})`);
    
    // Dispatch Email Notification
    await sendEmailAlert(name, email, message);

    res.status(201).json({ message: 'Message received successfully' });
  } catch (error) {
    console.error("Database error in /contact:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Auth Routes ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  if (!process.env.DATABASE_URL) {
    return res.status(501).json({ error: 'Database not configured. Cannot register user.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error("Register error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  if (!process.env.DATABASE_URL) {
    // Mock login for dev if no DB is configured
    if (email === 'admin@cybersentinel.com' && password === 'admin') {
      const token = jwt.sign({ id: 1, email }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { id: 1, email } });
    }
    return res.status(401).json({ error: 'Invalid credentials or DB not configured' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/dashboard/telemetry', verifyToken, async (req, res) => {
  // Protected route for Admin Portal
  try {
    let leads = [];
    let subscribers = [];
    
    if (process.env.DATABASE_URL) {
      const messagesResult = await pool.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 50');
      leads = messagesResult.rows;
      
      const subsResult = await pool.query('SELECT * FROM subscribers ORDER BY created_at DESC LIMIT 50');
      subscribers = subsResult.rows;
    } else {
      // Mock data if no DB
      leads = [{ id: 1, name: 'Alice Mock', email: 'alice@example.com', message: 'Interested in your enterprise plan.', created_at: new Date().toISOString() }];
      subscribers = [{ id: 1, email: 'newsletter@example.com', created_at: new Date().toISOString() }];
    }

    res.json({
      activeThreats: 0,
      nodesSecured: 1042,
      lastScan: new Date().toISOString(),
      leads,
      subscribers
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Dev Mode Memory Store ---
let mockBlogs = [
  {
    id: 1,
    title: "Zero Trust Architecture: A Paradigm Shift",
    slug: "zero-trust-architecture",
    excerpt: "Why the traditional castle-and-moat security model is fundamentally broken in the cloud era.",
    content: "# Zero Trust Architecture\n\nThe traditional network security model assumes that everything on the inside of a corporate network can be trusted. This is fundamentally broken.\n\n## The Cloud Era\nWith remote work and cloud infrastructure, the perimeter is everywhere. Zero Trust assumes breach and verifies every request as if it originates from an open network.\n\n- **Never trust, always verify**\n- **Least privilege access**\n- **Continuous monitoring**",
    created_at: new Date().toISOString()
  }
];

// --- Blog Routes ---

// Get all blogs (Public)
app.get('/api/blogs', async (req, res) => {
  if (!process.env.DATABASE_URL) {
    // Return mock data for dev mode
    return res.json(mockBlogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  }

  try {
    const result = await pool.query('SELECT id, title, slug, excerpt, created_at FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch blogs error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single blog by slug (Public)
app.get('/api/blogs/:slug', async (req, res) => {
  const { slug } = req.params;
  
  if (!process.env.DATABASE_URL) {
    const blog = mockBlogs.find(b => b.slug === slug);
    if (blog) return res.json(blog);
    return res.status(404).json({ error: 'Blog not found' });
  }

  try {
    const result = await pool.query('SELECT * FROM blogs WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Fetch single blog error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new blog (Admin Protected)
app.post('/api/admin/blogs', verifyToken, async (req, res) => {
  const { title, slug, excerpt, content } = req.body;
  if (!title || !slug || !excerpt || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!process.env.DATABASE_URL) {
    if (mockBlogs.some(b => b.slug === slug)) {
      return res.status(409).json({ error: 'A blog with this slug already exists' });
    }
    const newBlog = {
      id: mockBlogs.length + 1,
      title, slug, excerpt, content,
      created_at: new Date().toISOString()
    };
    mockBlogs.push(newBlog);
    return res.status(201).json({ message: 'Blog published successfully (Dev Mode - Memory Store)', id: newBlog.id });
  }

  try {
    const result = await pool.query(
      'INSERT INTO blogs (title, slug, excerpt, content) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, slug, excerpt, content]
    );
    res.status(201).json({ message: 'Blog published successfully', id: result.rows[0].id });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A blog with this slug already exists' });
    }
    console.error("Create blog error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Admin CRUD Routes ---

// Delete a blog
app.delete('/api/admin/blogs/:id', verifyToken, async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(501).json({ error: 'DB not configured' });
  try {
    await pool.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a blog
app.put('/api/admin/blogs/:id', verifyToken, async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(501).json({ error: 'DB not configured' });
  const { title, slug, excerpt, content } = req.body;
  try {
    await pool.query(
      'UPDATE blogs SET title = $1, slug = $2, excerpt = $3, content = $4 WHERE id = $5',
      [title, slug, excerpt, content, req.params.id]
    );
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    console.error("Update blog error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a subscriber
app.delete('/api/admin/subscribers/:id', verifyToken, async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(501).json({ error: 'DB not configured' });
  try {
    await pool.query('DELETE FROM subscribers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a subscriber
app.put('/api/admin/subscribers/:id', verifyToken, async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(501).json({ error: 'DB not configured' });
  try {
    await pool.query('UPDATE subscribers SET email = $1 WHERE id = $2', [req.body.email, req.params.id]);
    res.json({ message: 'Subscriber updated successfully' });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a lead
app.delete('/api/admin/leads/:id', verifyToken, async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(501).json({ error: 'DB not configured' });
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a lead
app.put('/api/admin/leads/:id', verifyToken, async (req, res) => {
  if (!process.env.DATABASE_URL) return res.status(501).json({ error: 'DB not configured' });
  const { name, email, message } = req.body;
  try {
    await pool.query(
      'UPDATE messages SET name = $1, email = $2, message = $3 WHERE id = $4',
      [name, email, message, req.params.id]
    );
    res.json({ message: 'Lead updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = "disconnected";
  if (process.env.DATABASE_URL) {
    try {
      await pool.query('SELECT 1');
      dbStatus = "connected";
    } catch (e) {
      dbStatus = "error";
    }
  }
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    smtp: !!transporter ? 'configured' : 'not_configured'
  });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Cyber Sentinel Backend API is running`);
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Database Mode: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'Dev (No DATABASE_URL provided)'}`);
  console.log(`Email Alerts: ${transporter ? 'Enabled' : 'Disabled (Missing SMTP credentials)'}`);
  console.log(`========================================\n`);
});
