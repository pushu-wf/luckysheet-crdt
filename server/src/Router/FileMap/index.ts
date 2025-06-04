// 文件映射表路由
import express from "express";
import { FileMapController } from "../../Controller";

const routes = express.Router();

// 更新属性 - 目前属性就支持 favor
routes.post("/setFavor", FileMapController.setFavor);

// 受邀请时，通过 filemapid 获取当前映射的信息
routes.post("/getInviteInfo", FileMapController.getInviteInfo);

// 同意邀请
routes.post("/acceptInvite", FileMapController.acceptInvite);

// 判断用户是否有文件编辑权限
routes.post("/checkSheetEditPermission", FileMapController.checkSheetEditPermission);

// 模块化的路由，直接调用 routes.use() 即可
export const FileMapRouter = routes;
