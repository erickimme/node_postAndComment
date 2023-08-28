// /routes/comments.js

import Comment from '../schemas/comment.js';
import express from 'express';
import joi from "joi";

const router = express.Router();

const createdCommentSchema = joi.object({
    value: joi.string().min(1).required(),
});

// 코멘트
// const CommentSchema = new mongoose.Schema(
//   {
//     user: {
//       type: String,
//       required: true, // user 필드는 필수 요소입니다. 
//     },
//     password: {
//       type: String,
//       required: true, // password 필드는 필수 요소입니다. 
//     },
//     content: {
//       type: String,
//       required: true, // content 필드는 필수 요소입니다. 
//     }
//   },
//   // createdAt: {
//   //   type: Date, // doneAt 필드는 Date 타입을 가집니다.
//   //   required: false, // doneAt 필드는 필수 요소가 아닙니다.
//   // },
//   // modifiedAt: {
//   //   type: Date, // doneAt 필드는 Date 타입을 가집니다.
//   //   required: false, // doneAt 필드는 필수 요소가 아닙니다.
//   // },
//   {
//     timestamps: true,
//   }
// );

//* 댓글 등록 API *// 
router.post('/posts/:postId/comments', async (req, res, next) => {
    // 1. 클라이언트에게 전달받은 user, password, title, content 데이터를 변수에 저장합니다.
    const { user, password, content } = req.body;
    // console.log(req.body);

    // user가 존재하지 않을 때, 클라이언트에게 에러 메시지를 전달합니다.
    if (!user) {
        return res
            .status(400)
            .json({ message: '데이터 형식이 올바르지 않습니다' });
    }
    if (!content) {
        return res
            .status(400)
            .json({ message: '댓글 내용을 입력해주세요.' });
    }
    // comment모델을 이용해, 새로운 '댓글'을 생성 및 등록.
    const comment = new Comment({ user, password, content });

    // 생성한 '댓글'을 MongoDB에 저장합니다.
    await comment.save();

    return res.status(201).json({ comment: comment, message: "댓글을 생성하였습니다." });
});

/* 댓글 목록 조회 */
router.get('/posts/:postId/comments', async (req, res, next) => {
    // 1. 게시물 목록 조회
    // routers/posts.js 의 Post 모델 사용
    const comment_list = await Comment.find().sort("-createdAt").exec();

    // 2. 게시물 목록 조회 결과를 클라이언트에 반환
    return res.status(200).json({ comment_list });
});


/* 댓글 수정 */
router.put('/posts/:postId/comments/:commentId', async (req, res, next) => {
    // 0. 호출된 API 내의 param ("localhost:3000/api/posts//posts/:postId" 중 postId 와 JSON body에서 뽑아내기
    const { postId, commentId } = req.params;
    const { password, content } = req.body;
    console.log("수정할 postId:", postId, "수정할 commentId:", commentId, "password: ", password);
    console.log(req.body);

    // 1. 수정할 댓글 Commentㅑㅇ DB에서 찾고 존재한다면 password 찾기
    const comment = await Comment.findById(commentId).exec();
    // DB에 해당 게시물이 없다면 에러메시지
    if (!content) {
        return res
            .status(400)
            .json({ message: '댓글 내용을 입력해주세요.' });
    }
    if (!comment) {
        return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' })
    }
    // 2. DB에 있고 입력받은 password와 동일하다면 수정 수행
    if (password === comment.password) {
        await Comment.updateOne({ _id: commentId  }, {$set: {content: content}} );
        return res.status(200).json({ "message": "댓글을 수정하였습니다." });
    } else if (!password) { //# 400 body 또는 params를 입력받지 못한 경우
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } else {
        console.log("비밀번호가 다릅니다.");
        return res.status(405).json({ message: "비밀번호가 다릅니다." });
    }
})

/* 댓글 삭제 */
router.delete('/posts/:postId/comments/:commentId', async (req, res, next) => {
    // 0. 호출된 API 내의 param ("localhost:3000/api/posts//posts/:postId" 중 postId 와 JSON body에서 뽑아내기
    const { postId, commentId } = req.params;
    const { password } = req.body;
    console.log("삭제할 postId:", postId, "삭제할 commentId:", commentId, "password: ", password);

    // 1. 삭제할 댓글 PostId로 DB에서 찾고 있다면 password 찾기
    const comment = await Comment.findById(commentId).exec();
    // DB에 해당 게시물이 없다면 에러메시지
    if (!comment) {
        return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' })
    }

    // 2. DB에 있고 입력받은 password와 동일하다면 삭제 수행
    if (password === comment.password) {
        await Comment.deleteOne({ _id: commentId });
        return res.status(200).json({ "message": "게시글을 삭제하였습니다." });
    } else if (!password) { //# 400 body 또는 params를 입력받지 못한 경우
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } else {
        console.log("비밀번호가 다릅니다.");
        return res.status(405).json({ message: "비밀번호가 다릅니다." });
    }

})



export default router;