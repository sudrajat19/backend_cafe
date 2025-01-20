import { accessToken, outletControl } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ip from "ip";
import config from "../db/config/secret.js";

const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password must be filled!" });
    }

    const outlet = await outletControl.findOne({ where: { email } });
    if (!outlet) {
      return res.status(400).json({ message: "Email is wrong!" });
    }
    const isMatch = await bcrypt.compare(password, outlet.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is wrong!" });
    }

    const token = jwt.sign({ id: outlet.id }, config.secret, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign({ id: outlet.id }, config.refreshSecret, {
      expiresIn: "20m",
    });

    await accessToken.create({
      id_outlet: outlet.id,
      access_token: token,
      refresh_token: refreshToken,
      ip_address: ip.address(),
    });

    res.json({
      success: true,
      message: "Login successfully!",
      accessToken: token,
      refreshToken: refreshToken,
      curroutlet: outlet.id,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default login;
