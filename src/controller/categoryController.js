import fs from "fs";
import {
  categoryControl,
  menuControl,
  outletControl,
  profileControl,
  subCategoryControl,
} from "../models/index.js";
import { Op } from "sequelize";
export const getPaginatedCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const { count, rows } = await categoryControl.findAndCountAll({
      include: [
        {
          model: outletControl,
          attributes: ["outlet_name"],
          where: {
            outlet_name: {
              [Op.like]: `%${search}%`,
            },
          },
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
      category: rows || [],
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching category." });
  }
};

export const getAllCategories = async (req, res) => {
  const outlet_name = req.params.outlet_name;
  try {
    const data = await outletControl.findAll({
      where: {
        outlet_name,
      },
      include: [
        {
          model: categoryControl,
          include: [
            {
              model: subCategoryControl,
              include: [
                {
                  model: menuControl,
                  where: {
                    best_seller: req.params.best_seller,
                  },
                },
              ],
            },
          ],
        },
        {
          model: profileControl,
        },
      ],
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getCategoryByNameCafe = async (req, res) => {
  try {
    const respon = await categoryControl.findAll({
      include: [
        {
          model: outletControl,
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
  const { id_outlet, type, descriptions } = req.body;

  if (!id_outlet || !type || !descriptions) {
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
      descriptions,
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
  const { id_outlet, type, descriptions } = req.body;

  if (!id_outlet || !type || !descriptions) {
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

    await categoryControl.update(
      {
        id_outlet,
        type,
        descriptions,
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
