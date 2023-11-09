const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");

// 댓글 생성 API
router.post("/posts/:_postId/comments", async (req, res) => {
    const { user, password, content } = req.body;
    const postId = req.params._postId;
    // 게시물 존재 여부 확인
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
        return res.status(404).json({ errorMessage: "게시물을 찾을 수 없습니다." });
    }
    if (!user || !password || !content) {
        return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    // 패스워드를 해시로 변환
    bcrypt.hash(password, 10, async (hashError, hashPassword) => {
        if (hashError) {
            return res.status(500).json({ errorMessage: "비밀번호 해싱 중 오류가 발생했습니다." });
        }

        // MongoDB를 사용하여 댓글 생성
        try {
            const newComment = await Comment.create({
                postId,
                user,
                content,
                password: hashPassword,
            });
            res.json({ message: '댓글을 생성하였습니다.', commentId: newComment._id });
        } catch (error) {
            res.status(500).json({ errorMessage: "댓글을 생성하는 중 오류가 발생했습니다." });
        }
    });
});

// 댓글 목록 조회 API
router.get("/posts/:_postId/comments", async (req, res) => {
    try {
        const postId = req.params._postId;
        const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 });
        const responseData = comments.map((comment) => {
            return {
                commentId: comment._id,
                user: comment.user,
                content: comment.content,
                createdAt: comment.createdAt,
            };
        });
        res.status(200).json({ data: responseData });
    } catch (error) {
        res.status(500).json({ errorMessage: '댓글을 조회하는 중 오류가 발생했습니다.' });
    }
});

// 댓글 상세 조회 API
router.get("/posts/:_postId/comments/:_commentId", async (req, res) => {
    const postId = req.params._postId;
    const commentId = req.params._commentId;
    try {
        const existingComment = await Comment.findOne({ _id: commentId, postId: postId });
        if (!existingComment) {
            return res.status(404).json({ errorMessage: "댓글을 찾을 수 없습니다." });
        }
        res.status(200).json({ data: existingComment });
    } catch (error) {
        res.status(500).json({ errorMessage: '댓글을 조회하는 중 오류가 발생했습니다.' });
    }
});

// 댓글 수정 API
router.put("/posts/:_postId/comments/:_commentId", async (req, res) => {
    const postId = req.params._postId;
    const commentId = req.params._commentId;
    const { password, content } = req.body;
    if (!password || !content) {
        return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    // 댓글 존재 여부 확인
    const existingComment = await Comment.findOne({ _id: commentId, postId: postId });
    if (!existingComment) {
        return res.status(404).json({ errorMessage: "댓글을 찾을 수 없습니다." });
    }
    // 비밀번호 해시 비교
    bcrypt.compare(password, existingComment.password, async (compareError, isMatch) => {
        if (compareError || !isMatch) {
            return res.status(403).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
        }

        // 댓글 수정
        existingComment.content = content;
        try {
            await existingComment.save();
            res.status(200).json({ message: "댓글을 수정하였습니다." });
        } catch (error) {
            res.status(500).json({ errorMessage: '댓글을 수정하는 중 오류가 발생했습니다.' });
        }
    });
});

//댓글 삭제 API
router.delete("/posts/:_postId/comments/:_commentId", async (req, res) => {
    const postId = req.params._postId;
    const commentId = req.params._commentId;
    const password = req.body.password;

    // 댓글 존재 여부 및 비밀번호 확인
    const existingComment = await Comment.findOne({ _id: commentId, postId: postId });
    if (!existingComment) {
        return res.status(404).json({ errorMessage: "댓글을 찾을 수 없습니다." });
    }
    // 비밀번호 해시 비교
    bcrypt.compare(password, existingComment.password, async (compareError, isMatch) => {
        if (compareError || !isMatch) {
            return res.status(403).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
        }

        try {
            // 댓글 삭제
            const deleteResult = await Comment.deleteOne({ _id: commentId });

            if (deleteResult.deletedCount === 1) {
                res.status(200).json({ message: "댓글을 삭제하였습니다." });
            } else {
                res.status(500).json({ errorMessage: "댓글을 삭제하는 중 오류가 발생했습니다." });
            }
        } catch (error) {
            res.status(500).json({ errorMessage: "댓글을 삭제하는 중 오류가 발생했습니다." });
        }
    });
});

//댓글 전체 삭제 API
router.delete("/posts/:_postId/comments", async (req, res) => {
    const postId = req.params._postId;

    try {
        const comments = await Comment.find({ postId });

        if (comments.length === 0) {
            res.status(404).json({ message: "댓글이 존재하지 않습니다." });
            return;
        }
        await Comment.deleteMany({ postId });
        res.status(200).json({ message: "전체 댓글을 삭제하였습니다." });
    } catch (error) {
        res.status(500).json({ errorMessage: "댓글을 삭제하는 중 오류가 발생했습니다." });
    }
});

module.exports = router;
