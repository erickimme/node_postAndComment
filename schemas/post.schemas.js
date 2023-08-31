import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// PostSchema 모델 
export default mongoose.model('Post', PostSchema);