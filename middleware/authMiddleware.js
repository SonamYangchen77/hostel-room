const jwt = require('jsonwebtoken');

// Middleware: Authenticate any logged-in user (admin or user)
exports.ensureAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect('/landing');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.redirect('/landing');
    req.user = decoded; // Attach decoded user info to req
    next();
  });
};

// Middleware: Restrict access to admin users only
exports.ensureAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect('/landing');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.redirect('/login');
    if (decoded.role !== 'admin') return res.redirect('/dashboard');
    req.user = decoded; // Optional, but good for consistency
    next();
  });
};
