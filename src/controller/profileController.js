import fs from "fs";
import { outletControl, profileControl } from "../models/index.js";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../db/config/db.js";
import bcrypt from "bcrypt";
import { deleteFile } from "../validations/fileValidations.js";

export const getPaginatedProfiles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const { count, rows } = await profileControl.findAndCountAll({
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
      subcategory: rows || [],
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching profile." });
  }
};

export const getOutletProfile = async (req, res) => {
  try {
    const data = await outletControl.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: profileControl,
        },
      ],
    });
    res.send(data);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getPaginatedProfile = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  console.log(search);

  try {
    const proflie = await sequelize.query(
      `SELECT *
       FROM profiles
        WHERE profiles.cafe_name LIKE :search
       LIMIT :limit OFFSET :offset`,
      {
        type: QueryTypes.SELECT,
        replacements: { limit, offset, search: `%${search}%` },
      }
    );

    const totalItems = await sequelize.query(
      `SELECT *
       FROM profiles
        WHERE profiles.cafe_name LIKE :search `,
      {
        type: QueryTypes.SELECT,
        replacements: { search: `%${search}%` },
      }
    );

    const totalCount = totalItems.length > 0 ? totalItems.length : 0;
    const totalPages = Math.ceil(totalCount / limit);

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
      SELECT profiles.*,outlets.outlet_name, outlets.email, outlets.role
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
      SELECT profiles.*,outlets.outlet_name, outlets.email, outlets.role
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

  try {
    const response = await outletControl.findByPk(id_outlet);
    if (!response) {
      return res.status(404).json({
        message: "id_outlet not found",
      });
    }
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
      deleteFile(profile.logo);
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

export const updateProfileOutlet = async (req, res) => {
  const saltRounds = 10;
  const id_outlet = req.params.id_outlet;
  const { outlet_name, email, password, cafe_name, address, history } =
    req.body;
  let logo = req.file ? "images/" + req.file.filename : null;
  try {
    const profile = await outletControl.findOne({
      where: { id: id_outlet },
      include: [
        {
          model: profileControl,
        },
      ],
    });
    if (!profile.profile) {
      return res.status(404).json({
        message: "profile not found",
      });
    }

    if (logo && profile.profile.logo) {
      deleteFile(profile.profile.logo);
    }

    await profileControl.update(
      {
        id_outlet: profile.profile.id_outlet,
        cafe_name: cafe_name ? cafe_name : profile.profile.cafe_name,
        address: address ? address : profile.profile.address,
        history: history ? history : profile.profile.history,
        logo: logo ? logo : profile.profile.logo,
      },
      { where: { id_outlet } }
    );
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await outletControl.update(
        {
          outlet_name: outlet_name ? outlet_name : profile.outlet_name,
          email: email ? email : profile.email,
          password: hashedPassword,
          role: profile.role,
        },
        { where: { id: id_outlet } }
      );
    } else {
      await outletControl.update(
        {
          outlet_name: outlet_name ? outlet_name : profile.outlet_name,
          email: email ? email : profile.email,
          password: profile.password,
          role: profile.role,
        },
        { where: { id: id_outlet } }
      );
    }
    res.status(200).json({
      message: "Success to change Outlet and Profile",
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
      deleteFile(profile.logo);
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
