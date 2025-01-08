import fs from "fs";
import { contactControl, outletControl } from "../models/index.js";
export const getContactByNameCafe = async (req, res) => {
  try {
    const respon = await contactControl.findAll({
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
export const getContact = async (req, res) => {
  try {
    const data = await contactControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getContactById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await contactControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createContact = async (req, res) => {
  const { id_outlet, contact_name, value } = req.body;
  let logo = req.file ? "images/" + req.file.filename : null;
  console.log(req.body);

  if (!id_outlet || !req.file || !contact_name || !value) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const newContact = await contactControl.create({
      id_outlet,
      contact_name,
      value,
      logo,
    });
    res.status(201).json({
      message: "Success to create contact",
      data: newContact,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create contact",
      error: err.message,
    });
  }
};

export const updateContact = async (req, res) => {
  const id = req.params.id;
  const { id_outlet, contact_name, value } = req.body;
  let logo = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet || !contact_name || !value) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const contact = await contactControl.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        message: "contact not found",
      });
    }

    if (logo && contact.logo) {
      fs.unlink(contact.logo, (err) => {
        if (err) console.log("Fail to delete file: ", err);
      });
    }

    await contactControl.update(
      {
        id_outlet,
        contact_name,
        value,
        logo: logo || contactControl.logo,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change contact",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change contact",
      error: err.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  const id = req.params.id;

  try {
    const contact = await contactControl.findOne({ where: { id } });
    if (!contact) {
      return res.status(404).json({
        message: "contact not found",
      });
    }

    if (contact.logo) {
      fs.unlink(contact.logo, (err) => {
        if (err) console.log("Failed to delete file: ", err);
      });
    }

    await contactControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "contact success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete contact",
      error: err.message,
    });
  }
};
