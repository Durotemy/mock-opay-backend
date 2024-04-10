"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (id) => {
    //   if (!process.env.JWT_SECRET) {
    //     throw new Error("JWT secret is not defined");
    //   }
    return jsonwebtoken_1.default.sign({ id }, "opay", {
        expiresIn: "30d",
    });
};
exports.generateTokens = generateTokens;
