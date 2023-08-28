// /routes/posts.js

import Post from '../schemas/post.js';
import express from 'express';
import joi from "joi";

const router = express.Router();

const createdPostSchema = joi.object({
    value: joi.string().min(1).required(),
});

// 게시글 추가하기 // 
// const PostSchema = new mongoose.Schema({
//     user: {
//         type: String,
//         required: false, // user 필드는 필수 요소입니다. 
//     },
//     password:{
//         type: String,
//         required: false, // password 필드는 필수 요소입니다. 
//     },
//     title:{
//         type: String,
//         required: false, // title 필드는 필수 요소입니다. 
//     },
//     content: {
//         type: String,
//         required: true, // content 필드는 필수 요소입니다. 
//     },
//     createdAt: {
//         type: Date, // doneAt 필드는 Date 타입을 가집니다.
//         required: false, // doneAt 필드는 필수 요소가 아닙니다.
//     },
//     modifiedAt: {
//         type: Date, // doneAt 필드는 Date 타입을 가집니다.
//         required: false, // doneAt 필드는 필수 요소가 아닙니다.
//     },
// });

// 게시글 등록 API // 
router.post('/posts', async (req, res, next) => {
    // 1. 클라이언트에게 전달받은 user, password, title, content 데이터를 변수에 저장합니다.
    const { user, password, title, content} = req.body;

    // user가 존재하지 않을 때, 클라이언트에게 에러 메시지를 전달합니다.
    if (!user) {
        return res
            .status(400)
            .json({ message: '데이터 형식이 올바르지 않습니다' });
    }

    // Post모델을 사용해, MongoDB에서 'order' 값이 가장 높은 '해야할 일'을 찾습니다.
    // const postMaxOrder = await Post.findOne().sort('-order').exec();

    // 'order' 값이 가장 높은 도큐멘트의 1을 추가하거나 없다면, 1을 할당합니다.
    // const order = postMaxOrder ? postMaxOrder.order + 1 : 1;

    // Post모델을 이용해, 새로운 '게시글'을 생성 및 등록.
    const post = new Post({ user, password, title, content});
    // post.createdAt = new Date();

    // 생성한 '게시글'을 MongoDB에 저장합니다.
    await post.save();

    return res.status(201).json({ message: "게시글을 생성하였습니다." });
});

/* 게시물 목록 조회 */
router.get('/posts', async (req, res, next) => {
    // 1. 게시물 목록 조회
    // routers/posts.js 의 Post 모델 사용
    const post_list = await Post.find().sort("-createdAt").exec();
    post_list.forEach((single_post) => {
        console.log(single_post.password);
        delete single_post.password;
    });
        
    console.log(post_list[3].title, post_list[3].password);
    // 2. 게시물 목록 조회 결과를 클라이언트에 반환
    return res.status(200).json({ post_list });
});

/* 게시물 상세 조회 */
router.get('/posts/:postId', async (req, res, next) => {
    // 1. 게시물 상세 조희 
    const { postId } = req.params;
    const post_detail = await Post.findById(postId).exec();
    // console.log(postId, post_detail);
    return res.status(200).json({ post_detail })
})

/* 게시물 수정 */
router.put('/posts/:postId', async (req, res, next) => {
    // 0. 호출된 API 내의 param ("localhost:3000/api/posts//posts/:postId" 중 postId 와 JSON body에서 뽑아내기
    const { postId } = req.params;
    const { password, title, content } = req.body;
    console.log("수정할 postId:", postId, "password: ", password);

    // 1. 수정할 게시물 PostId로 DB에서 찾고 존재한다면 password 찾기
    const post = await Post.findById(postId).exec();
    // DB에 해당 게시물이 없다면 에러메시지
    if (!post) {
        return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' })
    }
    // 2. DB에 있고 입력받은 password와 동일하다면 수정 수행
    if (password === post.password) {
        await Post.updateOne({ _id: postId  }, {$set: {title: title, content: content}} );
        return res.status(200).json({ "message": "게시글을 수정하였습니다." });
    } else if (!password) { //# 400 body 또는 params를 입력받지 못한 경우
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } else {
        console.log("비밀번호가 다릅니다.");
        return res.status(405).json({ message: "비밀번호가 다릅니다." });
    }
})

/* 게시물 삭제 */
router.delete('/posts/:postId', async (req, res, next) => {
    // 0. 호출된 API 내의 param ("localhost:3000/api/posts//posts/:postId" 중 postId 와 JSON body에서 뽑아내기
    const { postId } = req.params;
    const { password } = req.body;
    // console.log("삭제할 postId:", postId, "password: ", password);

    // 1. 삭제할 게시물 PostId로 DB에서 찾고 있다면 password 찾기
    const post = await Post.findById(postId).exec();
    // DB에 해당 게시물이 없다면 에러메시지
    if (!post) {
        return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' })
    }

    // 2. DB에 있고 입력받은 password와 동일하다면 삭제 수행
    if (password === post.password) {
        await Post.deleteOne({ _id: postId });
        return res.status(200).json({ "message": "게시글을 삭제하였습니다." });
    } else if (!password) { //# 400 body 또는 params를 입력받지 못한 경우
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } else {
        console.log("비밀번호가 다릅니다.");
        return res.status(405).json({ message: "비밀번호가 다릅니다." });
    }

})

export default router;
