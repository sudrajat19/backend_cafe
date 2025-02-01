import db from "../db/config/db.js";
import category from "./categories.js";
import subCategory from "./subcategories.js";
import menu from "./menus.js";
import outlet from "./outlets.js";
import AccessToken from "./accesstoken.js";
import Profile from "./profiles.js";
import Contact from "./contacts.js";
import Gallery from "./galleries.js";
import Event from "./events.js";
import Tables from "./tables.js";
import Transactions from "./transactions.js";
import Orders from "./orders.js";

const accessToken = db.define("access_token", AccessToken, {
  tableName: "accessTokens",
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
const galleryControl = db.define("gallery", Gallery, {
  tableName: "galleries",
});
const eventControl = db.define("event", Event, { tableName: "events" });
const tableControl = db.define("table", Tables, { tableName: "tables" });
const transactionControl = db.define("transaction", Transactions, {
  tableName: "transactions",
});
const orderControl = db.define("order", Orders, { tableName: "orders" });

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
outletControl.hasMany(galleryControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
galleryControl.belongsTo(outletControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
outletControl.hasMany(eventControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
eventControl.belongsTo(outletControl, {
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
outletControl.hasMany(tableControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tableControl.belongsTo(outletControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
tableControl.hasMany(transactionControl, {
  foreignKey: "id_table",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
transactionControl.belongsTo(tableControl, {
  foreignKey: "id_table",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
transactionControl.hasMany(orderControl, {
  foreignKey: "id_transaction",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
orderControl.belongsTo(transactionControl, {
  foreignKey: "id_transaction",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
menuControl.hasMany(orderControl, {
  foreignKey: "id_menu",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
orderControl.belongsTo(menuControl, {
  foreignKey: "id_menu",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
outletControl.hasMany(transactionControl, {
  foreignKey: "id_outlet",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
transactionControl.belongsTo(outletControl, {
  foreignKey: "id_outlet",
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
  galleryControl,
  eventControl,
  tableControl,
  transactionControl,
  orderControl,
};
