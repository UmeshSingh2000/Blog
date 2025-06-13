const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Get token from cookies or Authorization header
        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided' });
        }
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = authenticateToken;