const User = require("../models/userModel");

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const check = await User.checkAuth(email, password);
  check ? res.redirect("/") : res.redirect("/login");
};
