<p align="center">
  <img src='/public/logo.svg' />
</p>

<h1 align="center">Luckysheet CRDT</h1>

[简体中文](./README-zh.md) | English

---

<p align="center">
  <img src='/public/result/result.gif' alt='result' />
</p>

## DESCRIPTION

1. This project is based on the [Luckysheet source code](https://github.com/mengshukeji/Luckysheet) modification. Please follow the original author's open source agreement, and do not delete or modify the source code header copyright statement。
2. This project is open sourced under the **Apache 2.0 protocol**, so please feel free to use it. At the same time, this project will also contribute to the Luksysheet community, enriching the community ecosystem. Thank you again to the @[Luckysheet](https://github.com/mengshukeji/Luckysheet) team ❤️
3. The project is **Luckysheet Collaborative Enhanced Edition (fully functional implementation)**, aiming to provide collaborative implementation ideas, data storage services, collaborative demonstrations, etc. The project is based on [Luckysheet](https://github.com/mengshukeji/Luckysheet) Implemented, thank you to the original author for open-source.
4. This project mainly implements the collaborative function module, which has no impact on other content. The parts modified based on the source code are all reflected in the `Luckysheet source` folder.
5. The project supports **optional database services**. User data without a database cannot be persistently stored, and collaborative functionality is not affected.
6. Project Use **[Sequelize](https://www.sequelize.cn/)** As an ORM data service technology, it supports databases such as MySQL, SQLite, PostgreSQL, and MSSQL, making it easy for users to quickly migrate.
7. The project uses **Typescript** as the main development language, providing complete type prompts, standardizing code, and improving development efficiency.
8. **The project has a `master` branch and a `master-alpha` branch. The latest released features will be tested on alpha and will be merged into master after stabilization**
9. My personal energy is limited, and there are bugs and incomplete functions. Please submit an [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new) and I will handle it promptly;
10. Welcome everyone to fork the project, submit PR, and work together to improve the project.

## Fee Statement

1. Please note that there is no Luckymeet source code available for the startup, operation, deployment, and other stages of this project, which does not affect the actual collaborative functionality。
2. In order to better drive open source, starting from the git head of `e12d2f4850127f53292a5161445fc500593176b9`, the source code modification part will no longer be provided. If necessary, please contact the author for a fee to obtain it。
3. **The lack of Luckysheet source code does not affect the actual functionality, and all collaborative features are open source**。
4. **The impact of no source code:**
    1. The source code is only used for functional expansion in binary scenarios;
    2. If there is no requirement for secondary opening, you do not need to use the source code. If there is a requirement for secondary opening, please contact the author for payment first；
5. **Please note that:**
    1. The enhanced front-end code and server-side code are both open source, and the lack of source code does not affect the functionality and usage；
    2. Fee standard:**`￥ 99`**
    3. Provide services: Only provide source code packages (do not provide continuous feature upgrades, bug fixes, and not purchase products!)
6. **Contact Author**：
    1. qq 群: 522121825 (recommend)

<!-- ## [DeepSeek AI model](https://gitee.com/wfeng0/luckysheet-crdt/blob/master-deepseek-alpha/server/src/DeepSeek/README.md) (still under debugging...)

**only master-deepseek-alpha branch is available** -->

<!-- 1. At present, the AI model is still undergoing integration testing. Please be patient and wait;
2. Need to start AI service on the server first：`npm run ai-server`
3. Add AI configuration to the front desk ：
```js
// 配置AI功能
aiconfig: [
   {
      	name: "deepseek",
      	model: "deepseek-r1",
      	url: `ws://localhost:9000?userid=${id}`,
      	messageMode: "stream", // chat or stream
   },
],
```
4. 初步效果展示:
<p align="center">
  <img src='/public/result/ai.gif' />
</p> -->

## START

1. Clone project：

```bash
git clone https://gitee.com/wfeng0/luckysheet-crdt
```

2. Download dependencies:

```bash
## "dep": "npm install --s && cd server && npm install --s"
npm run dep
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

1. Pack the front-end project first: `npm run build`

```js
build: {
  // Package output directory - will automatically package to the server directory
   outDir: "./server/public/dist",
   rollupOptions: {
      input: {
        // Front end entrance file - Please note that the entry used is the entrance file
      	main: "./entry.html",
      },
   },
},
```

2. Deployment server

```js
// 1. When the server is running, it will automatically build a build directory containing JS files. Please deploy the following folder to the server:
- 🗂️wwwroot
  + 📂build // js files
  + 📂public // Static resources
  + 🗒️package-lock.json
  + 🗒️package.json
```

3. Install node on the server

```js
// Related tutorials can be searched online by oneself, and this example provides：
```

[Install node on the centos](https://blog.csdn.net/weixin_61367575/article/details/138012405)

4. Start Server：`npm run serve`
   Wait for compilation to complete, start the service, and access the `http://${ip}:9000` after deployment is complete

## Collaborative Function Plan Table

| functional module        | Implemented                                                                                                                        | Unrealized                                                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File operation           | ✅️ import file ✅️ export file(Not implemented)                                                                                   |                                                                                                                                                                     |
| Cell operation           | ✅️ Single cell operation ✅️ Range cell operation                                                                                 |                                                                                                                                                                     |
| Config operation         | ✅️ Line hidden ✅️ Column hidden ✅️ Modify row height ✅️ Modify column width                                                    |                                                                                                                                                                     |
| Universal save           | ✅️ Change worksheet name ✅️ Change worksheet color ✅️ Merge cell                                                                | ❌️ Freeze rows and columns ❌️ Filter scope ❌️ Specific settings for filtering ❌️ Alternating colors ❌️ Conditional formatting ❌️ PivotTable ❌️ Dynamic array |
| Function chain operation |                                                                                                                                    | ❌️ Function chain operation                                                                                                                                        |
| Row and column operation | ✅️ Delete rows or columns ✅️ Add rows or columns                                                                                 |                                                                                                                                                                     |
| Filter operations        |                                                                                                                                    | ❌️ Clear filter ❌️ Restore filter                                                                                                                                 |
| Sheet operations         | ✅️ Add sheet ✅️ Copy sheet ✅️ Delete sheet ✅️ Restore sheet ✅️ Adjust the position of the sheet Switch to the specified sheet |                                                                                                                                                                     |
| Sheet attribute          | ✅️ Hidden or displayed                                                                                                            |                                                                                                                                                                     |
| Table information change | ✅️ Change workbook name                                                                                                           |                                                                                                                                                                     |
| Chart operation          | ✅️ Add chart ✅️ Move chart ✅️ Zoom chart ✅️ Update chart options                                                               |                                                                                                                                                                     |

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

#### 1️⃣ Page UI Refactoring

1. Source code UI refactoring, please refer to [Luckysheet-source-recover-style](/Luckysheet-source/src/css/recover.css)
 <p align="center">
   <img src='/public/result/ui.gif' />
 </p>

#### 2️⃣ Chart Collaboration

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

### 4️⃣ File Import

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

### 5️⃣ File Export

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

### 6️⃣ Expand menu functionality

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

4. **Forefront resource reference exception**

```ts
Note: Currently, all plugin dependencies in the source code are derived from absolute paths
// Dynamically load dependent scripts and styles
const dependScripts = [
	"expendPlugins/libs/vue@2.6.11.min.js",
	"expendPlugins/libs/vuex.min.js",
	"expendPlugins/libs/elementui.min.js",
	"expendPlugins/libs/echarts.min.js",
	"expendPlugins/chart/chartmix.umd.min.js",
];

So, it will cause a problem that the actual project in the front-end is probably not the path of public/appendplugins/ * *. Please ensure that the expenndplugins directory is correctly placed and recognized.
```

**Handling method:**

```ts
1. Source code packaging: `npm run build` ==> `dist` Place the directory into the `Accessing static resources`（`public`|`static`|`...`）；
2. Register plugin： `plugins:['chart']`
3. Analyze resource path:
   1. If there are no other paths after the port, it should be placed in the public directory;
   2. If there are other paths after the port, it should be placed in another directory, such as: static。
4. The file is backed up in the `dist` directory and can be copied directly。

```

<p align="center">
  <img src='/public/result/extendplugins.png' />
</p>

5. **Customize the creation of chart types**
   At present, creating charts in vchart is a random 'pie chart' | 'line chart'. If you want to implement custom chart type transfer, you need to modify the chartmix related source code. The specific steps can be referred to as follows：

<p align="center">
  <img src='/public/result/changeChartType.png' />
</p>

```ts
1. Download Source：https://gitee.com/mengshukeji/chartMix
2. Modify the src/tiles/exportUtil.js create Chart method and add a chart type parameter;
3. Repackage and place the file into the project
```

6. **Registration plugin error**
 <p align="center">
   <img src='/public/result/register-plugin-error.png' />
 </p>

```ts
Solution Review: Abnormal Reference to Front end Resources`
```

## Open source contribution

1. Submit an [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new)
2. Fork this project and submit a PR
3. Join the communication group:
 <p align="center">
   <img src='/public/result/qq-group.png' />
 </p>
