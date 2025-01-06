import fs from "fs";
import { galleryControll } from "../models/index.js";

export const getGallery = async (req, res) => {
  try {
    const data = await galleryControll.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
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
