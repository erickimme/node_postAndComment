import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// CommentSchema 모델 생성
export default mongoose.model('Comment', CommentSchema);