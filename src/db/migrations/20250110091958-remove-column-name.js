"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("categories", "photo");
    await queryInterface.removeColumn("subcategories", "photo");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("categories", "photo", {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("subcategories", "photo", {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
    });
  },
};
