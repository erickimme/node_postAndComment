import express from 'express';
import Comment from "../schemas/comment.schemas.js"
import Post from '../schemas/post.schemas.js';


const router = express.Router();


//* 댓글 등록 API *// 
router.post('/posts/:postId/comments', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { user, password, content } = req.body;

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
        const comment = new Comment({ postId: postId, user, password, content });
        await comment.save();
        return res.status(201).json({ comment: comment, message: "댓글을 생성하였습니다." });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/* 댓글 목록 조회 */
router.get('/posts/:postId/comments', async (req, res, next) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res
                .status(400)
                .json({ message: '데이터 형식이 올바르지 않습니다' });
        }
        const commentList = await Comment.find({ postId: postId }, { __v: 0, postId: 0, password: 0 }).sort("-createdAt").exec();
        const commentsPrint = commentList.map((comment) => {
            return {
                commentId: comment._id,
                user: comment.user,
                content: comment.content,
                createdAt: comment.createdAt,
            };
        });
        return res.status(200).json({ data: commentsPrint });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


/* 댓글 수정 */
router.put('/posts/:postId/comments/:commentId', async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const { password, content } = req.body;

        if (!postId || !commentId) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }

        const post = await Post.findOne({ _id: postId }).exec();
        const comments = await Comment.find({ _id: commentId }).exec();
        const comment = comments[0];

        if (!post) {
            return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
        }
        if (!comment) {
            return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' })
        }
        if (password === comment.password) {
            await Comment.updateOne({ _id: commentId }, { $set: { content: content } });
            return res.status(200).json({ message: "댓글을 수정하였습니다." });
        } else if (!password) { //# 400 body 또는 params를 입력받지 못한 경우
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
        } else {
            console.log("비밀번호가 다릅니다.");
            return res.status(405).json({ message: "비밀번호가 다릅니다." });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/* 댓글 삭제 */
router.delete('/posts/:postId/comments/:commentId', async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const { password } = req.body;
        const [post] = await Post.find({ _id: postId }).exec();
        const [comment] = await Comment.find({ _id: commentId }).exec();

        if (!postId || !commentId) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }
        if (!post) {
            return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
        }
        if (!comment) {
            return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' })
        }
        if (password === comment.password) {
            await Comment.deleteOne({ _id: commentId });
            return res.status(200).json({ "message": "게시글을 삭제하였습니다." });
        } else if (!password) { //# 400 body 또는 params를 입력받지 못한 경우
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
        } else {
            console.log("비밀번호가 다릅니다.");
            return res.status(405).json({ message: "비밀번호가 다릅니다." });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

export default router;