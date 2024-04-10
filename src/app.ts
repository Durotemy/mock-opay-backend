var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import dotenv from'dotenv'

import connectDB from "./config/db";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";


dotenv.config()
connectDB()

var app = express();

app.use(logger("dev"));
// app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/", usersRouter);

var server = app.listen(3001, function () {
  var port = server.address().port;
  console.log("server is running on port " + port);
});

module.exports = app;
