import { Op } from "sequelize";
import {
  orderControl,
  outletControl,
  transactionControl,
} from "../models/index.js";

export const getPaginatedTransaction = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const { count, rows } = await transactionControl.findAndCountAll({
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
      transaction: rows || [],
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching transaction." });
  }
};

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

export const createTransactions = async (id_outlet, ord, req, res) => {
  try {
    // const Transaction = await transactionControl.findByPk(id_outlet);
    // if (!Transaction) {
    //   console.log("not found");
    // }

    const data = await transactionControl.create({
      id_outlet,
      id_table: ord.id_table,
      status: ord.status,
      pays_method: ord.pays_method,
      total_pay: ord.total_pay,
      note: ord.note,
    });
    console.log(data);

    ord.orders.forEach((item) => {
      item.id_transaction = data.id;
    });

    await orderControl.bulkCreate(ord.orders);
  } catch (err) {
    console.log(err);
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
