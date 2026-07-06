import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function readToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7);
}

// Rejects the request unless a valid token is present. Attaches req.userId.
export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Attaches req.userId if a valid token is present, otherwise continues as a guest.
export function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try {
      req.userId = jwt.verify(token, JWT_SECRET).userId;
    } catch {
      // ignore bad token — treat as guest
    }
  }
  next();
}

export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
