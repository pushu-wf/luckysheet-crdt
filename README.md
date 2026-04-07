<p align="center">
  <img src='./public/logo.svg' alt="Luckysheet CRDT Logo" />
</p>

<h1 align="center">Luckysheet CRDT</h1>

[简体中文](./README-zh.md) | English

`Live Demo`: [https://luckysheet-crdt.netlify.app/](https://luckysheet-crdt.netlify.app/)

---

<p align="center">
  <img src='./public/result/result.gif' alt='Collaborative Editing Demo' />
</p>

## Project Overview

Luckysheet CRDT is an enhanced collaborative version based on [Luckysheet](https://github.com/mengshukeji/Luckysheet), providing real-time multi-user collaborative editing functionality.

- **Secondary development based on the original project to extend related features and fix existing bugs**

**Core Features:**

- ✅ Real-time multi-user collaborative editing
- ✅ Optional database persistence
- ✅ Chart collaboration (VChart/ChartMix)
- ✅ Excel import and export
- ✅ Enhanced features: cell images, print optimization, custom menus, etc.

**Tech Stack:** TypeScript + Node.js + Sequelize + WebSocket

## Quick Start

### Method 1: Docker Deployment (Recommended)

```bash
# 1. Clone the project
git clone https://gitee.com/wfeng0/luckysheet-crdt
cd luckysheet-crdt

# 2. Copy environment variables
cp env.example .env

# 3. Start services
docker-compose up -d
```

### Method 2: Local Development

```bash
# 1. Clone the project
git clone https://gitee.com/wfeng0/luckysheet-crdt
cd luckysheet-crdt

# 2. Install dependencies (pnpm recommended)
pnpm install && cd server && pnpm install

# 3. (Optional) Configure database
# Edit server/src/Config/index.ts

# 4. (Optional) Synchronize database tables
npm run db

# 5. Start services
# Terminal 1: Frontend
npm run dev
# Terminal 2: Backend
npm run server
```

Visit http://localhost:9000

## Project Branches

- `master`: Stable version with optional database service
- `master-alpha`: Development version with optional database service
- `master-vue`: Full version with user system and file system (requires database)

## Repository

- Gitee: https://gitee.com/wfeng0/luckysheet-crdt
- GitHub: https://github.com/pushu-wf/luckysheet-crdt

> ⚠️ **Note**: Latest features are prioritized for updates on Gitee

## Important Notes

### Open Source License

- Modified based on Luckysheet, follows Apache 2.0 license
- **Please do not remove the copyright notice in the source code header**

### Source Code Access

Starting from version 2025-04-15, **the modified parts of Luckysheet source code are no longer publicly available**.

- ✅ Existing collaborative features are fully functional without source code
- 💰 For secondary development, you can purchase the source code (199 yuan)
- 📧 Contact: QQ Group 522121825 | Email: 1982392655@qq.com

### Database Information

- `master`/`master-alpha`: Database is optional; collaborative features work normally without database but data is not persisted
- `master-vue`: Database configuration is required

## Main Features

### 1. Collaborative Editing

- Real-time multi-user editing synchronization
- Cursor position synchronization
- Supports undo/redo collaboration

### 2. Chart Support

- VChart charts (smooth animations, beautiful UI)
- ChartMix charts (data linkage)
- Chart creation and editing collaboration

### 3. File Operations

- Excel import (based on luckyexcel)
- Excel export (based on exceljs)
- Supports collaborative import and export

```js
plugins: [
    { name: "fileImport" }, // Import plugin
    { name: "fileExport" }, // Export plugin
];
```

### 4. Print Optimization

- Supports printing current sheet/selection/specified pages
- High-definition print optimization
- Supports disabling gridlines

```js
luckysheet.print({mode:'', needToPreview = true, range = "",}); // mode: "sheet" | "areas" | "pages"

// Configure print clarity
printDevicePixelRatio: 4; // Larger values result in clearer prints
```

### 5. Cell Images

- Floating images / Cell images
- Mutual conversion between two modes
- Adaptive image merging

### 6. Custom Extensions

- **Custom Menus**: Add custom menu items
- **Custom Shortcuts**: Configure shortcut key callbacks
- **Custom Request Headers**: Add Token authentication, etc.
- **Custom Functions**: Add custom functions

```js
// Custom menu
menuHandler: {
    customs: [
        { label: "Save", value: "saveFile", order: 1 },
        { value: "divider" }, // Divider
    ];
}

// Custom request headers
requestHeaders: {
    authorization: "Bearer token";
}

// Custom functions
customFunction: [
    {
        name: "ROUNDBANK",
        implementation: function () {},
        description: {},
    },
];
```

### 7. Other Optimizations

- UI refactoring for a more attractive interface
- Added diagonal border types
- Plugin dependency localization (solves intranet restrictions)
- Annotation import support
- Rich text copy-paste fixes

## FAQ

### 1. "Collaboration service unavailable" message

Check if the backend service is running normally and ensure the `/api/getWorkerBook` endpoint is accessible.

### 2. Database Issues

- Ensure database configuration is correct
- Execute `npm run db` to synchronize table structure
- Ensure `workerbooks` and `workersheets` tables have records

### 3. Relationship between data and celldata

- `celldata`: One-dimensional array in `{r, c, v}` format (storage format)
- `data`: Two-dimensional array (runtime format)
- Converts from celldata during initialization

## Contributing

Welcome to submit [Issues](https://gitee.com/wfeng0/luckysheet-crdt/issues/new) or PRs!

Join the communication group:

<p align="center">
  <img src='./public/result/qq-group.png' alt="QQ Group" width="300" />
</p>

## License

Apache 2.0 © Luckysheet CRDT Contributors