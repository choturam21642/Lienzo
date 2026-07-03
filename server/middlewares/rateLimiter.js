import redisClient from '../config/redis.js';

export const rateLimiter = (limit, windowInSeconds) => {
    return async (req, res, next) => {
        // Use the client's IP address as the unique key
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const key = `rate_limit:${req.baseUrl}${req.path}:${ip}`;

        try {
            // Increment the requests count for this IP
            const currentRequests = await redisClient.incr(key);

            // If it's the first request in the window, set the expiration time
            if (currentRequests === 1) {
                await redisClient.expire(key, windowInSeconds);
            }

            // If they exceed the limit, block the request
            if (currentRequests > limit) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests! Please wait a moment before trying again."
                });
            }

            // If under limit, move to the next step/controller
            next();
        } catch (error) {
            console.error("Rate Limiter Error:", error);
            // Fail open: if Redis has an issue, don't crash the user experience
            next();
        }
    };
};