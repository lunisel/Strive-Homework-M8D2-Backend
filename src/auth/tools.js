import jwt from "jsonwebtoken";

export const JWTAuthenticate = async user => {

    const accesToken = await generateJWT({id: user._id})

    return accesToken
}

const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      "process.env.JWT_SECRET",
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

generateJWT(1221321)
  .then((token) => console.log(token))
  .catch((err) => console.log(err));

try {
  const token = await generateJWT(1221321);
} catch (err) {
  console.log(err);
}

const verifyJWT = (token) =>
  new Promise(
    (resolve, reject) => jwt.verify(token, process.env.JWT_SECRET),
    (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    }
  );
