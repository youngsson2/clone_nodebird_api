"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
const db = {};

db.sequelize = sequelize;
db.User = require("./user");
db.Post = require("./post");
db.Hashtag = require("./hashtag");
db.Domain = require("./domain");

db.User.init(sequelize);
db.Post.init(sequelize);
db.Hashtag.init(sequelize);
db.Domain.init(sequelize);

db.User.associate(db);
db.Post.associate(db);
db.Hashtag.associate(db);
db.Domain.associate(db);

module.exports = db;
