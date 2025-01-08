import fs from "fs";
import { eventControl, outletControl } from "../models/index.js";

export const getEventByNameCafe = async (req, res) => {
  try {
    const respon = await eventControl.findAll({
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
export const getEventByIdOutlet = async (req, res) => {
  try {
    const respon = await eventControl.findAll({
      include: [
        {
          model: outletControl,
          required: false,
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
export const getEvent = async (req, res) => {
  try {
    const data = await eventControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getEventById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await eventControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createEvent = async (req, res) => {
  const { id_outlet, title, description } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;
  console.log(req.body);

  if (!id_outlet || !req.file || !title || !description) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const newEvent = await eventControl.create({
      id_outlet,
      title,
      description,
      photo,
    });
    res.status(201).json({
      message: "Success to create event",
      data: newEvent,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create event",
      error: err.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  const id = req.params.id;
  const { id_outlet, title, description } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet || !title || !description) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const event = await eventControl.findByPk(id);
    if (!event) {
      return res.status(404).json({
        message: "event not found",
      });
    }

    if (photo && event.photo) {
      fs.unlink(event.photo, (err) => {
        if (err) console.log("Fail to delete file: ", err);
      });
    }

    await eventControl.update(
      {
        id_outlet,
        title,
        description,
        photo: photo || eventControl.photo,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change event",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change event",
      error: err.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await eventControl.findOne({ where: { id } });
    if (!event) {
      return res.status(404).json({
        message: "event not found",
      });
    }

    if (event.photo) {
      fs.unlink(event.photo, (err) => {
        if (err) console.log("Failed to delete file: ", err);
      });
    }

    await eventControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "event success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete event",
      error: err.message,
    });
  }
};
