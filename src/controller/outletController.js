import { QueryTypes } from "sequelize";
import sequelize from "../db/config/db.js";
import { outletControl } from "../models/index.js";
import bcrypt from "bcrypt";

export const getOutletAll = async (req, res) => {
  try {
    const response = await outletControl.findAll();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOutletAllById = async (req, res) => {
  try {
    const response = await outletControl.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!response) {
      return res.status(401).json({ massage: "outlet not found!" });
    } else {
      res.status(200).json(response);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const getAllByIdOutlet = async (req, res) => {
  try {
    const response = await sequelize.query(
      `SELECT *  FROM outlets 
      JOIN categories ON outlets.id = categories.id_outlet 
      JOIN subcategories ON categories.id = subcategories.id_category 
      JOIN menus ON subcategories.id = menus.id_subcategory`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!response) {
      return res.status(401).json({ massage: "outlet not found!" });
    } else {
      res.status(200).json(response);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createOutlet = async (req, res) => {
  const saltRounds = 10;
  const outlet_name = req.body.outlet_name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  const existingOutlet = await sequelize.query(
    "SELECT email FROM outlets WHERE outlets.email = :email",
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    }
  );
  if (existingOutlet.length > 0) {
    return res.status(400).json({ message: "Email existing already" });
  }

  if (!outlet_name || !email || !password || !role) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newOutlet = await outletControl.create({
      outlet_name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Outlet success to add",
      data: newOutlet,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add outlet",
      error: err.message,
    });
  }
};

export const updateOutlet = async (req, res) => {
  const saltRounds = 10;
  const id = req.params.id;
  const outlet_name = req.body.outlet_name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  outletControl
    .findByPk(id)
    .then((data) => {
      if (data) {
        console.log(data.toJSON());
      } else {
        console.log("Outlet not found");
      }
    })
    .catch((err) => {
      console.error("Something wrong", err, res);
    });

  const existingOutlet = await sequelize.query(
    "SELECT email FROM outlets WHERE outlets.email = :email",
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    }
  );
  if (existingOutlet.length > 0) {
    return res.status(400).json({ message: "Email existing already" });
  }

  if (!outlet_name || !email || !password || !role) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newOutlet = await outletControl.update(
      {
        outlet_name,
        email,
        password: hashedPassword,
        role,
      },
      {
        where: { id },
      }
    );

    res.status(201).json({
      message: "success to change outlet",
      data: newOutlet,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to change outlet",
      error: err.message,
    });
  }
};

export const deleteOutletById = async (req, res) => {
  try {
    const response = await outletControl.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
