import express from "express";
import { UserRouter } from "./User";
import { FileMapRouter } from "./FileMap";
import { Controller } from "../Controller";
import { LuckySheetRouter } from "./LuckySheet";

const routes = express.Router();

routes.use("/user", UserRouter);

// 模块化的路由，直接调用 routes.use() 即可
routes.use("/luckysheet", LuckySheetRouter);

// File Map Router
routes.use("/filemap", FileMapRouter);

routes.get("*", Controller.initPages);

export default routes;
