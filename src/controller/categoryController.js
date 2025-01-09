import fs from "fs";
import { categoryControl, outletControl } from "../models/index.js";

export const getCategoryByNameCafe = async (req, res) => {
  try {
    const respon = await categoryControl.findAll({
      include: [
        {
          model: outletControl,
          required: false,
          where: {
            outlet_name: req.params.outlet_name,
          },
        },
      ],
    });

    if (!respon) {
      return res.status(401).json({ massage: "outlet is not found!" });
    } else {
      res.status(200).json(respon);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const getCategoryByIdOutlet = async (req, res) => {
  try {
    const respon = await categoryControl.findAll({
      include: [
        {
          model: outletControl,
          required: false,
          where: {
            id: req.params.id,
          },
        },
      ],
    });

    if (!respon) {
      return res.status(401).json({ massage: "outlet is not found!" });
    } else {
      res.status(200).json(respon);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const getCategory = async (req, res) => {
  try {
    const data = await categoryControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await categoryControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createCategory = async (req, res) => {
  const { id_outlet, type } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet || !req.file || !type) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }
  try {
    const response = await outletControl.findByPk(id_outlet);
    if (!response) {
      return res.status(404).json({
        message: "id_outlet not found",
      });
    }
    const newCategory = await categoryControl.create({
      id_outlet,
      type,
      photo,
    });
    res.status(201).json({
      message: "Success to create category",
      data: newCategory,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create category",
      error: err.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { id_outlet, type } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const category = await categoryControl.findByPk(id);
    if (!category) {
      return res.status(404).json({
        message: "category not found",
      });
    }

    if (photo && category.photo) {
      fs.unlink(category.photo, (err) => {
        if (err) console.log("Fail to delete file: ", err);
      });
    }

    await categoryControl.update(
      {
        id_outlet,
        type,
        photo: photo || categoryControl.photo,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change category",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change category",
      error: err.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await categoryControl.findOne({ where: { id } });
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (category.photo) {
      fs.unlink(category.photo, (err) => {
        if (err) console.log("Failed to delete file: ", err);
      });
    }

    await categoryControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Category success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete category",
      error: err.message,
    });
  }
};
