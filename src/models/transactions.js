import { Sequelize } from "sequelize";
const Transactions = {
  id_table: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  id_outlet: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  pays_method: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  total_pay: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  note: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
};

export default Transactions;
