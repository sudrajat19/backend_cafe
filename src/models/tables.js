import { Sequelize } from "sequelize";
const Tables = {
  id_outlet: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  number_table: {
    type: Sequelize.INTEGER,
    allowNull: false,
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

export default Tables;
