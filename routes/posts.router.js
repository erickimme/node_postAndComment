import express from 'express';
import Post from '../schemas/post.schemas.js';

const router = express.Router();

// router.get('/posts/test2', async (req, res, next) => {
//     try {
//         console.log("hello posts")
//         const post_list = await Post.find({}, { password: 0 }).sort("-createdAt").exec();
//         const postPrint = post_list.map((post) => {
//             return {
//                 postId: post._id,
//                 user: post.user,
//                 title: post.title,
//                 createdAt: post.createdAt,
//             }
//         });
//         return res.status(200).json({ data: postPrint });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

router.get('/posts/test2', async (req, res, next) => {
    console.log('hello')
    res.status(200).json({ message: "hello" });
})

// 게시글 등록 API // 
router.post('/posts', async (req, res, next) => {
    try {
        const { user, password, title, content } = req.body;

        // Validation: user, title, content  가 존재하지 않을 때, 클라이언트에게 에러 메시지를 전달합니다.
        if (!user || !title || !content) {
            return res
                .status(400)
                .json({ message: '데이터 형식이 올바르지 않습니다' });
        }
        const post = new Post({ user, password, title, content });
        await post.save();
        return res.status(201).json({ message: "게시글을 생성하였습니다." });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/* 게시물 목록 조회 */
router.get('/posts', async (req, res, next) => {
    try {
        console.log("hello posts")
        const post_list = await Post.find({}, { password: 0 }).sort("-createdAt").exec();
        const postPrint = post_list.map((post) => {
            return {
                postId: post._id,
                user: post.user,
                title: post.title,
                createdAt: post.createdAt,
            }
        });
        return res.status(200).json({ data: postPrint });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/* 게시물 상세 조회 */ 
router.get('/posts/:postId', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById({_id: postId}).exec();
        const postDetailPrint = {
                postId: post._id,
                user: post.user,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
            };
        return res.status(200).json({ data: postDetailPrint })
    }
    catch (error) {
        console.error(error);
        next(error);
    }
})

/* 게시물 수정 */
router.put('/posts/:postId', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { password, title, content } = req.body;

        const post = await Post.findById(postId).exec();
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' })
        }
        if (password === post.password) {
            await Post.updateOne({ _id: postId }, { $set: { title: title, content: content } });
            return res.status(200).json({ "message": "게시글을 수정하였습니다." });
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

/* 게시물 삭제 */
router.delete('/posts/:postId', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { password } = req.body;

        const post = await Post.findById(postId).exec();
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' })
        }
        if (password === post.password) {
            await Post.deleteOne({ _id: postId });
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
});

export default router;