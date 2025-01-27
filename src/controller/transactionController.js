import { transactionControl } from "../models/index.js";

export const getTransaction = async (req, res) => {
  try {
    const data = await transactionControl.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getTransactionById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await transactionControl.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createTransaction = async (req, res) => {
  const { id_table, status, pays_method, total_pay, note } = req.body;

  try {
    const newTransaction = await transactionControl.create({
      id_table,
      status,
      pays_method,
      total_pay,
      note,
    });
    res.status(201).json({
      message: "Success to create Transaction",
      data: newTransaction,
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to create Transaction",
      error: err.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  const id = req.params.id;
  const { id_table, status, pays_method, total_pay, note } = req.body;

  if (!id_table || !status || !pays_method || !total_pay || !note) {
    return res.status(400).json({
      message: "All field must be filled",
    });
  }

  try {
    const Transaction = await transactionControl.findByPk(id);
    if (!Transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    await transactionControl.update(
      {
        id_table,
        status,
        pays_method,
        total_pay,
        note,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Success to change Transaction",
    });
  } catch (err) {
    res.status(400).send({
      message: "Failed to change Transaction",
      error: err.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  const id = req.params.id;

  try {
    const Transaction = await transactionControl.findOne({ where: { id } });
    if (!Transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    await transactionControl.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Transaction success delete",
    });
  } catch (err) {
    res.status(500).json({
      message: "Fail to delete Transaction",
      error: err.message,
    });
  }
};
