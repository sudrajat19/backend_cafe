import fs from "fs";
import {
  categoryControl,
  contactControl,
  menuControl,
  outletControl,
  profileControl,
  subCategoryControl,
} from "../models/index.js";
import sequelize from "../db/config/db.js";
import { Op, QueryTypes } from "sequelize";
import { deleteFile } from "../validations/fileValidations.js";

export const getPaginatedMenus = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const search_title = req.query.search_title || "";

  try {
    const { count, rows } = await menuControl.findAndCountAll({
      where: { title: { [Op.like]: `%${search_title}%` } },
      include: [
        {
          model: subCategoryControl,
          include: [
            {
              model: categoryControl,
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
            },
          ],
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
      menu: rows || [],
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).send({ error: "An error occurred while fetching menu." });
  }
};

export const getMenuBestSeller = async (req, res) => {
  const best_seller = req.params.best_seller;

  try {
    const data = await sequelize.query(
      `
      SELECT menus.*,outlets.outlet_name, outlets.email, outlets.role
       FROM menus  
       JOIN subcategories ON menus.id_subcategory = subcategories.id
       JOIN categories ON subcategories.id_category = categories.id 
       JOIN outlets ON categories.id_outlet = outlets.id
       WHERE menus.best_seller = :best_seller
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { best_seller },
      }
    );
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getMenuByCafeName = async (req, res) => {
  const outlet_name = req.params.outlet_name;
  try {
    const data = await menuControl.findAll({
      include: [
        {
          model: subCategoryControl,
          include: [
            {
              model: categoryControl,
              include: [{ model: outletControl, where: { outlet_name } }],
            },
          ],
        },
      ],
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getAllMenu = async (req, res) => {
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
                },
              ],
            },
          ],
        },
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
export const getMenuByIdOutlet = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await sequelize.query(
      `
      SELECT menus.*,outlets.outlet_name, outlets.email, outlets.role
       FROM menus  
       JOIN subcategories ON menus.id_subcategory = subcategories.id
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
export const getPaginatedMenu = async (req, res) => {
  const outlet_name = req.query.outlet_name;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  if (!outlet_name) {
    return res.status(400).json({ error: "Outlet name is required." });
  }

  try {
    const menu = await sequelize.query(
      `
      SELECT menus.*, 
             subcategories.title AS subcategory_title,
             categories.type AS category_type,
             outlets.outlet_name
      FROM menus  
      JOIN subcategories ON menus.id_subcategory = subcategories.id
      JOIN categories ON subcategories.id_category = categories.id 
      JOIN outlets ON categories.id_outlet = outlets.id
      WHERE outlets.outlet_name = :outlet_name
        AND (menus.title LIKE :search 
             OR subcategories.title LIKE :search 
             OR categories.type LIKE :search)
      LIMIT :limit OFFSET :offset
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { outlet_name, search: `%${search}%`, limit, offset },
      }
    );

    // Query to count total items
    const totalItemsResult = await sequelize.query(
      `
      SELECT COUNT(*) AS totalCount
      FROM menus  
      JOIN subcategories ON menus.id_subcategory = subcategories.id
      JOIN categories ON subcategories.id_category = categories.id 
      JOIN outlets ON categories.id_outlet = outlets.id
      WHERE outlets.outlet_name = :outlet_name
        AND (menus.title LIKE :search 
             OR subcategories.title LIKE :search 
             OR categories.type LIKE :search)
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { outlet_name, search: `%${search}%` },
      }
    );

    const totalCount = totalItemsResult[0].totalcount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      menu: menu || [],
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the menu." });
  }
};
export const getMenuByIdM = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await sequelize.query(
      `
      SELECT menus.*, categories.type, subcategories.title AS title_subcategories
      FROM menus
      JOIN subcategories ON menus.id_subcategory = subcategories.id
      JOIN categories ON subcategories.id_category = categories.id
      WHERE menus.id = :id
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
  const { id_subcategory, title, price, best_seller, details } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  if (!id_subcategory || !title || !price || !best_seller || !details) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const response = await subCategoryControl.findByPk(id_subcategory);
    if (!response) {
      return res.status(404).json({
        message: "subcategory not found",
      });
    }
    const newMenu = await menuControl.create({
      id_subcategory,
      title,
      price,
      best_seller,
      photo,
      details,
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
  const { id_subcategory, title, price, best_seller, details } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  try {
    const menu = await menuControl.findByPk(id);
    if (!menu) {
      return res.status(404).json({
        message: "menu not found",
      });
    }

    if (photo && menu.photo) {
      deleteFile(menu.photo);
    }

    await menuControl.update(
      {
        id_subcategory,
        title,
        price,
        best_seller,
        photo: photo || menuControl.photo,
        details,
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
      deleteFile(menu.photo);
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
