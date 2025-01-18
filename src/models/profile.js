import { Sequelize } from "sequelize";
const Profile = {
  id_outlet: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cafe_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  history: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  logo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};

export default Profile;
