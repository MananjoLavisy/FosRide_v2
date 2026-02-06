// Simple auth: client sends x-user-id and x-user-role headers after login
const auth = (req, res, next) => {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!userId || !role) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  req.user = { id: userId, role };
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { auth, requireRole };
