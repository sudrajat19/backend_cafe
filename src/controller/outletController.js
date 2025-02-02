import { Op, QueryTypes } from "sequelize";
import sequelize from "../db/config/db.js";
import {
  contactControl,
  outletControl,
  profileControl,
} from "../models/index.js";
import bcrypt from "bcrypt";
export const getOutletAndProfileById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await outletControl.findOne({
      where: { id },
      include: [
        {
          model: profileControl,
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "data not found" });
  }
};

export const getPaginatedOutlet = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const { count, rows } = await outletControl.findAndCountAll({
      attributes: ["outlet_name", "id", "email", "role"],
      where: {
        outlet_name: {
          [Op.like]: `%${search}%`,
        },
      },
      include: [
        {
          model: profileControl,
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      totalItems: count,
      totalPages,
      currentPage: page,
      outlet: rows || [],
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching profile." });
  }
};

export const getAll = async (req, res) => {
  const outlet_name = req.params.outlet_name;
  try {
    const data = await outletControl.findAll({
      where: {
        outlet_name,
      },
      include: [
        {
          model: profileControl,
        },
        {
          model: contactControl,
        },
      ],
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
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
  const id_outlet = req.params.id_outlet;
  const outlet_name = req.body.outlet_name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  outletControl
    .findByPk(id_outlet)
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
        where: { id: id_outlet },
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
