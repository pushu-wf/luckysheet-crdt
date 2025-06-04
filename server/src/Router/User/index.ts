import express from "express";
import { UserController } from "../../Controller";

const routes = express.Router();

// 注册用户
routes.post("/register", UserController.register);

// 用户登录
routes.post("/login", UserController.login);

// 修改用户信息
routes.post("/updateUser", UserController.updateUser);

// 验证密码是否正确
routes.post("/verifyPassword", UserController.verifyPassword);

// 用户上传头像
routes.post("/uploadAvatar", UserController.uploadAvatar);

// 模块化的路由，直接调用 routes.use() 即可
export const UserRouter = routes;
