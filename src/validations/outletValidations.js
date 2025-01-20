import { outletControl } from "../models/index.js";

export const updateEmailValidator = async (req, res, next) => {
  const { email } = req.body;
  const { id_outlet } = req.params;

  try {
    const response = await outletControl.findOne({ where: { email } });
    if (response) {
      if (response.id == id_outlet) {
        next();
      } else {
        return res.status(400).json({ message: "email existing already!" });
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const createEmailValidator = async (req, res, next) => {
  const { email } = req.body;

  const response = await outletControl.findOne({
    attributes: ["email"],
    where: { email },
  });
  if (response) {
    return res.status(400).json({ message: "email existing already!" });
  } else {
    next();
  }
};

export const createOutletValidator = async (req, res, next) => {
  const { outlet_name } = req.body;

  const response = await outletControl.findOne({
    attributes: ["outlet_name"],
    where: { outlet_name },
  });
  if (response) {
    return res.status(400).json({ message: "outlet name existing already!" });
  } else {
    next();
  }
};
export const updateOutletValidator = async (req, res, next) => {
  const { outlet_name } = req.body;
  const { id_outlet } = req.params;

  try {
    const response = await outletControl.findOne({ where: { outlet_name } });
    if (response) {
      if (response.id == id_outlet) {
        next();
      } else {
        return res
          .status(400)
          .json({ message: "outlet name existing already!" });
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
