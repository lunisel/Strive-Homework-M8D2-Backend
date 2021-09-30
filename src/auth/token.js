import createHttpError from "http-errors";
import { verifyJWT } from "./tools.js";
import UserModel from "../sevices/user/schema.js";

export const JWTMiddleware = async (req, resp, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Header not found"));
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decodedToken = await verifyJWT(token);

      const user = await UserModel.findById(decodedToken.id);

      if (user) {
          req.user = user
          next()
      } else {
        next(createHttpError(404, "User not found"));
      }
    } catch (err) {
        console.log(err)
      next(createHttpError(401, "Token not found!"));
    }
  }
};
