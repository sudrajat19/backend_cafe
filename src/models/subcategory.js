import { Sequelize } from "sequelize";
const subcategory = {
  id_category: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default subcategory;
