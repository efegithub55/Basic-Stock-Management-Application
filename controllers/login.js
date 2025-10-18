const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.checkAuth(email, password);

  if (!user) {
    req.session.alert = {
      message: "E-posta veya şifre hatalı",
      type: "warning",
    };
    return res.redirect("/login");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  req.session.token = token;
  req.session.user = { id: user.id, email: user.email, isAdmin: user.isAdmin };

  res.redirect("/");
};

exports.requireAuth = (req, res, next) => {
  const token = req.session.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT doğrulama hata:", err);
    req.session.destroy(() => res.redirect("/login"));
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
