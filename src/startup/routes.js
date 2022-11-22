const express = require("express");
const cors = require("cors");
const users = require("../routes/users");

const whitelist = ["http://localhost:5000", "http://localhost:3000"];

module.exports = function (app) {
  //---------------------------------
  app.use(cors(whitelist));
  app.use(express.json());
  //----------------------------------
  app.use("/api/user", users);
  //----------------------------------
};
