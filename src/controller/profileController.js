import fs from "fs";
import { profileControl } from "../models/index.js";

export const getProfile = async (req, res) => {
  try {
    const data = await profileControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getProfileById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await profileControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createProfile = async (req, res) => {
  const { id_outlet, cafe_name, address, history } = req.body;
  let logo = req.file ? "images/" + req.file.filename : null;
  console.log(req.body);

  if (!id_outlet || !req.file || !cafe_name || !address || !history) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const newProfile = await profileControl.create({
      id_outlet,
      cafe_name,
      address,
      history,
      logo,
    });
    res.status(201).json({
      message: "Success to create profile",
      data: newProfile,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create profile",
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  const id = req.params.id;
  const { id_outlet, cafe_name, address, history } = req.body;
  let logo = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet || !cafe_name || !address || !history) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const profile = await profileControl.findByPk(id);
    if (!profile) {
      return res.status(404).json({
        message: "profile not found",
      });
    }

    if (logo && profile.logo) {
      fs.unlink(profile.logo, (err) => {
        if (err) console.log("Fail to delete file: ", err);
      });
    }

    await profileControl.update(
      {
        id_outlet,
        cafe_name,
        address,
        history,
        logo: logo || profileControl.logo,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change profile",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change profile",
      error: err.message,
    });
  }
};

export const deleteProfile = async (req, res) => {
  const id = req.params.id;

  try {
    const profile = await profileControl.findOne({ where: { id } });
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    if (profile.logo) {
      fs.unlink(profile.logo, (err) => {
        if (err) console.log("Failed to delete file: ", err);
      });
    }

    await profileControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Profile success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete Profile",
      error: err.message,
    });
  }
};
