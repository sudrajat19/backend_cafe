import { Sequelize } from "sequelize";
const Category = {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default Category;
