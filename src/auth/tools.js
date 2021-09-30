import jwt from "jsonwebtoken";
import UserModel from "../sevices/user/schema.js"

const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      "process.env.JWT_SECRET",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

const generateRefreshJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      "process.env.JWT_REFRESH_SECRET",
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const verifyJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, "process.env.JWT_SECRET", (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );

  export const verifyRefreshJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, "process.env.JWT_REFRESH_SECRET", (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );

export const JWTAuthenticate = async (user) => {
  const accessToken = await generateJWT({ id: user._id });
  const refreshToken = await generateRefreshJWT({ id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const refreshTokens = async (actualRefreshToken) => {
  try {
      const decodedRefreshToken = await verifyRefreshJWT(actualRefreshToken)

      const user = await UserModel.findById(decodedRefreshToken.id)

      if(!user) throw new Error("User not found")

      if(user.refreshToken === actualRefreshToken){
          const {accessToken, refreshToken} = await JWTAuthenticate(user)
          return {accessToken, refreshToken}
      }
  } catch (err) {
    console.log(err);
  }
};
