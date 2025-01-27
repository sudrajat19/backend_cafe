import { tableControl } from "../models/index.js";

export const getTable = async (req, res) => {
  try {
    const data = await tableControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getTableById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await tableControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createTable = async (req, res) => {
  const { id_outlet, number_table } = req.body;

  if (!id_outlet || !number_table) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }
  try {
    const newTable = await tableControl.create({
      id_outlet,
      number_table,
    });
    res.status(201).json({
      message: "Success to create Table",
      data: newTable,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create Table",
      error: err.message,
    });
  }
};

export const updateTable = async (req, res) => {
  const id = req.params.id;
  const { id_outlet, number_table } = req.body;

  if (!id_outlet || !number_table) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const Table = await tableControl.findByPk(id);
    if (!Table) {
      return res.status(404).json({
        message: "Table not found",
      });
    }

    await tableControl.update(
      {
        id_outlet,
        number_table,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change Table",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change Table",
      error: err.message,
    });
  }
};

export const deleteTable = async (req, res) => {
  const id = req.params.id;

  try {
    const Table = await tableControl.findOne({ where: { id } });
    if (!Table) {
      return res.status(404).json({
        message: "Table not found",
      });
    }

    await tableControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Table success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete Table",
      error: err.message,
    });
  }
};
