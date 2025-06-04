// 文件夹相关路由
import express from "express";
import { FolderController } from "../../Controller";

const routes = express.Router();

// 创建文件夹
routes.post("/createFolder", FolderController.createFolder);

// 更新文件夹 - 包括更新文件夹名称 更新文件夹路径
routes.post("/updateFolder", FolderController.updateFolder);

// 删除文件夹
routes.post("/deleteFolder", FolderController.deleteFolder);

// 查询文件 - 通过指定 folderid 查询 （查询文件夹列表）
routes.post("/getFolderList", FolderController.getFolderList);

// 模块化的路由，直接调用 routes.use() 即可
export const FolderRouter = routes;
