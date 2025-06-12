require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const { pool, ensureUsersTable, ensureHostelsTable, insertHostel, query } = require('./config/db');
const { ensureRoomsTable } = require('./models/Room');
const { ensureApplicationsTable } = require('./models/Application');
const { ensureActivitiesTable } = require('./models/Activity');
const studentController = require('./controllers/studentController');
const authController = require('./controllers/authController');
const { ensureHostelsTable, insertHostel } = require('./models/Hostel');

const authRoutes = require('./routes/authRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reportRoutes = require('./routes/reportRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure session table
async function ensureSessionTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log('✅ Session table ensured');
  } catch (err) {
    console.error('❌ Failed to create session table:', err);
    throw err;
  }
}

// Initialization function to ensure all tables and seed data
async function init() {
  await ensureUsersTable();
  await ensureHostelsTable();
  await ensureRoomsTable();
  await ensureApplicationsTable();
  await ensureActivitiesTable();
  await ensureSessionTable();

  // Insert default hostel if none exist
  const hostelsResult = await query('SELECT * FROM hostels');
  if (hostelsResult.rows.length === 0) {
    const newHostel = await insertHostel('Green Hostel', 'Male');
    console.log('Inserted default hostel:', newHostel);
  }
}

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Route mounting
app.use('/auth', authRoutes);
app.use('/', availabilityRoutes);
app.use('/', adminRoutes);
app.use('/', studentRoutes);
app.use('/', roomRoutes);
app.use('/', reportRoutes);
app.use('/api/hostels', require('./routes/hostelRoutes'));
app.use('/', applicationRoutes);
app.use('/', dashboardRoutes);

// Views
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/home');
  res.render('landing', { error: null, success: null });
});

app.get('/dashboard', async (req, res) => {
  try {
    const result = await query('SELECT COUNT(*) FROM users');
    const totalStudents = result.rows[0].count;
    res.render('dashboard', { totalStudents });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Error loading dashboard');
  }
});

app.get('/home', async (req, res) => {
  try {
    const userResult = await query('SELECT COUNT(*) FROM users');
    const totalUsers = userResult.rows[0].count;

    const hostelResult = await query('SELECT COUNT(*) FROM hostels');
    const totalHostels = hostelResult.rows[0].count;

    res.render('home', {
      totalUsers,
      totalHostels,
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).send('Server error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Logout error:', err);
      return res.redirect('/home');
    }
    res.clearCookie('userEmail');
    res.redirect('/');
  });
});

app.get('/availability', (req, res) => {
  res.render('availability');
});

app.get('/student-management', studentController.getStudentManagementPage);
app.get('/verify', authController.verifyEmail);

app.get('/reset-password', (req, res) => {
  res.redirect(`/auth/reset-password?token=${req.query.token || ''}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('landing', {
    error: 'Unexpected server error. Please try again later.',
    success: null
  });
});

// Start server after initialization
init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to set up database:", err);
    process.exit(1);
  });
