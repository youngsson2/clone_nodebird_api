"use strict";

const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const LocalStrategy = require("passport-local").Strategy;

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          let exUser = await User.findOne({ where: { email } });
          if (exUser) {
            let result = await bcrypt.compare(password, exUser.password); // bcrypt.compare(data, encrypted)
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다" });
            }
          } else {
            done(null, false, { message: "계정이 존재하지 않습니다" });
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
