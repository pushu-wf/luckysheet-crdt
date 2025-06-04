import express from "express";
import { UserRouter } from "./User";
import { FolderRouter } from "./Folder";
import { initPages } from "../Controller";
import { FileMapRouter } from "./FileMap";
import { LuckySheetRouter } from "./LuckySheet";

const routes = express.Router();

// 模块化的路由，直接调用 routes.use() 即可

routes.use("/user", UserRouter);

routes.use("/luckysheet", LuckySheetRouter);

routes.use("/filemap", FileMapRouter);

routes.use("/folder", FolderRouter);

routes.get("*", initPages);

export default routes;
