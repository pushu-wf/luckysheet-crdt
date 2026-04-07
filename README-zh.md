<p align="center">
  <img src='./public/logo.svg' alt="Luckysheet CRDT Logo" />
</p>

<h1 align="center">Luckysheet CRDT</h1>

简体中文 | [English](./README.md)

`在线体验`: [https://luckysheet-crdt.netlify.app/](https://luckysheet-crdt.netlify.app/)

---

<p align="center">
  <img src='./public/result/result.gif' alt='协同编辑演示' />
</p>

## 项目简介

Luckysheet CRDT 是基于 [Luckysheet](https://github.com/mengshukeji/Luckysheet) 的协同增强版，提供多人实时协同编辑功能。

- **基于原项目做二次开发，以拓展相关功能，修复原有BUG**

**核心特性：**

- ✅ 多人实时协同编辑
- ✅ 可选数据库持久化
- ✅ 图表协同（VChart/ChartMix）
- ✅ Excel 导入导出
- ✅ 单元格图片、打印优化、自定义菜单等增强功能

**技术栈：** TypeScript + Node.js + Sequelize + WebSocket

## 快速开始

### 方式一：Docker 部署（推荐）

```bash
# 1. 克隆项目
git clone https://gitee.com/wfeng0/luckysheet-crdt
cd luckysheet-crdt

# 2. 复制环境变量
cp env.example .env

# 3. 启动服务
docker-compose up -d
```

### 方式二：本地开发

```bash
# 1. 克隆项目
git clone https://gitee.com/wfeng0/luckysheet-crdt
cd luckysheet-crdt

# 2. 安装依赖（推荐 pnpm）
pnpm install && cd server && pnpm install

# 3. （可选）配置数据库
# 编辑 server/src/Config/index.ts

# 4. （可选）同步数据库表
npm run db

# 5. 启动服务
# 终端1: 前端
npm run dev
# 终端2: 后端
npm run server
```

访问 http://localhost:9000

## 项目分支

- `master`: 稳定版，可选数据库服务
- `master-alpha`: 开发版，可选数据库服务
- `master-vue`: 完整版，含用户系统和文件系统（需数据库）

## 仓库地址

- Gitee: https://gitee.com/wfeng0/luckysheet-crdt
- GitHub: https://github.com/pushu-wf/luckysheet-crdt

> ⚠️ **注意**: 最新特性优先在 Gitee 更新

## 重要说明

### 开源协议

- 基于 Luckysheet 修改，遵循 Apache 2.0 协议
- **请勿删除源码头部版权声明**

### 源码获取

从 2025-04-15 版本起，**Luckysheet 源码修改部分不再公开**。

- ✅ 现有协同功能完全可用，无需源码
- 💰 如需二次开发，可付费获取源码（199元）
- 📧 联系：QQ群 522121825 | Email: 1982392655@qq.com

### 数据库说明

- `master`/`master-alpha`: 数据库可选，无数据库时协同功能正常但数据不持久化
- `master-vue`: 必须配置数据库

## 主要功能

### 1. 协同编辑

- 多人实时编辑同步
- 光标位置同步
- 支持撤销/重做协同

### 2. 图表支持

- VChart 图表（动画流畅、美观）
- ChartMix 图表（数据联动）
- 图表创建、编辑协同

### 3. 文件操作

- Excel 导入（基于 luckyexcel）
- Excel 导出（基于 exceljs）
- 支持协同导入导出

```js
plugins: [
    { name: "fileImport" }, // 导入插件
    { name: "fileExport" }, // 导出插件
];
```

### 4. 打印优化

- 支持打印当前页/选区/指定页码
- 高清打印优化
- 支持取消网格线

```js
luckysheet.print({mode:'', needToPreview = true, range = "",}); // mode: "sheet" | "areas" | "pages"

// 配置打印清晰度
printDevicePixelRatio: 4; // 数值越大越清晰
```

### 5. 单元格图片

- 浮动图片/单元格图片
- 两种模式相互转换
- 图片合并自适应

### 6. 自定义扩展

- **自定义菜单**：添加自定义菜单项
- **自定义快捷键**：配置快捷键回调
- **自定义请求头**：添加 Token 认证等
- **自定义函数**：添加自定义函数

```js
// 自定义菜单
menuHandler: {
    customs: [
        { label: "保存", value: "saveFile", order: 1 },
        { value: "divider" }, // 分割线
    ];
}

// 自定义请求头
requestHeaders: {
    authorization: "Bearer token";
}

// 自定义函数
customFunction: [
    {
        name: "ROUNDBANK",
        implementation: function () {},
        description: {},
    },
];
```

### 7. 其他优化

- UI 重构，界面更美观
- 新增斜线边框类型
- 插件依赖本地化（解决内网限制）
- 批注导入支持
- 富文本复制粘贴修复

## 常见问题

### 1. 提示"协同服务不可用"

检查后端服务是否正常，确保 `/api/getWorkerBook` 接口可访问。

### 2. 数据库问题

- 确保数据库配置正确
- 执行 `npm run db` 同步表结构
- 确保 `workerbooks` 和 `workersheets` 表有记录

### 3. data 与 celldata 关系

- `celldata`: `{r, c, v}` 格式的一维数组（存储格式）
- `data`: 二维数组（运行时格式）
- 初始化时从 celldata 转换为 data

## 参与贡献

欢迎提交 [Issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new) 或 PR！

加入交流群：

<p align="center">
  <img src='./public/result/qq-group.png' alt="QQ 群" width="300" />
</p>

## License

Apache 2.0 © Luckysheet CRDT Contributors
