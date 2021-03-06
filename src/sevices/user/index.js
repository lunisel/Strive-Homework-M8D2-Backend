import express from "express";
import UserModel from "./schema.js";
import { JWTMiddleware } from "../../auth/token.js";
import { JWTAuthenticate, refreshTokens } from "../../auth/tools.js";
import createHttpError from "http-errors";

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

userRouter.get("/", async (req, resp, next) => {
  try {
    const users = await UserModel.find({}, { name: 1, surname: 1, email: 1 });
    resp.send(users);
  } catch (err) {
    next(err);
  }
});

userRouter.get("/me", JWTMiddleware, async (req, resp, next) => {
  try {
    resp.send(req.user);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/me", JWTMiddleware, async (req, resp, next) => {
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

userRouter.delete("/me", JWTMiddleware, async (req, resp, next) => {
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

userRouter.post("/login", async (req, resp, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(user);
      console.log(accessToken, refreshToken);
      resp.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(401, "Wrong credentials"));
    }
  } catch (err) {
    next(err);
  }
});

userRouter.post("/refreshToken", async (req, res, next) => {
  try {
    const { actualRefreshToken } = req.body;

    const { accessToken, refreshToken } = await refreshTokens(
      actualRefreshToken
    );

    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

export default userRouter;
