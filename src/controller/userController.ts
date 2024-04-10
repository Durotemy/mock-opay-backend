import bcrypt from "bcryptjs";
import Express, { Request, Response } from "express";
import User from "../models/Usermodel";
import { generateTokens } from "../utils/generateToken";
import Transaction from "../models/TransactionModel";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, address, phone, password, gender, age } = req.body;

  try {
    const userExist = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (userExist)
      return res
        .status(422)
        .json({ error: "Email or Phone number already exists" });

    const user = await new User({
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
    } else {
      res.status(400).send("error occured while creating user");
    }
  } catch (error) {
    console.log(error);
  }
};

const authUser = async (req: Request, res: Response) => {
  const { password, phone } = req.body;

  if (!password || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid phone number or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid phone number or password" });
    }
    console.log("user", user);

    const token = generateTokens(user._id.toString());

    return res.status(200).json({ token, user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({ user: user });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fundWallet = async (req: Request, res: Response) => {
  try {
    const { phone, amount } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance += parseInt(amount);
    await user.save();

    return res
      .status(200)
      .json({ message: "Balance updated successfully", user });
  } catch (error) {
    console.error("Error funding wallet:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const transaction = async (req: Request, res: Response) => {
  try {
    const { senderPhone, receiverPhone, amount } = req.body;

    const sender = await User.findOne({ phone: senderPhone });
    const receiver = await User.findOne({ phone: receiverPhone });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    sender.balance -= parseInt(amount);
    receiver.balance += parseInt(amount);

    await sender.save();
    await receiver.save();

    const senderName = sender.name;
    const receiverName = receiver.name;

    const newTransaction = new Transaction({
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
    await newTransaction.save();

    return res.status(200).json({ message: "Transaction successful" });
  } catch (error) {
    console.error("Error funding wallet:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTransactionsForUser = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;


    // Find the user by phone number to get their _id
    const user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id;

    // Find transactions where the sender or receiver matches the user's ID
    const transactions = await Transaction.find({
      $or: [{ "sender.id": userId }, { "receiver.id": userId }],
    }).populate("sender.id receiver.id"); // Populate sender and receiver fields with user details

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  registerUser,
  authUser,
  getUserProfile,
  getAllUser,
  fundWallet,
  transaction,
  getTransactionsForUser,
};
