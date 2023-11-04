const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Post = require("../schemas/post.js");

// 게시글 작성 API
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!user || !password || !title || !content) {
    return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  // 패스워드를 해시로 변환
  bcrypt.hash(password, 10, async (hashError, hashPassword) => {
    if (hashError) {
      return res.status(500).json({ errorMessage: "비밀번호 해싱 중 오류가 발생했습니다." });
    }

    // MongoDB를 사용하여 게시글 생성
    try {
      const newPost = await Post.create({
        user,
        title,
        content,
        password: hashPassword,
      });
      res.json({ message: '게시글을 생성하였습니다.', postId: newPost._id });
    } catch (error) {
      res.status(500).json({ errorMessage: '게시글을 생성하는 중 오류가 발생했습니다.' });
    }
  });
});

// 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});
    const responseData = posts.map((post) => {
      return {
        postId: post._id,
        user: post.user,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      };
    });
    res.status(200).json({ data: responseData });
  } catch (error) {
    res.status(500).json({ errorMessage: '게시글을 조회하는 중 오류가 발생했습니다.' });
  }
});

// 게시글 상세 조회 API
router.get("/posts/:_postId", async (req, res) => {
  try {
    const postId = req.params._postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ errorMessage: "게시글을 찾을 수 없습니다." });
    }

    const responseData = {
      postId: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };

    res.status(200).json({ data: responseData });
  } catch (error) {
    res.status(500).json({ errorMessage: '게시글을 상세 조회하는 중 오류가 발생했습니다.' });
  }
});

// 게시글 수정 API
router.put("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const { password, title, content } = req.body;
  if (!password || !title || !content) {
    return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  //게시글 존재 여부 및 비밀번호 확인
  const existingPost = await Comment.findById(postId);
  if (!existingPost) {
    return res.status(404).json({ errorMessage: "게시글을 찾을 수 없습니다." });
  }

  // 비밀번호 해시 비교
  bcrypt.compare(password, existingPost.password, async (compareError, isMatch) => {
    if (compareError || !isMatch) {
      return res.status(403).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    //게시글 수정
    existingPost.title = title;
    existingPost.content = content;

    try {
      await existingPost.save();
      res.status(200).json({ message: "게시글을 수정하였습니다." });
    } catch (error) {
      res.status(500).json({ errorMessage: '게시글을 수정하는 중 오류가 발생했습니다.' });
    }
  });
});

//게시글 삭제 API
router.delete("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const password = req.body.password;

  // 게시글 존재 여부 및 비밀번호 확인
  const existingPost = await Post.findById(postId);

  if (!existingPost) {
    return res.status(404).json({ errorMessage: "게시글을 찾을 수 없습니다." });
  }

  // 비밀번호 해시 비교
  bcrypt.compare(password, existingPost.password, async (compareError, isMatch) => {
    if (compareError || !isMatch) {
      return res.status(403).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    try {
      // 게시글 삭제
      const deleteResult = await Post.deleteOne({ _id: postId });

      if (deleteResult.deletedCount === 1) {
        res.status(200).json({ message: "게시글을 삭제하였습니다." });
      } else {
        res.status(500).json({ errorMessage: "게시글을 삭제하는 중 오류가 발생했습니다." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: "게시글을 삭제하는 중 오류가 발생했습니다." });
    }
  });
});

//전체 게시글 삭제 API
router.delete("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});

    if (posts.length === 0) {
        res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        return;
    }

    await Post.deleteMany({});
    res.status(200).json({ message: "전체 게시글을 삭제하였습니다." });
  } catch (error) {
    res.status(500).json({ errorMessage: "게시글을 삭제하는 중 오류가 발생했습니다." });
  }
});

module.exports = router;
