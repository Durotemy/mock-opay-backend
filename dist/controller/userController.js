"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.getTransactionsForUser = exports.transaction = exports.fundWallet = exports.getAllUser = exports.getUserProfile = exports.authUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Usermodel_1 = __importDefault(require("../models/Usermodel"));
const generateToken_1 = require("../utils/generateToken");
const TransactionModel_1 = __importDefault(require("../models/TransactionModel"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address, phone, password, gender, age } = req.body;
    try {
        const userExist = yield Usermodel_1.default.findOne({
            $or: [{ email: email }, { phone: phone }],
        });
        if (userExist)
            return res
                .status(422)
                .json({ error: "Email or Phone number already exists" });
        const user = yield new Usermodel_1.default({
            name,
            email,
            address,
            phone,
            password,
            gender,
            age,
        });
        user.save();
        if (user) {
            const userIdString = user._id.toString();
            return res.status(201).json({
                message: "User successfully created",
                userId: userIdString,
            });
        }
        else {
            res.status(400).send("error occured while creating user");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.registerUser = registerUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, phone } = req.body;
    if (!password || password.trim() === "") {
        return res.status(400).json({ error: "Password is required" });
    }
    try {
        const user = yield Usermodel_1.default.findOne({ phone });
        if (!user) {
            return res
                .status(401)
                .json({ error: "Invalid phone number or password" });
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({ error: "Invalid phone number or password" });
        }
        console.log("user", user);
        const token = (0, generateToken_1.generateTokens)(user._id.toString());
        return res.status(200).json({ token, user: user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.authUser = authUser;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    try {
        const user = yield Usermodel_1.default.findOne({ phone });
        res.status(200).json({ user: user });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.refresh = refresh;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user._id;
        const user = yield Usermodel_1.default.findById(userId);
        if (user) {
            res.status(200).json({ user: user });
        }
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUserProfile = getUserProfile;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Usermodel_1.default.find({});
        res.status(200).json({ users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllUser = getAllUser;
const fundWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, amount } = req.body;
        const user = yield Usermodel_1.default.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.balance += parseInt(amount);
        yield user.save();
        return res
            .status(200)
            .json({ message: "Balance updated successfully", user });
    }
    catch (error) {
        console.error("Error funding wallet:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.fundWallet = fundWallet;
const transaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderPhone, receiverPhone, amount } = req.body;
        const sender = yield Usermodel_1.default.findOne({ phone: senderPhone });
        const receiver = yield Usermodel_1.default.findOne({ phone: receiverPhone });
        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }
        if (sender.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }
        sender.balance -= parseInt(amount);
        receiver.balance += parseInt(amount);
        yield sender.save();
        yield receiver.save();
        const senderName = sender.name;
        const receiverName = receiver.name;
        const newTransaction = new TransactionModel_1.default({
            sender: {
                id: sender._id,
                name: senderName,
            },
            receiver: {
                id: receiver._id,
                name: receiverName,
            },
            amount: parseInt(amount),
        });
        yield newTransaction.save();
        return res.status(200).json({ message: "Transaction successful" });
    }
    catch (error) {
        console.error("Error funding wallet:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.transaction = transaction;
const getTransactionsForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        // Find the user by phone number to get their _id
        const user = yield Usermodel_1.default.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userId = user._id;
        // Find transactions where the sender or receiver matches the user's ID
        const transactions = yield TransactionModel_1.default.find({
            $or: [{ "sender.id": userId }, { "receiver.id": userId }],
        }).populate("sender.id receiver.id"); // Populate sender and receiver fields with user details
        return res.status(200).json({ transactions });
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getTransactionsForUser = getTransactionsForUser;
