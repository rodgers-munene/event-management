const redis = require('redis');
const { logger } = require('./logger');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.isRedisAvailable = process.env.REDIS_URL ? true : false;
  }

  async connect() {
    if (!this.isRedisAvailable) {
      logger.warn('Redis not configured. Running without cache.');
      return;
    }

    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error', { error: err.message });
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis connected successfully');
        this.isConnected = true;
      });

      await this.client.connect();
      this.isConnected = true;
      logger.info('Redis cache service initialized');
    } catch (error) {
      logger.error('Failed to connect to Redis', { error: error.message });
      this.isConnected = false;
    }
  }

  async get(key) {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache GET error', { key, error: error.message });
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const stringValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, stringValue);
      return true;
    } catch (error) {
      logger.error('Cache SET error', { key, error: error.message });
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Cache DEL error', { key, error: error.message });
      return false;
    }
  }

  async invalidatePattern(pattern) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.info(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
      }
      return true;
    } catch (error) {
      logger.error('Cache invalidate pattern error', { pattern, error: error.message });
      return false;
    }
  }

  // Cache middleware for Express routes
  cache(ttl = 3600) {
    return async (req, res, next) => {
      if (!this.isConnected) {
        return next();
      }

      const key = `cache:${req.originalUrl}`;
      
      try {
        const cachedData = await this.get(key);
        if (cachedData) {
          logger.debug('Cache hit', { key });
          return res.status(200).json(cachedData);
        }
      } catch (error) {
        logger.error('Cache middleware error', { error: error.message });
      }

      // Store original json method
      const originalJson = res.json.bind(res);
      
      res.json = (data) => {
        // Cache the response
        this.set(key, data, ttl).catch(err => {
          logger.error('Failed to cache response', { error: err.message });
        });
        
        return originalJson(data);
      };

      next();
    };
  }

  async disconnect() {
    if (this.isConnected && this.client) {
      await this.client.quit();
      logger.info('Redis disconnected');
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;
