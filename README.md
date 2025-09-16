<p align="center">
  <img src='/public/logo.svg' />
</p>

<h1 align="center">Luckysheet CRDT</h1>

[简体中文](./README-zh.md) | English

<p align="center">
  <img src='/public/result/result.gif' alt='result' />
</p>

---

**Project branches:**

-   `Master`: Stable version, providing optional database services and complete functionality implementation;
-   `Master alpha`: Development version, providing optional database services and complete functionality implementation;
-   `Master Vue`: Stable version, providing user system, file system, complete functional implementation, relying on database services;

**Warehouse address:**

-   `Gitee`: [https://gitee.com/wfeng0/luckysheet-crdt](https://gitee.com/wfeng0/luckysheet-crdt)
-   `GitHub`: [https://github.com/pushu-wf/luckysheet-crdt](https://github.com/pushu-wf/luckysheet-crdt)

## Master-Vue Ready to use version out of the box

This project, as a branch of 'luckysheet crdt', is attached to 'luckysheet crdt' and serves only as an example for the Vue version. It provides a complete user system (login, registration, information modification) and file system (create, modify, delete, collaborate, share...). The project screenshot is as follows:

<p align="center">
  <img src='/public/result/master-vue-login.png' />
  <img src='/public/result/master-vue-home.png' />
  <img src='/public/result/master-vue-invite.png' />
  <img src='/public/result/master-vue-userinfo.png' />
  <img src='/public/result/master-vue-btns.png' />
</p>

## DESCRIPTION

1. This project is based on the [Luckysheet source code](https://github.com/mengshukeji/Luckysheet) modification. Please follow the original author's open source agreement, and do not delete or modify the source code header copyright statement。
2. This project is open sourced under the **Apache 2.0 protocol**, so please feel free to use it. At the same time, this project will also contribute to the Luksysheet community, enriching the community ecosystem. Thank you again to the @[Luckysheet](https://github.com/mengshukeji/Luckysheet) team ❤️
3. The project is **Luckysheet Collaborative Enhanced Edition (fully functional implementation)**, aiming to provide collaborative implementation ideas, data storage services, collaborative demonstrations, etc. The project is based on [Luckysheet](https://github.com/mengshukeji/Luckysheet) Implemented, thank you to the original author for open-source.
4. The project supports **optional database services**. User data without a database cannot be persistently stored, and collaborative functionality is not affected，**⚠️Only valid for `master and master-alpha` branches, `master-vue` relies on database functionality to implement user systems**.
5. Project Use **[Sequelize](https://www.sequelize.cn/)** As an ORM data service technology, it supports databases such as MySQL, SQLite, PostgreSQL, and MSSQL, making it easy for users to quickly migrate.
6. The project uses **Typescript** as the main development language, providing complete type prompts, standardizing code, and improving development efficiency.
7. My personal energy is limited, and there are bugs and incomplete functions. Please submit an [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new) and I will handle it promptly;
8. Welcome everyone to fork the project, submit PR, and work together to improve the project.

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

## START

1. Clone project：

```bash
git clone https://gitee.com/wfeng0/luckysheet-crdt
```

2. Download dependencies:

```bash
# "dep-npm": "npm install --s && cd server && npm install --s",
# "dep-pnpm": "pnpm install --s && cd server && pnpm install --s"
npm run dep-npm | npm run dep-pnpm
# Recommend using pnpm for dependency installation to avoid version conflicts
```

**⛔️ Tips：**

```js
1. Project dependencies are divided into front-end dependencies and back-end dependencies (independent projects)；
2. We recommend using `npm install` to install dependencies and avoid version conflicts；
3. If the dependency download error occurs, you can try deleting the `package lock. json` file and re executing the dependency installation;
4. If executing the command 'npm run dep' reports an error，Please try executing the 'npm install -- s' command for front-end dependency installation，Execute the 'cd server && npm install -- s' command for background dependency installation。

**If the error persists, please confirm if the environment meets the operating conditions：**
`node -v ==> v20.x.x` // 请确保 node 版本大于 18
`npm -v ==> 10.x.x` // 请确保 npm 版本大于 7.x.x
```

3. 🚫<span style="color:red;font-weight:900">~~If there is no database service, please skip this step~~</span>🚫 Configure database parameters：

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

4. 🚫<span style="color:red;font-weight:900">~~If there is no database service, please skip this step~~</span>🚫 Synchronize database tables：

```bash
npm run db
```

**⛔️ Tips：**

```ts
1.  Please ensure that the database configuration is correct and available
2.  Please ensure that the project executes synchronized database commands `npm run db`
3.  The project cycle only needs to be executed once to ensure the existence of table structures in the database。
```

1. Start Service:
    - Front-desk service：`npm run dev`
    - Back-up services：`npm run server`
2. Open the URL：`http://localhost:5000` | `http://localhost:9000`, You can experience the collaborative function.

## Project Deployment

**Kind reminder: All the following commands are executed in the project root directory/LUCKYSHEET-CRDT/**

1.  Pack the front-end project first: `npm run build`

    -   Please note that when packaging file files, the default output is to `server/public/dist`

2.  Package server code: `npm run build:server`

    -   At this point, the packaging result of the entire project will be directly output to the `server/wwwroot` directory, which can be deployed directly to the server。

3.  Please upload the files from the 'server/wwwroot' directory to the server
<p align="center">
  <img src='/public/result/build.png' />
</p>

4.  Install the 'node' environment on the server. You can search for related tutorials online by yourself

    -   This example provides:[centos 参考此链接](https://blog.csdn.net/weixin_61367575/article/details/138012405)

5.  Synchronize database tables:`npm run db`

    -   Please ensure that the database configuration is correct and available(~~If there is no database service, please skip this step~~)

6.  Start service:`npm run start`: **This command is only valid in the wwwroot folder after packaging**
    -   Wait for dependency download to complete, start service `npm run start`, Access after deployment completion to just access `http://${ip}:9000`

## Service Port Description

1. Front desk service port：`5000`
2. Back up service port：`9000`
3. Database service port：`3306`

```js
// 1️⃣ Backend service port configuration：server/src/Config/index.ts
export const SERVER_PORT = 9000;
```

```js
// 2️⃣ Database service port configuration：server/src/Config/index.ts
export const SQL_CONFIG = {
	port: 3306,
	// ... other config
};
```

```js
// 3️⃣ Front desk service port configuration：src/config/index.ts
// Export backend service address
export const SERVER_URL = "http://localhost:9000";

// Export collaborative service address
export const WS_SERVER_URL = "ws://127.0.0.1:9000";
```

## Source project optimization

### 1️⃣ Page UI Refactoring

1. Source code UI refactoring, please refer to [Luckysheet-source-recover-style](/Luckysheet-source/src/css/recover.css)

<p align="center">
  <img src='/public/result/ui.gif' />
</p>

### 2️⃣ Chart Collaboration

1. Implemented vchart, please refer to [Luckysheet-source-vchart](/Luckysheet-source/src/expendPlugins/vchart/plugin.js)

<span style="font-weight:900">On the left is' vchart 'rendering, and on the right is' chartmix' rendering</span>

<p align="center">
  <img src='/public/result/chartmix-vchart.png' />
</p>

<span style="font-weight:900">The vchart chart animation is smoother, and the page is concise and beautiful</span>

<p align="center">
  <img src='/public/result/vchart.gif' />
</p>

<span style="font-weight:900">vchart setting</span>

<p align="center">
  <img src='/public/result/vchart-setting.gif' />
</p>

2. Expand the implementation of chart data update linkage:

<span style="font-weight:900">chartmix </span>

<p align="center">
  <img src='/public/result/chartmix-update-data-crdt.gif' />
</p>

<span style="font-weight:900">vchart </span>

<p align="center">
  <img src='/public/result/vchart-update-data-crdt.gif' />
</p>

### 3️⃣ Optimization of image mobility performance

<span style="font-weight:900">Original effect:</span>

<p align="center">
  <img src='/public/result/picture-old.gif' />
</p>

<span style="font-weight:900">After optimization:</span>

<p align="center">
  <img src='/public/result/picture-new.gif' />
</p>

### 4️⃣ Plugin dependency optimization

1. **Plugin registration scheme in source code**:

```js
plugins: [{ name: "chart" }, { name: "print" }];
```

<p align="center">
  <img src='/public/result/expendPlugins-source.png' />
</p>

**This can lead to a problem where online links cannot be downloaded properly due to network issues, internal network restrictions, and other factors.**

2. **optimization plan**:

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
  <img src='/public/result/expendPlugins-new.png' />
</p>

**The related plugin dependencies and loading schemes have been encapsulated, and are also compatible with online schemes:**

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

### 5️⃣ File Import

<span style="font-weight:900">Support collaboration~</span>

<p align="center">
  <img src='/public/result/file-import.gif' />
</p>
<span style="font-weight:900">Configuration method:</span>

```js
// 1. Configure import plugin
const options = {
	// ...other config
	plugins: ["fileImport"],
};

luckysheet.create(options);
```

<span style="font-weight:900">matters needing attention:</span>

1. File import depends on the `luckyuexcel` plugin；
2. Therefore, some functions are limited by plugins. If you need to expand them, please implement them yourself!
3. Please configure plugins correctly Use the import function after `fileImport`.

### 6️⃣ File Export

<p align="center">
  <img src='/public/result/file-export.gif' />
</p>
<span style="font-weight:900">Configuration method：</span>

```js
// 1. Configure export plugin
const options = {
	// ...other config
	plugins: ["fileExport"],
};

luckysheet.create(options);
```

<span style="font-weight:900">matters needing attention:</span>

1. File import depends on the `exceljs | file-saver` plugin；
2. Therefore, some functions are limited by plugins. If you need to expand them, please implement them yourself!
3. Please configure plugins correctly Use the import function after `fileExport`.

### 7️⃣ Customize Menu

<span style="font-weight:900">Configuration:</span>

<p align="center">
  <img src='/public/result/menu.png' />
</p>

```ts
const options = {
   lang: "zh",
   title: "Luckysheet",
   // ...other config

   //  menuHandler config
   menuHandler:{
       hideDefaultMenu: string[], // importFile | exportFile
       customs: MenuHandlerCustomsItem[]
   }
}

type MenuHandlerCustomsItem = {
  label: string
  value: string
  callback: () => void
  order?: string // Menu sorting, the smaller one is on top, the default menu order=10 is on top of the default menu, it needs to be smaller than 10, and it will not be transferred. It will be placed below by default
  icon?: string
} |
// Partition line configuration object
{
  value: 'divider'
}
```

**example**

```ts
menuHandler: {
	customs: [
		{
			label: "保存",
			value: "saveFile",
			order: 1,
		},
		{ value: "divider", order: 2 },
	];
}
```

**Method for handling icon icons in custom menus**

1. Download iconfont resources and place them in the `source/src/assets` directory (download locally and unzip)
2. Import the currently downloaded resource package into the same level directory `iconfont/iconfont.css`

```css
@import url("../font_3944349_xxxxx/iconfont.css");
```

3. Package and output to use iconfont icon normally

### 8️⃣ Custom request header

Many people have reported that cookies, tokens, and other information should be added when requesting table data interfaces to verify user identity and permissions. This has been implemented and the specific configuration is as follows：

```ts
const options = {
	// ... other config,
	// 添加请求头
	requestHeaders: {
		authorization: localForage.getItem("token"),
		"x-requested-with": "XMLHttpRequest",
		"custom-name": "custom-value",
		// ... other headers
	},
};
```

**Specific implementation plan:`源码/src/core.js`**

```ts
// Modify the $post method to $ajax () to implement the function of adding request headers
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

### 9️⃣ Print

**print perview**

<p align="center">
  <img src='/public/result/print-preview.gif' />
</p>

**print current sheet**

<p align="center">
  <img src='/public/result/printCurrentSheet.gif' />
</p>

**print current range**

<p align="center">
  <img src='/public/result/printCurrentRange.gif' />
</p>

**print page**

<p align="center">
  <img src='/public/result/printPage.gif' />
</p>

**print image**

<p align="center">
  <img src='/public/result/printImage.gif' />
</p>

**print chart**

<p align="center">
  <img src='/public/result/printChart.gif' />
</p>

### 🔟 Other source code optimizations

1. [#Fix Fixed abnormal display of multi person collaboration prompt box](https://gitee.com/wfeng0/luckysheet-crdt/commit/af3c5837f8bec8a8cf4d261cbc8c9416d19902e1)
2. [#Fix Fixed the issue where the cursor cannot collaborate after refreshing with the same user ID](https://gitee.com/wfeng0/luckysheet-crdt/commit/5212b82c90595ff324c86db56e5ec25b88912d38)
3. [#Fix Fix collaborative message transmission related to formula chain](https://gitee.com/wfeng0/luckysheet-crdt/commit/c121bcd389b4f8ecef00e3570cda9aea27e7333d)
4. [#Feat Implementing annotation import and improving source code recognition of annotations](https://gitee.com/wfeng0/luckysheet-crdt/commit/72e52419ce0168c352b0ed78e182832426b7bdda)
5. [#Feat Optimize the data linkage between chartmix/vchart and implement server data update and storage records](https://gitee.com/wfeng0/luckysheet-crdt/commit/3f89fff92722ab1631c6c5976b307eb37f83f1d1)
6. [#Fix Emergency repair: When initializing the sheet and returning data celldata f='', the formula judgment is abnormal, causing double clicking to clear the data](https://gitee.com/wfeng0/luckysheet-crdt/commit/09147f0c76cbd0c94b2e358d8045282f7dba165d)
7. [#Fix Fix the BUG of not updating collaboration after deleting columns](https://gitee.com/wfeng0/luckysheet-crdt/commit/232103c62df81e7cec3abd2b19e986d1ffad73d5)

## frequently asked questions

1. **When importing files, prompt `file format error`：**

```ts
At present, only xlsx format is supported.
Please check if the file format is correct.
```

2. **The page displays `Collaboration service unavailable, currently in normal mode`：**

```ts
try {
  const { data } = await fetch({
      url: "/api/getWorkerBook",
      method: "post",
      data: { gridKey },
   });
}
catch (error) {}

If and only if! When a fetch request fails, it will enter the catch block,
At this time, it will prompt 'Collaboration service unavailable, currently in normal mode';
Please check if the service is functioning properly. There are generally the following possibilities:
1. Service exception
2. Database exception
3. Abnormal database table structure
```

3. **Chaotic database data:**

```ts
The only possible reason for this is that the application does not have a relevant delete statement,
It's not that I don't write, but rather that everyone expands based on their actual business needs.
The following steps can restore:
1. Delete all data tables of luckyshev_crdt;
2. Execute npm run db to synchronize database tables;
3. Execute npm run server to start the service;
The appeal operation will create a database table by oneself and synchronize the latest model structure,
And create a gridkey demo worker books and worker sheets record;
If and only if there are recorded scenes in these two tables, the luckySheet can be rendered;
be careful! If there is no record in two tables, it may also cause the inability to collaborate (problem 2)
be careful! If there are records in the workersheets table, but deleteFlag is true, it will also result in the inability to render luckysheets;
```

4. **Customize the creation of chart types**
   At present, creating charts in vchart is a random 'pie chart' | 'line chart'. If you want to implement custom chart type transfer, you need to modify the chartmix related source code. The specific steps can be referred to as follows：

<p align="center">
  <img src='/public/result/changeChartType.png' />
</p>

```ts
1. Download Source：https://gitee.com/mengshukeji/chartMix
2. Modify the src/tiles/exportUtil.js create Chart method and add a chart type parameter;
3. Repackage and place the file into the project
```

## Open source contribution

1. Submit an [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new)
2. Fork this project and submit a PR
3. Join the communication group:
 <p align="center">
   <img src='/public/result/qq-group.png' />
 </p>
