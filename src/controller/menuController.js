import fs from "fs";
import { menuControl } from "../models/index.js";
import sequelize from "../db/config/db.js";
import { QueryTypes } from "sequelize";

export const getPaginatedMenu = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  console.log(search);

  try {
    const menu = await sequelize.query(
      `SELECT *
       FROM menus  
       JOIN subcategories ON menus.id_subcategory = subcategories.id
       JOIN categories ON subcategories.id_category = categories.id 
       JOIN outlets ON categories.id_outlet = outlets.id
       WHERE menus.title LIKE :search OR subcategories.title LIKE :search OR categories.type LIKE :search
       LIMIT :limit OFFSET :offset`,
      {
        type: QueryTypes.SELECT,
        replacements: { limit, offset, search: `%${search}%` },
      }
    );

    const totalItems = await sequelize.query(
      `SELECT *
       FROM menus  
       JOIN subcategories ON menus.id_subcategory = subcategories.id
       JOIN categories ON subcategories.id_category = categories.id 
       JOIN outlets ON categories.id_outlet = outlets.id
       WHERE menus.title LIKE :search OR subcategories.title LIKE :search OR categories.type LIKE :search`,
      {
        type: QueryTypes.SELECT,
        replacements: { search: `%${search}%` },
      }
    );

    const totalCount = totalItems.length > 0 ? totalItems.length : 0;
    const totalPages = Math.ceil(totalCount / limit);
    console.log(totalItems.length, "cek count");

    res.json({
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      menu: menu || [],
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).send({ error: "An error occurred while fetching menu." });
  }
};

export const getMenuById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await menuControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createMenu = async (req, res) => {
  const { id_subcategory, title, price, best_seller } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;
  console.log(req.body);

  if (!id_subcategory || !req.file || !title || !price || !best_seller) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const newMenu = await menuControl.create({
      id_subcategory,
      title,
      price,
      best_seller,
      photo,
    });
    res.status(201).json({
      message: "Success to create menu",
      data: newMenu,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create menu",
      error: err.message,
    });
  }
};

export const updateMenu = async (req, res) => {
  const id = req.params.id;
  const { id_subcategory, title, price, best_seller } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  if (!id_subcategory || !title || !price || !best_seller) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const menu = await menuControl.findByPk(id);
    if (!menu) {
      return res.status(404).json({
        message: "menu not found",
      });
    }

    if (photo && menu.photo) {
      fs.unlink(menu.photo, (err) => {
        if (err) console.log("Fail to delete file: ", err);
      });
    }

    await menuControl.update(
      {
        id_subcategory,
        title,
        price,
        best_seller,
        photo: photo || menuControl.photo,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change menu",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change menu",
      error: err.message,
    });
  }
};

export const deleteMenu = async (req, res) => {
  const id = req.params.id;

  try {
    const menu = await menuControl.findOne({ where: { id } });
    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    if (menu.photo) {
      fs.unlink(menu.photo, (err) => {
        if (err) console.log("Failed to delete file: ", err);
      });
    }

    await menuControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Menu success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete Menu",
      error: err.message,
    });
  }
};
