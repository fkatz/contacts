import express from "express";
import expressAsyncHandler from "express-async-handler";
import rateLimiter from "../middleware/rateLimiter";
import UserService from "../services/UserService";

export class UserController {
  public router = express.Router();

  private userService = new UserService();

  constructor() {
    this.router.post(
      "/",
      rateLimiter({ max: 2500 }),
      expressAsyncHandler(async (req, res, next) => {
        const user = await this.userService.createOne({
          ...req.body,
        });
        res.send(user);
      })
    );
  }
}
