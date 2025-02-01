module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("transactions", "id_outlet", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.removeColumn("orders", "id_outlet"),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("transactions", "id_outlet"),
      queryInterface.addColumn("orders", "id_outlet", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },
};
