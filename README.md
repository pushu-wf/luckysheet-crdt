<p align="center">
  <img src='/public/logo.svg' alt="Luckysheet CRDT Logo" />
</p>

<h1 align="center">Luckysheet CRDT</h1>

[简体中文](./README-zh.md) | English

`online`: [https://luckysheet-crdt.netlify.app/](https://luckysheet-crdt.netlify.app/)

---

<p align="center">
  <img src='/public/result/result.gif' alt='Demonstration of collaborative editing' />
</p>

---

## Project Branches

-   `master`: Stable version with optional database services and complete functionality
-   `master-alpha`: Development version with optional database services and complete functionality
-   `master-vue`: Stable version with user system, file system, **and database dependency**

## Repository

-   `Gitee`: [https://gitee.com/wfeng0/luckysheet-crdt](https://gitee.com/wfeng0/luckysheet-crdt)
-   `GitHub`: [https://github.com/pushu-wf/luckysheet-crdt](https://github.com/pushu-wf/luckysheet-crdt)

**⚠️ Tips**

The latest features are always updated first on `Gitee`, and are updated in the order of `Gitee [master alpha]`, `Gitee [master]`, and `Github [master]`.

## Overview

1. This project is based on [Luckysheet](https://github.com/mengshukeji/Luckysheet) source code. **Please follow the original author's open source agreement** and do not remove or modify the copyright notice in the source code header.
2. This project is open-sourced under the **Apache 2.0 license**. Feel free to use it. The project also contributes to the Luckysheet community, enriching its ecosystem. Thanks again to the @[Luckysheet](https://github.com/mengshukeji/Luckysheet) team ❤️
3. This is a **Luckysheet Collaborative Enhanced Edition (with full functionality)** designed to provide ideas for collaborative implementation, data storage services, and collaborative demonstrations. The project is based on [Luckysheet](https://github.com/mengshukeji/Luckysheet). Thanks to the original author for open-sourcing it.
4. The project supports **optional database services**. Without a database, user data cannot be persisted, but collaborative functionality is not affected. **⚠️Only valid for `master` and `master-alpha` branches. `master-vue` requires database functionality for user system implementation**.
5. The project uses **[Sequelize](https://www.sequelize.cn/)** as ORM data service technology, supporting databases such as MySQL, SQLite, PostgreSQL, and MSSQL for easy migration.
6. The project uses **TypeScript** as the main development language, providing complete type hints, standardized code, and improved development efficiency.
7. Personal capacity is limited, and there may be bugs or incomplete features. Please submit an [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new), and I will handle it promptly.
8. Everyone is welcome to fork the project and submit PRs to improve it together.

## Pricing Statement

In order to better drive the development of open source, starting from version `E12d2f4850127f53292a5161445fc500593176b9` on `April 15, 2025`, the project will no longer provide the Luckysheet source code modification section. If you need the source code for secondary development, please contact the author to pay for it.

Please note that the front-end and back-end functions of Luckysheet CRDT are completely open source and can be used normally without relying on source code. Source code is not required for project startup, operation, deployment, and other stages.

The source code is mainly used for functional expansion in secondary development scenarios:

-   If you only use existing collaborative editing features, **no need to obtain source code**
-   If you need secondary development to meet specific requirements, **please contact the author to pay for the source code**

**Service Details**

-   **Pricing**：**`199 yuan`**
-   **Service Content**：Only provide source code package (does not include continuous feature upgrades, bug fixes, and does not equate to product purchase)
-   **Contact Information**：QQ Group: `522121825`(Recommended)| Email: `<1982392655@qq.com>`(Recommended)

## Getting Started

1. Clone the project:

```bash
git clone https://gitee.com/wfeng0/luckysheet-crdt
```

2. Install dependencies:

```bash
# "dep-npm": "npm install --s && cd server && npm install --s",
# "dep-pnpm": "pnpm install --s && cd server && pnpm install --s"
npm run dep-npm | npm run dep-pnpm
# Recommended to use pnpm for dependency installation to avoid version conflicts
```

**⛔️ Tips**:

```js
1. Project dependencies are divided into frontend and backend dependencies (separate projects)
2. We recommend using `pnpm install` to install dependencies and avoid version conflicts
3. If dependency download fails, try deleting the `package-lock.json` file and re-installing dependencies
4. If the `npm run dep-npm` command fails, try executing `npm install --s` for frontend dependencies and `cd server && npm install --s` for backend dependencies

---

**If errors persist, confirm that your environment meets the requirements**:
`node -v ==> v20.x.x` // Node version must be greater than 18
`npm -v ==> 10.x.x` // NPM version must be greater than 7.x.x
```

3. 🚫<span style="color:red;font-weight:900">~~Skip this step if you don't have database services~~</span>🚫 Configure database parameters:

```ts
// server/src/Config/index.ts
export const SQL_CONFIG = {
    port: 3306,
    host: "127.0.0.1", // localhost or 127.0.0.1
    database: "luckysheet_crdt",
    user: "root",
    password: "root",
};
```

4. 🚫<span style="color:red;font-weight:900">~~Skip this step if you don't have database services~~</span>🚫 Synchronize database tables:

```bash
npm run db
```

**⛔️ Tips**:

```ts
1. Ensure database configuration is correct and available
2. Ensure the project executes the database sync command `npm run db`
3. This only needs to be executed once in the project lifecycle to ensure table structures exist in the database
```

5. Start services:
    - Frontend service: `npm run dev`
    - Backend service: `npm run server`
6. Open URL: `http://localhost:5000` | `http://localhost:9000` to experience collaborative functionality.

## Frequently Asked Questions

1. **Page shows `Collaboration service unavailable, currently in normal mode`**:

```ts
try {
  const { data } = await fetch({
      url: "/api/getWorkerBook",
      method: "post",
      data: { gridKey },
   });
}
catch (error) {}

If and only if the fetch request fails, it will enter the catch block,
at which point it will prompt `Collaboration service unavailable, currently in normal mode`;
Please check if the service is normal. Generally, there are the following possibilities:

1. Service exception: Please ensure the server is running and the `/api/getWorkerBook` interface is active, returning the necessary initialization data correctly
2. Database exception, please check the server-side log output to ensure the database service is functioning properly
3. The database table structure is abnormal. Please ensure the data table structure corresponding to the initialized gridkey is correct
```

2. **Database data error**:

```ts
The only possible reason for this is that the application does not have related delete statements,
It's not that I don't write them, but that everyone should expand based on their actual business needs.
The following steps can restore:
1. Delete all luckysheet_crdt data tables
2. Execute npm run db to synchronize database tables
3. Execute npm run server to start the service

The above operations will create database tables, synchronize the latest model structure,
and create gridkey-demo records in workerbooks and workersheets tables;
If and only if these two tables have records, luckysheet can be rendered;

Note! If there are no records in the two tables, it may also cause inability to collaborate (Question 2)
Note! If the workersheets table has records but deleteFlag is true, it will also cause inability to render luckysheet
```

3. **Custom chart type creation**
   Currently, VChart creates charts randomly as `pie charts` or `line charts`. If you want to implement custom chart type passing, you need to modify the chartmix related source code. Specific steps can be referenced as follows:

<p align="center">
  <img src='/public/result/changeChartType.png' alt="Change chart type" />
</p>

```ts
1. Download source: https://gitee.com/mengshukeji/chartMix
2. Modify src/utils/exportUtil.js createChart method, add chart type parameter
3. Repackage and place the file into the project
```

4. **On the Relationship Between data and celldata**

```js
1. The data is initialized by converting from celldata. Subsequent updates to the table data will be reflected in this data field. No initialization settings are required
2. TransTocellData: data=>celldata, convert two-dimensional array data to {r, c, v} format one-dimensional array
3. TransToData: celldata=>data, celldata converts one-dimensional array data into two-dimensional array data
```

## Deployment

### Method 1: Docker Deployment (Recommended)🐳

**Deploy with one click using Docker Compose, no manual environment or database configuration required!**

#### 1. Prerequisites

-   Docker 20.10 has been installed+
-   Docker Compose 2.0 has been installed+

#### 2. Quick Start

**manual deployment:**

```bash
# 1. Copy environment variable configuration file
cp env.example .env

# 2. Modify the configuration in the. env file as needed (optional)
# vim .env

# 3. Start all services
docker-compose up -d

# 4. View service status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

#### 3. Accessing applications

-   **Application**: http://localhost:9000
-   **Database**: localhost:3306

---

### Method 2: Traditional Deployment

**Note: All the following commands are executed in the project root directory `/LUCKYSHEET-CRDT/`**

1. **Important!** Modify the deployment configuration file: `src/config/index.ts`:

```ts
// Change backend address to server IP address
export const SERVER_URL = "http://localhost:9000";

// Change collaborative address to server IP address
export const WS_SERVER_URL = "ws://127.0.0.1:9000";
```

2. Build the frontend project first: `npm run build`

    - Note that packaged files are output to `server/public/dist` by default

3. Package server code: `npm run build:server`

    - At this point, the entire project's packaging result will be output directly to the `server/wwwroot` directory, which can be deployed directly to the server

4. Upload the files in the `server/wwwroot` directory to the server
 <p align="center">
   <img src='/public/result/build.png' alt="Build output directory" />
 </p>

5. Install `node` environment on the server. You can search for related tutorials online

    - Example provided: [centos reference this link](https://blog.csdn.net/weixin_61367575/article/details/138012405)

6. Synchronize database tables: `npm run db`

    - Ensure database configuration is correct and available (~~Skip this step if you don't have database services~~)

7. Start service: `npm run start`: **This command is only valid in the packaged wwwroot folder**
    - Wait for dependency download to complete, then start service with `npm run start`. After deployment, access `http://${ip}:9000`

## Service Ports

1. Frontend service port: `5000`
2. Backend service port: `9000`
3. Database service port: `3306`

```js
// 1️⃣ Backend service port configuration: server/src/Config/index.ts
export const SERVER_PORT = 9000;
```

```js
// 2️⃣ Database service port configuration: server/src/Config/index.ts
export const SQL_CONFIG = {
    port: 3306,
    // ... other config
};
```

```js
// 3️⃣ Frontend service port configuration: src/config/index.ts
// Export backend service address
export const SERVER_URL = "http://localhost:9000";

// Export collaborative service address
export const WS_SERVER_URL = "ws://127.0.0.1:9000";
```

## Source Project Optimizations

### 1️⃣ UI Refactoring

<p align="center">
  <img src='/public/result/ui.gif' alt="UI Refactoring" />
</p>

### 2️⃣ Chart Collaboration

<span style="font-weight:900">Left is `vchart` rendering, right is `chartmix` rendering</span>

<p align="center">
  <img src='/public/result/chartmix-vchart.png' alt="VChart vs ChartMix" />
</p>

<span style="font-weight:900">VChart animations are smoother and the page is more concise and beautiful</span>

<p align="center">
  <img src='/public/result/vchart.gif' alt="VChart animation" />
</p>

<span style="font-weight:900">VChart settings</span>

<p align="center">
  <img src='/public/result/vchart-setting.gif' alt="VChart settings" />
</p>

<span style="font-weight:900">ChartMix data linkage</span>

<p align="center">
  <img src='/public/result/chartmix-update-data-crdt.gif' alt="ChartMix data linkage" />
</p>

<span style="font-weight:900">VChart data linkage</span>

<p align="center">
  <img src='/public/result/vchart-update-data-crdt.gif' alt="VChart data linkage" />
</p>

### 3️⃣ Add left diagonal line | right diagonal line border type

<p align="center">
  <img src='./public/result/slash-demo.png' alt="Slash border type" />
</p>

### 4️⃣ Plugin Dependency Optimization

1. **Original plugin registration scheme**:

```js
plugins: [{ name: "chart" }, { name: "print" }];
```

<p align="center">
  <img src='/public/result/expendPlugins-source.png' alt="Original plugin registration" />
</p>

**This can cause issues where plugin dependencies cannot be downloaded properly due to network problems, intranet restrictions, and other factors.**

2. **Optimized solution**:

```js
plugins: [
  {
    name: "chart",
    dependScripts: [
      "/lib/expendPlugins/libs/vue@2.6.11.min.js",
      "/lib/expendPlugins/libs/vuex.min.js",
      "/lib/expendPlugins/libs/elementui.min.js",
      "/lib/expendPlugins/libs/echarts.min.js",
      "/lib/expendPlugins/libs/chartmix.umd.min.js",
    ],
    dependLinks: ["/lib/expendPlugins/libs/element-ui.css", "/lib/expendPlugins/libs/chartmix.css"],
  },
  {
    name: "vchart",
    dependScripts: ["/lib/expendPlugins/libs/vchart.min.js"],
    dependLinks: ["/lib/expendPlugins/libs/vchart.css"],
  },
  {
    name: "fileImport",
    dependScripts: ["/lib/expendPlugins/libs/luckyexcel.umd.js"],
  },
  {
    name: "fileExport",
    dependScripts: ["/lib/expendPlugins/libs/exceljs.min.js", "/lib/expendPlugins/libs/fileSaver.min.js"],
  },
],
```

<p align="center">
  <img src='/public/result/expendPlugins-new.png' alt="Optimized plugin registration" />
</p>

**Related plugin dependencies and loading schemes are encapsulated, and online schemes are also compatible**:

```ts
// Online solution
plugins: [
  {
    name: "chart",
    dependScripts: [
      "https://unpkg.com/vue@2.6.11/dist/vue.min.js",
      // ...
    ],
  },
```

```ts
// The request principle in the source code is as follows:
// If it is an HTTP online address, request directly
if (url.indexOf("http") == 0) {
    link.setAttribute("href", url);
} else link.setAttribute("href", window.location.origin + "/" + url);

// If it is an HTTP online address, request directly
if (scripts[i].indexOf("http") === 0) {
    s[i].setAttribute("src", scripts[i]);
} else s[i].setAttribute("src", window.location.origin + "/" + scripts[i]);
```

### 5️⃣ File Import | File Export

**File Import**
<span style="font-weight:900">Supports collaboration~</span>

<p align="center">
  <img src='/public/result/file-import.gif' alt="File import" />
</p>
<span style="font-weight:900">Configuration method:</span>

```js
// 1. Configure import plugin
const options = {
    // ...other config
    plugins: [{ name: "fileImport" }],
};

luckysheet.create(options);
```

<span style="font-weight:900">Notes:</span>

1. File import depends on the `luckyexcel` plugin
2. Therefore, some functions are limited by plugins. If you need to expand them, please implement them yourself!
3. Please correctly configure `plugins: [{ name: "fileImport" }]` before using the import function

---

**File Export**

<p align="center">
  <img src='/public/result/file-export.gif' alt="File export" />
</p>
<span style="font-weight:900">Configuration method:</span>

```js
// 1. Configure export plugin
const options = {
    // ...other config
    plugins: [{ name: "fileExport" }],
};

luckysheet.create(options);
```

<span style="font-weight:900">Notes:</span>

1. File export depends on the `exceljs | file-saver` plugins
2. Therefore, some functions are limited by plugins. If you need to expand them, please implement them yourself!
3. Please correctly configure `plugins: [{ name: "fileExport" }]` before using the export function

### 6️⃣ Custom Menu

<span style="font-weight:900">Configuration method:</span>

<p align="center">
  <img src='/public/result/menu.png' alt="Custom menu" />
</p>

```ts
const options = {
   lang: "zh",
   title: "Luckysheet",
   // ...other config

   // Pass menuHandler configuration item
   menuHandler:{
       hideDefaultMenu: string[], // Currently default menu items are importFile | exportFile
       customs: MenuHandlerCustomsItem[]
   }
}

type MenuHandlerCustomsItem = {
  label: string
  value: string
  callback: () => void
  order?: string // Menu sorting, smaller numbers are on top. Default menu order = 10. To place above default menu, use a number less than 10. If not provided, item will be placed below
  icon?: string
} |
// Divider configuration object
{
  value: 'divider'
}
```

**Example**

```ts
menuHandler: {
    customs: [
        {
            label: "Save",
            value: "saveFile",
            order: 1,
        },
        { value: "divider", order: 2 },
    ];
}
```

**How to handle icon icons in custom menus**

1. Download iconfont resources and place them in the `source/src/assets` directory (download and extract locally)
2. Import the downloaded resource package in the same level directory `iconfont/iconfont.css`

```css
@import url("../font_3944349_xxxxx/iconfont.css");
```

3. Package and output to use iconfont icons normally

---

**Show Logo**

<p align="center">
  <img src='/public/result/showlogo.png' alt="Show logo" />
</p>

**Hide Logo**

<p align="center">
  <img src='/public/result/hidelogo.png' alt="Hide logo" />
</p>

**Configuration method**:

```js
const options = {
    showlogo: false,
    /// ...other config
};
```

### 7️⃣ Custom Request Headers

Many people have reported that cookies, tokens, and other information should be added when requesting table data interfaces to implement user identity permission verification. This has been implemented with the following configuration:

```ts
const options = {
    // ... other config,
    // Add request headers
    requestHeaders: {
        authorization: localForage.getItem("token"),
        "x-requested-with": "XMLHttpRequest",
        "custom-name": "custom-value",
        // ... other headers
    },
};
```

**Specific implementation: `源码/src/core.js`**

```ts
// Modify the $post method to $ajax() to implement adding request headers functionality
$.ajax({
    url: server.loadUrl,
    type: "POST",
    data: { gridKey: server.gridKey },
    beforeSend(xhr) {
        if (!extendsetting.requestHeaders) return;
        for (let key in extendsetting.requestHeaders) {
            xhr.setRequestHeader(key, extendsetting.requestHeaders[key]);
        }
    },
    timeout: 15000,
    success: function (d) {},
    error: function (error) {},
});
```

### 8️⃣ Printing

**Add luckysheet print api**

```js
// "sheet": print current sheet  "areas": Print the specified selection  "pages": Print specified pages
// type : "sheet" | "areas" | "pages"
luckysheet.print(type, neetToPreview); // If no preview is required, the second parameter is false
```

**Printing blur optimization**

```js
const options = {
    /// ... other config,
    printDevicePixelRatio: 4, // The larger the value, the clearer the printing, but the longer the drawing time. Please balance the performance
};
```

**Print Grid Line**

<p align="center">
  <img src='./public/result/print-grid-line.gif' alt="print grid line" />
</p>

**Print Preview**

<p align="center">
  <img src='/public/result/print-preview.gif' alt="Print preview" />
</p>

**Print Current Sheet**

<p align="center">
  <img src='/public/result/printCurrentSheet.gif' alt="Print current sheet" />
</p>

**Print Current Range**

<p align="center">
  <img src='/public/result/printCurrentRange.gif' alt="Print current range" />
</p>

**Print Specific Page**

<p align="center">
  <img src='/public/result/printPage.gif' alt="Print specific page" />
</p>

**Print Image**

<p align="center">
  <img src='/public/result/printImage.gif' alt="Print image" />
</p>

**Print Chart**

<p align="center">
  <img src='/public/result/printChart.gif' alt="Print chart" />
</p>

### 9️⃣ Cell Images `beta`

**Added cell image display functionality**

1. Support for inserting floating images
2. Support for inserting cell images
3. Support for converting between floating images and cell images
4. Support for configuring default image display mode `config.imageMode = 'float' | 'cell'`
5. Support for cell image preview
6. Support for adaptive merging of cell images

<p align="center">
  <img src='/public/result/cellImage.gif' alt="Cell images" />
</p>

### 🔟 Customize Shortcuts

**Configuration method**：

```js
const options = {
	/// ... other config,
	// Customize Shortcuts
	customShortcutKeys: [
		{
			key: number,
			ctrl?: boolean,
			shift?: boolean,
			alt?: boolean,
			callback: (e) => {},
		},
	],
};
```

### Other Source Code Optimizations

1. [#Fix Fixed abnormal display of multi-person collaboration prompt box](https://gitee.com/wfeng0/luckysheet-crdt/commit/af3c5837f8bec8a8cf4d261cbc8c9416d19902e1)
2. [#Fix Fixed the issue where the cursor cannot collaborate after refreshing with the same user ID](https://gitee.com/wfeng0/luckysheet-crdt/commit/5212b82c90595ff324c86db56e5ec25b88912d38)
3. [#Fix Fix collaborative message transmission related to formula chain](https://gitee.com/wfeng0/luckysheet-crdt/commit/c121bcd389b4f8ecef00e3570cda9aea27e7333d)
4. [#Feat Implementing annotation import and improving source code recognition of annotations](https://gitee.com/wfeng0/luckysheet-crdt/commit/72e52419ce0168c352b0ed78e182832426b7bdda)
5. [#Feat Optimize the data linkage between chartmix/vchart and implement server data update and storage records](https://gitee.com/wfeng0/luckysheet-crdt/commit/3f89fff92722ab1631c6c5976b307eb37f83f1d1)
6. [#Fix Emergency repair: When initializing the sheet and returning data celldata f='', the formula judgment is abnormal, causing double clicking to clear the data](https://gitee.com/wfeng0/luckysheet-crdt/commit/09147f0c76cbd0c94b2e358d8045282f7dba165d)
7. [#Fix Fix the BUG of not updating collaboration after deleting columns](https://gitee.com/wfeng0/luckysheet-crdt/commit/232103c62df81e7cec3abd2b19e986d1ffad73d5)
8. [#Fix Fix inlineStr rich text data copy and paste exception BUG](https://gitee.com/wfeng0/luckysheet-crdt/commit/33274ef5e1a7462b4c4670bbd700d1f1dcba53fa)

## Master-Vue Out-of-the-Box Version

This project is a branch of `luckysheet-crdt`, attached to `luckysheet-crdt`, and serves only as a Vue version example. It provides a complete user system (login, registration, information modification) and file system (create, modify, delete, collaborate, share...). Project screenshots are as follows:

<p align="center">
  <img src='/public/result/master-vue-login.png' alt="Master-Vue login" />
  <img src='/public/result/master-vue-home.png' alt="Master-Vue home" />
  <img src='/public/result/master-vue-invite.png' alt="Master-Vue invite" />
  <img src='/public/result/master-vue-userinfo.png' alt="Master-Vue user info" />
  <img src='/public/result/master-vue-btns.png' alt="Master-Vue buttons" />
</p>

## Open Source Contribution

1. Submit an [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new)
2. Fork this project and submit a PR
3. Join the communication group:
 <p align="center">
   <img src='/public/result/qq-group.png' alt="QQ Group" />
 </p>
