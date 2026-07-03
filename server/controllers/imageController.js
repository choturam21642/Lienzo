// import axios from "axios";
// import userModel from "../models/userModel.js";
// import FormData from 'form-data';

// export const generateImage = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const {prompt} = req.body;
//         const user = await userModel.findById(userId);
//         if(!user || !prompt){
//             return res.json({success: false, message: 'Missing Details'});
//         }

//         if(user.creditBalance===0 || user.creditBalance<0){
//             return res.json({success: false, message: 'No Credit Balance',creditBalance: user.creditBalance});
//         }

//         const formData = new FormData();
//         formData.append('prompt', prompt);

//         const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
//             headers: {
//                 'x-api-key': process.env.CLIPDROP_API,
//             },
//             responseType: 'arraybuffer'
//         });

//         const base64Image = Buffer.from(data, 'binary').toString('base64');
//         const resultImage = `data:image/png;base64,${base64Image}`;

//         await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1});

//         res.json({success: true, message: "Image Generated", creditBalance: user.creditBalance - 1,resultImage});

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message});
//     }
// }



import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from 'form-data';
import redisClient from "../config/redis.js"; // 🔥 Import Redis
import imageModel from "../models/imageModel.js";

export const generateImage = async (req, res) => {
    const userId = req.userId;
    const lockKey = `lock:generate:${userId}`;
    const creditCacheKey = `user:credits:${userId}`;

    try {
        const { prompt } = req.body;
        const user = await userModel.findById(userId);
        
        if (!user || !prompt) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance });
        }

        // 🔥 OPTION 3: Set an Idempotency Lock in Redis for 10 seconds
        // 'NX' means it will only set the key if it doesn't already exist
        const setLock = await redisClient.set(lockKey, 'locked', {
            EX: 10,
            NX: true
        });

        if (!setLock) {
            return res.status(429).json({ 
                success: false, 
                message: 'An image generation is already in progress. Please wait a few seconds!' 
            });
        }

        // Call ClipDrop API
        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        const newBalance = user.creditBalance - 1;

        // Update MongoDB Balance
        await userModel.findByIdAndUpdate(user._id, { creditBalance: newBalance });

        // 🔥 OPTION 1: Update the Credits Cache in Redis to keep it synchronized
        const updatedCacheData = {
            credits: newBalance,
            name: user.name
        };
        await redisClient.setEx(creditCacheKey, 3600, JSON.stringify(updatedCacheData));

        // 🔥 Release the lock since generation succeeded
        await redisClient.del(lockKey);

        // Save the newly generated image to the public gallery database
        const newPublicImage = new imageModel({
            userId: user._id,
            prompt,
            resultImage,
            authorName: user.name
        });
        await newPublicImage.save();

        res.json({ success: true, message: "Image Generated", creditBalance: newBalance, resultImage });

    } catch (error) {
        console.log(error.message);
        
        // 🔥 Release the lock on failure so the user isn't frozen out if the API fails
        await redisClient.del(lockKey);
        
        res.json({ success: false, message: error.message });
    }
}


// 🔥 OPTION 2: Fetch and Cache Latest Creations for Community Gallery
export const getRecentGallery = async (req, res) => {
    const galleryCacheKey = 'gallery:recent';

    try {
        
        // await redisClient.del(galleryCacheKey);
        // 1. Try fetching gallery from Redis
        const cachedGallery = await redisClient.get(galleryCacheKey);
        
        if (cachedGallery) {
            console.log("⚡ Serving Gallery from Redis Cache!");
            return res.json({ success: true, images: JSON.parse(cachedGallery) });
        }

        // 2. Cache Miss - Fetch latest 20 images from MongoDB
        console.log("📁 Cache Miss! Fetching Gallery from MongoDB...");
        const latestImages = await imageModel.find({})
            .sort({ createdAt: -1 })
            .limit(20);

        // 3. Save to Redis with a 5-minute TTL (300 seconds)
        await redisClient.setEx(galleryCacheKey, 300, JSON.stringify(latestImages));

        res.json({ success: true, images: latestImages });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};