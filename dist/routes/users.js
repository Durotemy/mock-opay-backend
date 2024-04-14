"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
// import { fundWallet } from "../controller/fundwalletController";
var router = express_1.default.Router();
router.post("/create-user", userController_1.registerUser);
router.post("/login", userController_1.authUser);
router.get("/user", userController_1.getUserProfile);
router.get("/alluser", userController_1.getAllUser);
router.post("/fund", userController_1.fundWallet);
router.post("/transaction", userController_1.transaction);
router.get("/user-transaction", userController_1.getTransactionsForUser);
router.post('/refresh', userController_1.refresh);
exports.default = router;
