import NodeCache from "node-cache";

// Cache instance — items expire after 1 hour by default
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Cache middleware for GET routes (like problems list)
export const cacheMiddleware = (duration) => (req, res, next) => {
    const key = `__cache__${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
        console.log(`Cache HIT: ${key}`);
        return res.json(cached);
    }

    console.log(`Cache MISS: ${key}`);

    // Override res.json to store response in cache
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        if (res.statusCode === 200) {
            cache.set(key, data, duration);
        }
        return originalJson(data);
    };

    next();
};

// Function to get/set cache manually (for AI question caching)
export const getCache = (key) => cache.get(key);
export const setCache = (key, value, ttl = 3600) => cache.set(key, value, ttl);

// Clear specific cache key (when data changes)
export const clearCache = (key) => cache.del(key);

// Get cache stats (useful for debugging)
export const getCacheStats = () => cache.getStats();

export default cache;