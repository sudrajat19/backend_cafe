import fs from "fs";
import { profileControl } from "../models/index.js";
import { QueryTypes } from "sequelize";
import sequelize from "../db/config/db.js";

export const getPaginatedProfile = async (req, res) => {
  const outlet_name = req.query.outlet_name;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  console.log(search);

  try {
    const proflie = await sequelize.query(
      `SELECT *
       FROM profiles
       JOIN outlets ON profiles.id_outlet = outlets.id
       WHERE outlets.outlet_name = :outlet_name
        AND (profiles.cafe_name LIKE :search )
       LIMIT :limit OFFSET :offset`,
      {
        type: QueryTypes.SELECT,
        replacements: { limit, offset, search: `%${search}%`, outlet_name },
      }
    );

    const totalItems = await sequelize.query(
      `SELECT *
       FROM profiles
       JOIN outlets ON profiles.id_outlet = outlets.id
       WHERE outlets.outlet_name = :outlet_name
        AND (profiles.cafe_name LIKE :search )`,
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
      proflie: proflie || [],
    });
  } catch (error) {
    console.error("Error fetching proflie:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching proflie." });
  }
};

export const getProfileByCafeName = async (req, res) => {
  const outlet_name = req.params.outlet_name;
  try {
    const data = await sequelize.query(
      `
      SELECT *
       FROM profiles
       JOIN outlets ON profiles.id_outlet = outlets.id
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
export const getProfileByIdOutlet = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await sequelize.query(
      `
      SELECT *
       FROM profiles
       JOIN outlets ON profiles.id_outlet = outlets.id
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
