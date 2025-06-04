import express from "express";
import { uploadImage, WorkerBookController, loadSheetData } from "../../Controller";

const routes = express.Router();

// 用于上传图片 - 先定义 upload name 属性
routes.post("/uploadImage", uploadImage);

// 请求 workerbook 数据
routes.post("/getWorkerBook", WorkerBookController.getWorkerBook);

// 初始化 luckysheet 数据
routes.post("/loadSheetData", loadSheetData);

// 新建  workerbook
routes.post("/createWorkerBook", WorkerBookController.createWorkerBook);

// 查询文件列表 - 全部 /  收藏 / 最近 / 共享
routes.post("/getFileList", WorkerBookController.getFileList);

// 删除文件
routes.post("/deleteFile", WorkerBookController.deleteFile);

// 重命名
routes.post("/renameFile", WorkerBookController.renameFile);

// 模块化的路由，直接调用 routes.use() 即可
export const LuckySheetRouter = routes;
