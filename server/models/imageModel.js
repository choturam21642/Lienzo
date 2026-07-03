import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    resultImage: { type: String, required: true }, // Stores the base64 string
    authorName: { type: String, required: true },  // To show who generated it in the gallery
}, { timestamps: true });

const imageModel = mongoose.models.image || mongoose.model("image", imageSchema);

export default imageModel;