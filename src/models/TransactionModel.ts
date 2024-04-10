import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    sender: {
      type: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
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
  

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
