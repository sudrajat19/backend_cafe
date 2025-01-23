import fs from "fs";
import jwt from "jsonwebtoken";
import config from "../db/config/secret.js";
import { accessToken, outletControl } from "../models/index.js";

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

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.params.refreshToken;

    const tokenData = await accessToken.findOne({
      where: { refresh_token: refreshToken },
      include: [
        {
          model: outletControl,
        },
      ],
    });
    if (!tokenData.refresh_token) {
      return res.status(403).json({ message: "Invalid refresh token!" });
    }
    const newAccessToken = jwt.sign(
      { id: tokenData.outlet.id },
      config.secret,
      {
        expiresIn: "10m",
      }
    );
    res.json({
      success: true,
      message: "Token JWT berhasil dibuat!",
      accessToken: newAccessToken,
      currUser: tokenData.outlet.id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
