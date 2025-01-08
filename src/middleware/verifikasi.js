import fs from "fs";
import jwt from "jsonwebtoken";
import config from "../db/config/secret.js";

export const verifikasi = (req, res, next) => {
  let tokenWithBearer = req.headers.authorization;

  if (tokenWithBearer) {
    const token = tokenWithBearer.split(" ")[1];

    jwt.verify(token, config.secret, (err, decode) => {
      if (err) {
        if (req.file && req.file.filename) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.log("Error deleting file:", unlinkErr);
            else console.log("File deleted successfully.");
          });
        }
        console.log(err);
        return res
          .status(401)
          .send({ auth: false, message: "Token not existing!" });
      } else {
        req.auth = decode;
        next();
        console.log("Success authorization");
      }
    });
  } else {
    if (req.file && req.file.filename) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.log("Error deleting file:", unlinkErr);
        else console.log("File deleted successfully.");
      });
    }
    return res.status(401).send({ auth: false, message: "Token not found!" });
  }
};
