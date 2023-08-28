// schemas/comment.js

import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true, // user 필드는 필수 요소입니다. 
    },
    password: {
      type: String,
      required: true, // password 필드는 필수 요소입니다. 
    },
    content: {
      type: String,
      required: true, // content 필드는 필수 요소입니다. 
    }
  },
  // createdAt: {
  //   type: Date, // doneAt 필드는 Date 타입을 가집니다.
  //   required: false, // doneAt 필드는 필수 요소가 아닙니다.
  // },
  // modifiedAt: {
  //   type: Date, // doneAt 필드는 Date 타입을 가집니다.
  //   required: false, // doneAt 필드는 필수 요소가 아닙니다.
  // },
  {
    timestamps: true,
  }
);

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
CommentSchema.virtual('commentId').get(function () {
  return this._id.toHexString();
});
CommentSchema.set('toJSON', {
  virtuals: true,
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Comment', CommentSchema);