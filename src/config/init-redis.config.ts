import Redis from 'ioredis';
import {app} from '@/config/settings';

class RedisClient {
    private static instance: Redis;

    public static getInstance(): Redis {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis({
                host: app('redis.host'),
                port: app('redis.port'),
                password: app('redis.password'),
            });

            RedisClient.instance.on('error', (error) => {
                console.error('Redis connection error', error);
            });

            RedisClient.instance.on('connect', () => {
                console.debug('Connected to Redis');
            });
        }

        return RedisClient.instance;
    }

    public static async close(): Promise<void> {
        if (RedisClient.instance) {
            try {
                await RedisClient.instance.quit();

                console.debug('Redis connection closed gracefully');
            } catch (error) {
                console.error('Error closing Redis connection', error);

                throw error;
            }
        }
    }
}

export const getRedisClient = (): Redis => RedisClient.getInstance();
export const redisClose = RedisClient.close;
