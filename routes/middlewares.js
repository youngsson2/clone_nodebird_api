"use strict";

const jwt = require("jsonwebtoken");
const RateLimit = require("express-rate-limit");

exports.apiLimiter = RateLimit({
  windowMs: 60 * 1000, // 기준 시간
  max: 1, // 허용 횟수
  delayMs: 0, // 호출 간격
  // 제한 초과 시 콜백 함수
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: "1분에 한번만 요청할 수 있습니다.",
    });
  },
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: "새로운 버전이 나왔습니다. 새로운 버전을 이용하세요",
  });
};

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
<<<<<<< HEAD
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // jwt.verify(token, secretOrPublicKey): 토큰 검증 메서드
=======
    req.decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // jwt.verify(token, secretOrPublicKey): 토큰 검증 메서드
>>>>>>> 8d4c03505f6c79fa1a002dfc496a083f87df0533
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
