import { Sequelize } from "sequelize";
const Contact = {
  id_outlet: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  contact_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  value: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  logo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default Contact;
