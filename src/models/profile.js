import { Sequelize } from "sequelize";
const Profile = {
  id_outlet: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cafe_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  history: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  logo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default Profile;
