// Projede Kullanılan Kütüphaneler

const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
require("dotenv").config();

// Router Includes

const indexRouter = require("./routers/index.js");
const loginRouter = require("./routers/login");

// Express Config

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Config

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Routers

app.use("/", indexRouter);
app.use("/login", loginRouter);

// Server Start

server.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/`);
});
