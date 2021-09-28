import express from "express";
import UserModel from "./schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, resp, next) => {
  try {
    const newUser = new UserModel(req.body);

    const savedUser = await newUser.save();
    resp.status(201).send(savedUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.get("/", basicAuthMiddleware, async (req, resp, next) => {
  try {
    const users = await UserModel.find();
    resp.send(users);
  } catch (err) {
    next(err);
  }
});

userRouter.get("/me", basicAuthMiddleware, async (req, resp, next) => {
  try {
    resp.send(req.user);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/me", basicAuthMiddleware, async (req, resp, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
      }
    );
    resp.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/me", basicAuthMiddleware, async (req, resp, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      resp.status(404).send({ message: `User is not found!` });
    } else {
      await UserModel.findByIdAndDelete(req.user._id);
      resp.status(204).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default userRouter;