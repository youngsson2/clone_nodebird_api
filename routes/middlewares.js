"use strict";

const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    req.decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // jwt.verify(token, secretOrPublicKey): 토큰 검증 메서드
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // 419 에러: 토큰값이 없음
      res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    res.status(401).json({
      // 401 에러: 권한 없음
      code: 401,
      message: "유효하지 않은 토큰",
    });
  }
};
