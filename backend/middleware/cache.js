const cacheService = require('../config/cache');
const { logger } = require('../config/logger');

/**
 * Middleware for caching GET requests
 * @param {string} keyPrefix - Prefix for cache key (e.g., 'events', 'users')
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 * @param {Function} keyGenerator - Optional custom key generator function
 */
const cache = (keyPrefix, ttl = 3600, keyGenerator = null) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip if cache service is not connected
    if (!cacheService.isConnected) {
      return next();
    }

    try {
      // Generate cache key
      let cacheKey;
      if (keyGenerator) {
        cacheKey = keyGenerator(req);
      } else {
        // Default key generation
        cacheKey = `${keyPrefix}:${req.originalUrl}`;
      }

      // Try to get from cache
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        logger.debug('Cache hit', { 
          key: cacheKey, 
          prefix: keyPrefix,
          requestId: req.get('X-Request-ID') 
        });
        
        // Add cache hit header
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKey);
        
        return res.status(200).json(cachedData);
      }

      // Cache miss - store original json method
      const originalJson = res.json.bind(res);
      
      res.json = (data) => {
        // Only cache successful responses
        if (res.statusCode === 200) {
          cacheService.set(cacheKey, data, ttl)
            .then(() => {
              logger.debug('Response cached', { key: cacheKey });
            })
            .catch(err => {
              logger.error('Failed to cache response', { error: err.message });
            });
        }
        
        // Add cache miss header
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);
        
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', { error: error.message });
      next();
    }
  };
};

/**
 * Middleware to invalidate cache
 * @param {string|string[]} patterns - Cache key patterns to invalidate
 */
const invalidateCache = (patterns) => {
  return async (req, res, next) => {
    // Only invalidate on successful mutations
    const originalJson = res.json.bind(res);
    
    res.json = (data) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const patternList = Array.isArray(patterns) ? patterns : [patterns];
        
        Promise.all(
          patternList.map(pattern => cacheService.invalidatePattern(pattern))
        ).catch(err => {
          logger.error('Failed to invalidate cache', { error: err.message });
        });
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = {
  cache,
  invalidateCache,
};
