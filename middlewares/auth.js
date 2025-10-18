const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function auth(req, res, next) {
  try {
    const token = req.session?.token;
    if (!token) {
      return res.redirect("/login");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware hata:", err);
    req.session.destroy(() => res.redirect("/login"));
  }
};
