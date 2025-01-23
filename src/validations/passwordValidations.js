import { outletControl } from "../models/index.js";
import bcrypt from "bcrypt";
export const validationsPassword = async (req, res, next) => {
  const { verify_password, password } = req.body;
  console.log(req.params.id_outlet, "cek");
  console.log(verify_password, "cek");

  try {
    if (verify_password && password) {
      const data = await outletControl.findOne({
        where: { id: req.params.id_outlet },
      });
      const isMatch = await bcrypt.compare(verify_password, data.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password is wrong!" });
      } else {
        next();
        // return res.status(200).json({ message: "successfully to match data" });
      }
    } else if (password) {
      return res.status(400).json({ message: "please filled verify password" });
    } else {
      next();
    }
  } catch (error) {
    return res.status(404).json({ message: "data not found" });
  }
};
