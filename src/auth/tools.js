import jwt from "jsonwebtoken";

export const JWTAuthenticate = async (user) => {
  const accesToken = await generateJWT({ id: user._id });

  return accesToken;
};

const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      "process.env.JWT_SECRET",
      { expiresIn: "1week" },
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
