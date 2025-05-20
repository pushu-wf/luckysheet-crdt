import express from "express";
import { Controller } from "../../Controller";

const routes = express.Router();

// 用于上传图片 - 先定义 upload name 属性
routes.post("/uploadImage", Controller.uploadImage);

// 请求 workerbook 数据
routes.post("/getWorkerBook", Controller.getWorkerBook);

// 初始化 luckysheet 数据
routes.post("/loadSheetData", Controller.loadSheetData);

// 模块化的路由，直接调用 routes.use() 即可
export const LuckySheetRouter = routes;
