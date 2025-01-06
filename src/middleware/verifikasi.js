import jwt from "jsonwebtoken";
import config from "../db/config/secret.js";
export const verifikasi = (req, res, next) => {
  let tokenWithBearer = req.headers.authorization;
  console.log(tokenWithBearer);
  if (tokenWithBearer) {
    const token = tokenWithBearer.split(" ")[1];
    jwt.verify(token, config.secret, (err, decode) => {
      if (err) {
        console.log(err);
        return res
          .status(401)
          .send({ auth: false, message: "Token not existing!" });
      } else {
        if ((req.auth = decode)) {
          next();
          console.log("success authorization");
        } else {
          return res
            .status(401)
            .send({ auth: false, message: "Failed authorization!" });
        }
      }
    });
  } else {
    return res.status(401).send({ auth: false, message: "Token not found!" });
  }
};
