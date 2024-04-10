"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    sender: {
        type: {
            id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            // phone: {
            //   type: String, // Add phone field for sender
            //   required: true,
            // },
        },
        required: true,
    },
    receiver: {
        type: {
            id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            // phone: {
            //   type: String, // Add phone field for receiver
            //   required: true,
            // },
        },
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
