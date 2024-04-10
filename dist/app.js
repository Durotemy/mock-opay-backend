"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
(0, db_1.default)();
var app = express();
app.use(logger("dev"));
// app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use("/", indexRouter);
app.use("/", users_1.default);
var server = app.listen(3001, function () {
    var port = server.address().port;
    console.log("server is running on port " + port);
});
module.exports = app;
