import express from "express";
import { UserRouter } from "./User";
import { Controller } from "../Controller";
import { LuckySheetRouter } from "./LuckySheet";

const routes = express.Router();

// 用于处理 html 页面，部署使用
routes.get("/", Controller.initPages);

// 模块化的路由，直接调用 routes.use() 即可
routes.use("/luckysheet", LuckySheetRouter);

routes.use("/user", UserRouter);

export default routes;
