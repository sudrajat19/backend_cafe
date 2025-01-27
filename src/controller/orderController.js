import { orderControl } from "../models/index.js";

export const getOrder = async (req, res) => {
  try {
    const data = await orderControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getOrderById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await orderControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createOrder = async (req, res) => {
  const { id_menu, id_transaction, id_outlet, qty, total_price } = req.body;

  try {
    const newOrder = await orderControl.create({
      id_menu,
      id_transaction,
      id_outlet,
      qty,
      total_price,
    });
    res.status(201).json({
      message: "Success to create Order",
      data: newOrder,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create Order",
      error: err.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  const id = req.params.id;
  const { id_menu, total_price, id_transaction, id_outlet, qty } = req.body;

  if (!id_menu || !total_price || !id_transaction || !id_outlet || !qty) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const Order = await orderControl.findByPk(id);
    if (!Order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await orderControl.update(
      {
        id_menu,
        total_price,
        id_transaction,
        id_outlet,
        qty,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change Order",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change Order",
      error: err.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const Order = await orderControl.findOne({ where: { id } });
    if (!Order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await orderControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Order success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete Order",
      error: err.message,
    });
  }
};
