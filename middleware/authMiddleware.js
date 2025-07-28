const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key_here';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT:', decoded);
req.user = { userId: decoded.userId, role: decoded.role, email: decoded.email, companyId: decoded.companyId };

    //  req.user = {
    //   id: decoded.userId,   
    //   role: decoded.role,
    //   email: decoded.email
    // };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

