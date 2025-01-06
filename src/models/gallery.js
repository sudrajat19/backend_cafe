import { Sequelize } from "sequelize";
const Gallery = {
  id_outlet: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default Gallery;
