import express from 'express';
import { generateImage} from '../controllers/imageController.js';
import userAuth from '../middlewares/auth.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { getRecentGallery } from '../controllers/imageController.js';

const imageRouter = express.Router();

// imageRouter.post('/generate-image',userAuth, generateImage); This line is commented out because we are now using the rateLimiter middleware to limit the number of requests a user can make to generate images. The new line below includes the rateLimiter middleware, which allows a maximum of 5 requests per 60 seconds for image generation.
// This limits users to 5 image generations per 60 seconds
imageRouter.post('/generate-image', userAuth, rateLimiter(5, 60), generateImage);
imageRouter.get('/gallery', getRecentGallery);

export default imageRouter;