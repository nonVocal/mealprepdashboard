import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function initializeRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (error) {
    console.error('❌ Redis initialization error:', error);
    throw error;
  }
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

export async function setCache(key: string, value: any, ttl: number = 3600) {
  const client = getRedisClient();
  await client.setEx(key, ttl, JSON.stringify(value));
}

export async function getCache(key: string) {
  const client = getRedisClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function deleteCache(key: string) {
  const client = getRedisClient();
  await client.del(key);
}
