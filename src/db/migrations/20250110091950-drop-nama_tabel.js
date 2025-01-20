"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("events");
    await queryInterface.dropTable("galleries");
    await queryInterface.addColumn("contacts", "link", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
