const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";
const SECRET = process.env.JWT_SECRET;

function generateAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRES });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
