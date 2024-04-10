import express from "express";
import {
  authUser,
  fundWallet,
  getAllUser,
  getTransactionsForUser,
  getUserProfile,
  registerUser,
  transaction,
} from "../controller/userController";
import { authenticateToken } from "../middleware/authToken";
// import { fundWallet } from "../controller/fundwalletController";
var router = express.Router();

router.post("/create-user", registerUser);
router.post("/login", authUser);
router.get("/user", getUserProfile);
router.get("/alluser", getAllUser);
router.post("/fund",fundWallet)
router.post("/transaction", transaction)
router.get("/user-transaction", getTransactionsForUser)



export default router;
