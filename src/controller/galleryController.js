import { Op } from "sequelize";
import { galleryControl, outletControl } from "../models/index.js";
import { deleteFile } from "../validations/fileValidations.js";

export const getPaginatedGallery = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const { count, rows } = await galleryControl.findAndCountAll({
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
      gallery: rows || [],
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching gallery." });
  }
};

export const getGallery = async (req, res) => {
  try {
    const data = await galleryControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getGalleryById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await galleryControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createGallery = async (req, res) => {
  const { id_outlet, title } = req.body;
  let image = req.file ? "images/" + req.file.filename : null;
  console.log(req.body, "cek body");
  try {
    const newGallery = await galleryControl.create({
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

  if (!id_outlet || !title) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const gallery = await galleryControl.findByPk(id);
    if (!gallery) {
      return res.status(404).json({
        message: "gallery not found",
      });
    }

    if (image && gallery.image) {
      deleteFile(gallery.image);
    }

    await galleryControl.update(
      {
        id_outlet,
        title,
        image: image || galleryControl.image,
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
    const gallery = await galleryControl.findOne({ where: { id } });
    if (!gallery) {
      return res.status(404).json({
        message: "gallery not found",
      });
    }

    if (gallery.image) {
      deleteFile(gallery.image);
    }

    await galleryControl.destroy({
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
