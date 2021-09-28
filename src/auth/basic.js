import createHttpError from "http-errors";
import atob from "atob";
import UserModel from "../sevices/user/schema.js";

export const basicAuthMiddleware = async (req, resp, next) => {
  console.log("Basic Auth Middleware");
  console.log(req.headers);

  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide credentials in Authorization header!"
      )
    );
  } else {
    const decodedCredentials = atob(req.headers.authorization.split(" ")[1]);

    const [email, password] = decodedCredentials.split(":");

    console.log("Email -> ", email);
    console.log("Password -> ", password);

    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      req.user = user;
      next();
    } else {
      next(createHttpError(401, "Credentials are not correct!"));
    }
  }
};
