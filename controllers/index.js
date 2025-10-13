const User = require("../models/userModel");

exports.getIndex = async (req, res) => {
  res.render("index");
};
