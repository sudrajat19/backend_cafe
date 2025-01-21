import db from "../db/config/db.js";
import category from "./category.js";
import subCategory from "./subcategory.js";
import menu from "./menu.js";
import outlet from "./outlet.js";
import AccessToken from "./access_token.js";
import Profile from "./profile.js";
import Contact from "./contact.js";

const accessToken = db.define("access_token", AccessToken, {
  tableName: "access_tokens",
});
const categoryControl = db.define("category", category, {
  tableName: "categories",
});
const subCategoryControl = db.define("subcategory", subCategory, {
  tableName: "subcategories",
});
const menuControl = db.define("menu", menu, { tableName: "menus" });
const outletControl = db.define("outlet", outlet, { tableName: "outlets" });
const profileControl = db.define("profile", Profile, { tableName: "profiles" });
const contactControl = db.define("contact", Contact, {
  tableName: "contacts",
});

outletControl.hasMany(accessToken, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
accessToken.belongsTo(outletControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
outletControl.hasOne(profileControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
profileControl.belongsTo(outletControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
outletControl.hasMany(contactControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
contactControl.belongsTo(outletControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

outletControl.hasMany(categoryControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
categoryControl.belongsTo(outletControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

categoryControl.hasMany(subCategoryControl, {
  foreignKey: "id_category",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
subCategoryControl.belongsTo(categoryControl, {
  foreignKey: "id_category",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

subCategoryControl.hasMany(menuControl, {
  foreignKey: "id_subcategory",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
menuControl.belongsTo(subCategoryControl, {
  foreignKey: "id_subcategory",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export {
  categoryControl,
  subCategoryControl,
  menuControl,
  outletControl,
  accessToken,
  profileControl,
  contactControl,
};
