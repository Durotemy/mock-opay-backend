import express, { Request, Response } from "express";
var router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response) {
  res.send("works");
});

export default router;
