import fs from "fs";
import { subCategoryControl } from "../models/index.js";
import { QueryTypes } from "sequelize";
import sequelize from "../db/config/db.js";

export const getSubCategoryByNameCafe = async (req, res) => {
  const outlet_name = req.params.outlet_name;
  try {
    const data = await sequelize.query(
      `
    SELECT subcategories.*,outlets.outlet_name, outlets.email, outlets.role
       FROM subcategories  
       JOIN categories ON subcategories.id_category = categories.id 
       JOIN outlets ON categories.id_outlet = outlets.id
       WHERE outlets.outlet_name = :outlet_name
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { outlet_name },
      }
    );
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getSubCategoryByIdOutlet = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await sequelize.query(
      `
    SELECT subcategories.*,outlets.outlet_name, outlets.email, outlets.role
       FROM subcategories  
       JOIN menus ON subcategories.id = menus.id_subcategory
       JOIN categories ON subcategories.id_category = categories.id 
       JOIN outlets ON categories.id_outlet = outlets.id
       WHERE outlets.id = :id
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { id },
      }
    );
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getSubCategory = async (req, res) => {
  try {
    const data = await subCategoryControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getSubCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await subCategoryControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createSubCategory = async (req, res) => {
  const { id_category, title } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;
  console.log(req.body, "cek body");
  if (!id_category || !req.file || !title) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const response = await outletControl.findByPk(id_category);
    if (!response) {
      return res.status(404).json({
        message: "category not found",
      });
    }
    const newSubCategory = await subCategoryControl.create({
      id_category,
      title,
      photo,
    });
    res.status(201).json({
      message: "Success to create subcategory",
      data: newSubCategory,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create subcategory",
      error: err.message,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  const id = req.params.id;
  const { id_category, title } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  if (!id_category) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const subCategory = await subCategoryControl.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({
        message: "subcategory not found",
      });
    }

    if (photo && subCategory.photo) {
      fs.unlink(subCategory.photo, (err) => {
        if (err) console.log("Fail to delete file: ", err);
      });
    }

    await subCategoryControl.update(
      {
        id_category,
        title,
        photo: photo || subCategoryControl.photo,
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

export const deleteSubCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const subCategory = await subCategoryControl.findOne({ where: { id } });
    if (!subCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (subCategory.photo) {
      fs.unlink(subCategory.photo, (err) => {
        if (err) console.log("Failed to delete file: ", err);
      });
    }

    await subCategoryControl.destroy({
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
