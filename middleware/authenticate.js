const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.userAuthenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    // console.log(token);
    const user = jwt.verify(token, 'secretkey');
     console.log(user);
    const result = await User.findByPk(user.userId);
    // console.log(result);
    //sequelize object
    req.user = result; //adding the got result(user sequelized obj) to the request
    next();
  } catch (error) {
    return res.status(401).send({ msg: "unauthorized entry" });
  }
};