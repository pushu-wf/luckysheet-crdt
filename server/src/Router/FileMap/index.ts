// 文件映射表路由
import express from "express";
import { Controller } from "../../Controller";

const routes = express.Router();

// 更新属性 - 目前属性就支持 favor
routes.post("/setFavor", Controller.setFavor);

// 模块化的路由，直接调用 routes.use() 即可
export const FileMapRouter = routes;
