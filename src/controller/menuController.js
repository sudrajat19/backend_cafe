import fs from "fs";
import { menuControl } from "../models/index.js";

export const getMenu = async (req, res) => {
  try {
    const data = await menuControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
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
