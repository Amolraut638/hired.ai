import NodeCache from "node-cache";

// Cache instance — items expire after 1 hour by default
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Keys are per-user so one user's cached response is never served to another.
export const userCacheKey = (userId, url) => `__cache__${userId || "anon"}__${url}`;

// Cache middleware for GET routes. Must run AFTER the auth middleware (needs req.userId).
export const cacheMiddleware = (duration) => (req, res, next) => {
  const key = userCacheKey(req.userId, req.originalUrl);
  const cached = cache.get(key);

  if (cached) {
    console.log(`Cache HIT: ${key}`);
    return res.json(cached);
  }

  console.log(`Cache MISS: ${key}`);

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode === 200) {
      cache.set(key, data, duration);
    }
    return originalJson(data);
  };

  next();
};

export const getCache = (key) => cache.get(key);
export const setCache = (key, value, ttl = 3600) => cache.set(key, value, ttl);
export const clearCache = (key) => cache.del(key);
export const getCacheStats = () => cache.getStats();

export default cache;