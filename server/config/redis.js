import { createClient } from 'redis';
import dotenv from 'dotenv';

// Force load the root environment variables
dotenv.config({ path: '../.env.local' });

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('⚡ Connected to Redis Cloud Successfully!'));

// Initialize the cloud database connection
await redisClient.connect();

export default redisClient;