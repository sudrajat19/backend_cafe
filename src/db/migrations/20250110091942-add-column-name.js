"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("categories", "descriptions", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("menus", "details", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("categories", "descriptions");
    await queryInterface.removeColumn("menus", "details");
  },
};
