import { Sequelize } from "sequelize";
const Category = {
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
