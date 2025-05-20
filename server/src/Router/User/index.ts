import express from "express";
import { Controller } from "../../Controller";

const routes = express.Router();

// 注册用户
routes.post("/register", Controller.register);

// 用户登录
routes.post("/login", Controller.login);

// 修改用户信息
routes.post("/updateUser", Controller.updateUser);

// 模块化的路由，直接调用 routes.use() 即可
export const UserRouter = routes;
