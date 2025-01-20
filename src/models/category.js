import { Sequelize } from "sequelize";
const Category = {
  id_outlet: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descriptions: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default Category;
