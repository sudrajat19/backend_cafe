import express from "express";
import loginRoute from "../middleware/login.js";
import outletRoute from "./routerOutlet.js";
import categoryRoute from "./routerCategory.js";
import subCategoryRoute from "./routerSubCategory.js";
import menuRoute from "./routerMenu.js";
import profileRoute from "./routerProfile.js";
import galleryRoute from "./routerGallery.js";
import contactRoute from "./routerContact.js";
import eventRoute from "./routerEvent.js";

const app = express();
app.use("/api/v1/login", loginRoute);
app.use("/api/v1/outlet", outletRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subcategory", subCategoryRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/gallery", galleryRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/event", eventRoute);

export default app;
