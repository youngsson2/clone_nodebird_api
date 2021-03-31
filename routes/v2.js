"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const url = require("url");

const { verifyToken, apiLimiter } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();

// router.use(cors()); // v2에 속한 모든 라우터에 cors 미들웨어가 적용됨(응답 헤더, 즉 Response Header에 Access-Controll-Allow-Origin: * 이 추가됨)

router.use(async (req, res, next) => {
  const domain = Domain.findOne({
    where: { host: url.parse(req.get("origin")).host }, // req.get("origin"): 클라이언트의 도메인
  });
  if (domain) {
    cors({
      origin: req.get("origin"),
      credentials: true,
    })(req, res, next); // 미들웨어의 작동 방식을 커스터마이징 하고 싶을 때 (req, res, next) 인자를 주어 호출
  } else {
    next();
  }
});

router.post("/token", apiLimiter, async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
    });
    if (!domain) {
      res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다.",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m", // 30분
        issuer: "youngsunchoi", // 발급자
      }
    );
    return res.json({
      code: 200,
      message: "토큰이 발급 되었습니다",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/test", verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get("/posts/my", apiLimiter, verifyToken, (req, res) => {
  Post.findAll({ where: { UserId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        code: 500,
        message: "Internal Server Error",
      });
    });
});

router.get(
  "/posts/hashtag/:title",
  verifyToken,
  apiLimiter,
  async (req, res) => {
    try {
      const hashtag = Hashtag.findOne({ where: { title: req.params.title } });
      if (!hashtag) {
        return res.status(404).json({
          code: 404,
          message: "검색 결과가 없습니다",
        });
      }
      const posts = hashtag.getPosts();
      return res.json({
        code: 200,
        payload: posts,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: "서버 에러",
      });
    }
  }
);

module.exports = router;
