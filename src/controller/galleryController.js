import fs from "fs";
import { galleryControll } from "../models/index.js";
import sequelize from "../db/config/db.js";
import { QueryTypes } from "sequelize";

export const getPaginatedGallery = async (req, res) => {
  const outlet_name = req.query.outlet_name;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  console.log(search);

  try {
    const gallery = await sequelize.query(
      `SELECT *
       FROM galleries
       JOIN outlets ON galleries.id_outlet = outlets.id
      WHERE outlets.outlet_name = :outlet_name
        AND (galleries.title LIKE :search )
       LIMIT :limit OFFSET :offset`,
      {
        type: QueryTypes.SELECT,
        replacements: { limit, offset, search: `%${search}%`, outlet_name },
      }
    );

    const totalItems = await sequelize.query(
      `SELECT *
       FROM galleries
       JOIN outlets ON galleries.id_outlet = outlets.id
       WHERE outlets.outlet_name = :outlet_name
        AND (galleries.title LIKE :search )`,
      {
        type: QueryTypes.SELECT,
        replacements: { search: `%${search}%`, outlet_name },
      }
    );

    const totalCount = totalItems.length > 0 ? totalItems.length : 0;
    const totalPages = Math.ceil(totalCount / limit);
    console.log(totalItems.length, "cek count");

    res.json({
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      gallery: gallery || [],
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching gallery." });
  }
};

export const getGalleryByCafeName = async (req, res) => {
  const outlet_name = req.params.outlet_name;
  try {
    const data = await sequelize.query(
      `
      SELECT *
       FROM galleries
       JOIN outlets ON galleries.id_outlet = outlets.id
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
export const getGalleryByIdOutlet = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await sequelize.query(
      `
      SELECT *
       FROM galleries
       JOIN outlets ON galleries.id_outlet = outlets.id
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
export const getGalleryById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await galleryControll.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createGallery = async (req, res) => {
  const { id_outlet, title } = req.body;
  let image = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet || !req.file || !title) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const newGallery = await galleryControll.create({
      id_outlet,
      title,
      image,
    });
    res.status(201).json({
      message: "Success to create gallery",
      data: newGallery,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create gallery",
      error: err.message,
    });
  }
};

export const updateGallery = async (req, res) => {
  const id = req.params.id;
  const { id_outlet, title } = req.body;
  let image = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const gallery = await galleryControll.findByPk(id);
    if (!gallery) {
      return res.status(404).json({
        message: "gallery not found",
      });
    }

    if (image && gallery.image) {
      fs.unlink(gallery.image, (err) => {
        if (err) console.log("Fail to delete file: ", err);
      });
    }

    await galleryControll.update(
      {
        id_outlet,
        title,
        image: image || galleryControll.image,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change gallery",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change gallery",
      error: err.message,
    });
  }
};

export const deleteGallery = async (req, res) => {
  const id = req.params.id;

  try {
    const gallery = await galleryControll.findOne({ where: { id } });
    if (!gallery) {
      return res.status(404).json({
        message: "gallery not found",
      });
    }

    if (gallery.image) {
      fs.unlink(gallery.image, (err) => {
        if (err) console.log("Failed to delete file: ", err);
      });
    }

    await galleryControll.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "gallery success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete gallery",
      error: err.message,
    });
  }
};
