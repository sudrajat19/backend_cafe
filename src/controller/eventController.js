import { eventControl } from "../models/index.js";

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
  const { id_outlet, title, descriptions } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;
  console.log(photo, "cek");
  try {
    const newEvent = await eventControl.create({
      id_outlet,
      title,
      photo,
      descriptions,
    });
    res.status(201).json({
      message: "Success to create Event",
      data: newEvent,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create Event",
      error: err.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  const id = req.params.id;
  const { id_outlet, title, descriptions } = req.body;
  let photo = req.file ? "images/" + req.file.filename : null;

  if (!id_outlet || !title || !descriptions) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const Event = await eventControl.findByPk(id);
    if (!Event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (photo && Event.photo) {
      deleteFile(Event.photo);
    }

    await eventControl.update(
      {
        id_outlet,
        title,
        descriptions,
        photo: photo || eventControl.photo,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change Event",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change Event",
      error: err.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  const id = req.params.id;

  try {
    const Event = await eventControl.findOne({ where: { id } });
    if (!Event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (Event.photo) {
      deleteFile(Event.photo);
    }

    await eventControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Event success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete Event",
      error: err.message,
    });
  }
};
