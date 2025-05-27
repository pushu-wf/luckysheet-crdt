<p align="center">
  <img src='/public/logo.svg' />
</p>

<h1 align="center">Luckysheet CRDT</h1>

简体中文 | [English](./README.md)

<p align="center">
  <img src='/public/result/result.gif' />
</p>

---

**项目分支：**

-   `master`: 稳定版，提供可选数据库服务，提供完整功能实现；
-   `master-alpha`: 开发版，提供可选数据库服务，提供完整功能实现；
-   `master-vue`: 稳定版，提供用户系统、文件系统，提供完整功能实现，依赖数据库服务；

## 项目说明

1. 本项目基于 [Luckysheet](https://github.com/mengshukeji/Luckysheet) 源码修改，**请遵循原作者开源协议**，同时，**请不要删除或修改源码头部版权声明**。
2. 本项目以 **Apache2.0 协议开源**，请放心使用，同时，本项目也将回馈于 Luksysheet 社区，丰富社区生态，再次感谢 @[Luckysheet](https://github.com/mengshukeji/Luckysheet) 团队 ❤️
3. 项目为 **Luckysheet 协同增强版（全功能实现）**，意在**提供协同实现思路、数据存储服务、协同演示**等，项目基于 [Luckysheet](https://github.com/mengshukeji/Luckysheet) 实现，感谢原作者开源。
4. 本项目主要**实现协同功能**模块，对其他内容不做修改，功能使用上并无影响；
5. 项目支持 **可选数据库服务**，没有数据库的用户数据无法持久化存储，协同功能并不受影响，**⚠️`仅对 master、master-alpha` 分支有效，master-vue 依赖数据库功能实现用户系统**。
6. 项目使用 **[Sequelize](https://www.sequelize.cn/)** 作为 ORM 数据服务技术，支持 mysql、sqlite、postgres、mssql 等数据库，方便用户快速迁移。
7. 项目使用 **Typescript** 作为主要开发语言，提供完整的类型提示，规范代码，提高开发效率。
8. 个人精力有限，**存在 BUG 及功能未完善之处**，请提交 [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new) ，我会及时处理；
9. 也欢迎大家 fork 项目，提交 pr ，一起完善项目；

## 收费声明

1. 请注意，本项目启动、运行、部署等环节，**没有 Luckysheet-source 源码，不影响实际协同功能**。
2. 为了更好驱动开源，本项目至 `2025-04-15` `e12d2f4850127f53292a5161445fc500593176b9` git head 起，**不再提供源码修改部分，如有需要，请联系作者收费获取**。
3. **没有 Luckysheet-source 源码不影响实际功能，协同部分全部功能均开源**。
4. **没有源码的影响：**
    1. 源码仅用于二开场景下，做功能拓展使用；
    2. 如果没有二开需求，可不使用源码，如有二开需求，请先联系作者收费使用；
5. **请注意：**
    1. 增强版前台代码、服务端代码均开源，没有源码不影响功能使用
    2. 收费标准：**`99 元`**
    3. 提供服务：仅提供源码包(不提供持续的功能升级、BUG 修复，更不是买产品！)
6. **联系作者**：
    1. qq 群: 522121825 (推荐)

## 项目启动

1. 克隆项目：

```bash
git clone https://gitee.com/wfeng0/luckysheet-crdt
```

2. **下载依赖:**

```bash
# "dep-npm": "npm install --s && cd server && npm install --s",
# "dep-pnpm": "pnpm install --s && cd server && pnpm install --s"
npm run dep-npm | npm run dep-pnpm
# 推荐使用 pnpm 进行依赖的安装，避免出现版本冲突问题
```

**⛔️ 温馨提示：**

```js
1. 项目依赖分为前台依赖、后台依赖（独立的项目哈）；
2. 推荐大家使用 `npm install` 安装依赖，避免出现版本冲突问题；
3. 如果依赖下载报错，可以尝试删除 `package-lock.json` 文件，重新执行依赖安装；
4. 如果封装命令 `npm run dep` 报错，请尝试执行 `npm install --s` 命令进行前台依赖安装，执行 `cd server && npm install --s` 命令进行后台依赖安装。

**如果还报错，请确认环境是否满足运行条件：**
`node -v ==> v20.x.x` // 请确保 node 版本大于 18
`npm -v ==> 10.x.x` // 请确保 npm 版本大于 7.x.x
```

3. 🚫<span style="color:red;font-weight:900">~~如果无数据库服务，请跳过此步骤~~</span>🚫 配置数据库参数：

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

4. 🚫<span style="color:red;font-weight:900">~~如果无数据库服务，请跳过此步骤~~</span>🚫 同步数据库表：

```bash
npm run db
```

**⛔️ 温馨提示：**

```ts
1.  请确保数据库配置正确可用
2.  请确保项目执行同步数据库命令 `npm run db`
3.  项目周期只需要执行一次，确保数据库内存在表结构即可。
```

5. 启动服务:
    - 前台服务：`npm run dev`
    - 后台服务：`npm run server`
6. 打开网址：`http://localhost:5000` | `http://localhost:9000` 即可体验协同功能。

## 项目部署

**温馨提示：下列所有命令均在项目根目录下执行 /LUCKYSHEET-CRDT/**

1.  先打包前台项目: `npm run build`

    -   请注意，打包文件文件，默认输出到 `server/public/dist`

2.  打包服务端代码: `npm run build:server`

    -   此时，整个项目的打包结果，会直接输出到 `server/wwwroot` 目录下，即可直接部署到服务器上。

3.  请将 `server/wwwroot` 目录下的文件，上传到服务器上
<p align="center">
  <img src='/public/result/build.png' />
</p>

4.  在服务器上安装 `node` 环境，相关教程可自行上网查询

    -   本例提供：[centos 参考此链接](https://blog.csdn.net/weixin_61367575/article/details/138012405)

5.  同步数据库表：`npm run db`

    -   请确保数据库配置正确可用(~~如果无数据库服务，请跳过此步骤~~)

6.  启动服务：`npm run start`: **此命令仅打包后 wwwroot 文件夹下有效**
    -   等待依赖下载完成，启动服务`npm run start`，部署完成后访问 `http://${ip}:9000` 即可访问

## 协同功能计划表

<!-- **已实现功能 ✅️，未实现功能 ❌️** -->

| 功能模块               | 已完成                                                                                     | 未完成                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 文件导入、导出         | ✅️ 导入文件 ✅️ 导出文件(导出不需要协同)                                                  |                                                                                                    |
| 单元格操作             | ✅️ 单个单元格操作 ✅️ 范围单元格操作                                                      |                                                                                                    |
| config 操作            | ✅️ 行隐藏 ✅️ 列隐藏 ✅️ 修改行高 ✅️ 修改列宽                                            |                                                                                                    |
| 通用保存               | ✅️ 修改工作表名称 ✅️ 修改工作表颜色 ✅️ 合并单元格                                       | ❌️ 冻结行列 ❌️ 筛选范围 ❌️ 筛选的具体设置 ❌️ 交替颜色 ❌️ 条件格式 ❌️ 数据透视表 ❌️ 动态数组 |
| 函数链操作             | ✅️ 函数链操作                                                                             |                                                                                                    |
| 行列操作               | ✅️ 删除行或列 ✅️ 增加行或列                                                              |                                                                                                    |
| 筛选操作               |                                                                                            | ❌️ 清除筛选 ❌️ 恢复筛选                                                                          |
| sheet 操作             | ✅️ 新建 sheet ✅️ 复制 sheet ✅️ 删除 sheet ✅️ 删除 sheet 后恢复操作 ✅️ 调整 sheet 位置 |                                                                                                    |
| sheet 属性(隐藏或显示) | ✅️ 隐藏或显示                                                                             |                                                                                                    |
| 表格信息更改           | ✅️ 修改工作簿名称                                                                         |                                                                                                    |
| 图表                   | ✅️ 新增图表 ✅️ 移动图表位置 ✅️ 缩放图表 ✅️ 修改图表配置                                |                                                                                                    |

## 服务端口说明

1. 前台服务端口：`5000`
2. 后台服务端口：`9000`
3. 数据库服务端口：`3306`

```js
// 1️⃣ 后台服务端口配置：server/src/Config/index.ts
export const SERVER_PORT = 9000;
```

```js
// 2️⃣ 数据库服务端口配置：server/src/Config/index.ts
export const SQL_CONFIG = {
	port: 3306,
	// ... other config
};
```

```js
// 3️⃣ 前台服务端口配置：src/config/index.ts
// 导出后台服务地址
export const SERVER_URL = "http://localhost:9000";

// 导出协同服务地址
export const WS_SERVER_URL = "ws://127.0.0.1:9000";
```

## 源项目优化

#### 1️⃣ 页面 UI 重构

1. 源码 UI 重构，请查阅 [Luckysheet-source-recover-style](/Luckysheet-source/src/css/recover.css)
 <p align="center">
   <img src='/public/result/ui.gif' />
 </p>

#### 2️⃣ 图表协同

1. 已实现 vchart 图表，请查阅 [Luckysheet-source-vchart](/Luckysheet-source/src/expendPlugins/vchart/plugin.js)
   <span style="font-weight:900">左侧为 `vchart` 渲染，右侧为 `chartmix` 渲染</span>
    <p align="center">
    <img src='/public/result/chartmix-vchart.png' />
    </p>
    <span style="font-weight:900">vchart 图表动画更加流畅，页面简洁美观</span>
    <p align="center">
    <img src='/public/result/vchart.gif' />
    </p>
    <span style="font-weight:900">vchart 图表设置</span>
    <p align="center">
    <img src='/public/result/vchart-setting.gif' />
    </p>

2. 拓展实现图表数据更新联动：
   <span style="font-weight:900">chartmix 图表数据联动</span>
    <p align="center">
    <img src='/public/result/chartmix-update-data-crdt.gif' />
    </p>

<span style="font-weight:900">vchart 图表数据联动</span>

<p align="center">
  <img src='/public/result/vchart-update-data-crdt.gif' />
</p>

### 3️⃣ 图片移动性能优化

<span style="font-weight:900">原效果：</span>

<p align="center">
  <img src='/public/result/picture-old.gif' />
</p>

<span style="font-weight:900">优化后：(调整图片设置打开方式)</span>

<p align="center">
  <img src='/public/result/picture-new.gif' />
</p>

### 4️⃣ 文件导入

<span style="font-weight:900">支持协同~</span>

<p align="center">
  <img src='/public/result/file-import.gif' />
</p>
<span style="font-weight:900">配置方法：</span>

```js
// 1. 配置导入插件
const options = {
	// ...other config
	plugins: ["fileImport"],
};

luckysheet.create(options);
```

<span style="font-weight:900">注意事项：</span>

1. 文件导入依赖于 `luckyexcel` 插件；
2. 故而有些功能受限于插件，如需拓展，请自行实现哈！
3. 请正确配置 `plugins: [ 'fileImport' ]` 后使用导入功能。

### 5️⃣ 文件导出

<p align="center">
  <img src='/public/result/file-export.gif' />
</p>
<span style="font-weight:900">配置方法：</span>

```js
// 1. 配置导出插件
const options = {
	// ...other config
	plugins: ["fileExport"],
};

luckysheet.create(options);
```

<span style="font-weight:900">注意事项：</span>

1. 文件导入依赖于 `exceljs | file-saver` 插件；
2. 故而有些功能受限于插件，如需拓展，请自行实现哈！
3. 请正确配置 `plugins: [ 'fileExport' ]` 后使用导入功能。

### 6️⃣ 自定义菜单

<span style="font-weight:900">配置方法：</span>

<p align="center">
  <img src='/public/result/menu.png' />
</p>

```ts
const options = {
   lang: "zh",
   title: "Luckysheet",
   // ...other config

   // 传入 menuHandler 配置项
   menuHandler:{
       hideDefaultMenu: string[], // 目前默认菜单为 导入导出 importFile | exportFile
       customs: MenuHandlerCustomsItem[]
   }
}

type MenuHandlerCustomsItem = {
  label: string
  value: string
  callback: () => void
  order?: string // 菜单排序，小的在上面，默认的菜单 order = 10 在默认菜单上面，需要比10小，不传默认放置在下面
  icon?: string
} |
// 分割线配置对象
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

**自定义菜单的 icon 图标处理方法**

1. 下载 iconfont 资源，放置到 `source/src/assets` 目录下（下载到本地并解压）
2. 在同级目录 `iconfont/iconfont.css` 引入当前下载的资源包

```css
@import url("../font_3944349_xxxxx/iconfont.css");
```

3. 打包输出即可正常使用 iconfont 图标

### 7️⃣ 自定义请求头

很多人反映，应该在请求表格数据接口时，添加 cookies、token 等信息，以实现用户身份权限校验，目前已实现，具体配置如下：

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

**具体实现方案：`源码/src/core.js`**

```ts
// 修改 $post 方法，改为 $ajax() 以实现添加请求头的功能
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

## Master-Vue 开箱即用版

本项目作为`luckysheet-crdt`的一个分支，附属于 `luckysheet-crdt`，仅作为 vue 版本的示例，提供完整的用户系统(登录、注册、修改信息)、文件系统(创建、修改、删除、协同、分享...)，项目截图如下：

<p align="center">
  <img src='/public/result/master-vue-login.png' />
  <img src='/public/result/master-vue-home.png' />
  <img src='/public/result/master-vue-invite.png' />
  <img src='/public/result/master-vue-userinfo.png' />
  <img src='/public/result/master-vue-btns.png' />
</p>

## 常见问题

1. **导入文件时，提示 `文件格式错误`**：

```ts
目前仅支持 xlsx 格式，请检查文件格式是否正确。
```

2. **页面显示`协同服务不可用，当前为普通模式`**：

```ts
try {
  const { data } = await fetch({
      url: "/api/getWorkerBook",
      method: "post",
      data: { gridKey },
   });
}
catch (error) {}

当且仅当！ fetch 请求失败时，会进入 catch 块，
此时会提示 `协同服务不可用，当前为普通模式`；
请检查服务是否正常，一般有下列可能：

1. 服务异常
2. 数据库异常
3. 数据库表结构异常
```

3. **数据库数据混乱：**

```ts
造成该原因的唯一可能，就是应用没有相关的 delete 语句，
不是我不写哈，而是大家根据自己的实际业务，进行拓展。
下列步骤可恢复：
1. 删除 luckysheet_crdt 所有数据表;
2. 执行 npm run db 同步数据库表;
3. 执行 npm run server 启动服务;

上诉操作，会自己创建数据库表，同步最新的模型结构，
并且创建一个 gridkey-demo 的 workerbooks、workersheets 记录；
当且仅当，这两个表有记录的场景下，才能渲染 luckysheet；

注意！如果两个表没有一条记录，也可能造成无法协同（问题2）
注意！如果 workersheets 表有记录，但是 deleteFlag 为 true 的情况下，也会导致无法渲染 luckysheet；
```

4. **前台资源引用异常**

```ts
注意： 目前源码中的所有插件依赖，均源自绝对路径哈：
// Dynamically load dependent scripts and styles
const dependScripts = [
	"expendPlugins/libs/vue@2.6.11.min.js",
	"expendPlugins/libs/vuex.min.js",
	"expendPlugins/libs/elementui.min.js",
	"expendPlugins/libs/echarts.min.js",
	"expendPlugins/chart/chartmix.umd.min.js",
];

那么，就会引发一个问题，前台实际的项目，估计不是 public/expendPlugins/ ** 的路径,请确保 expendPlugins 目录被正确放置并识别。
```

**处理方式：**

```ts

1. 源码打包： `npm run build` ==> `dist` 目录放置到项目`可访问静态资源`（`public`|`static`|`...`）目录下；
2. 注册插件： `plugins:['chart']`
3. 分析资源路径：
   1. 如果端口后没有其他路径，则应该放到 public 目录下；
   2. 如果端口后有其他路径，则应该放到其他目录下，如：static。
4. 文件在 `dist` 目录下有备份，直接复制出来即可。
```

<p align="center">
  <img src='/public/result/extendplugins.png' />
</p>

5. **自定义创建图表类型**
   目前 vchart 创建图表是随机的`饼图`|`折线图`，如果想实现自定义的图表类型传递，需要修改 chartmix 相关源码，具体步骤可参考如下：

<p align="center">
  <img src='/public/result/changeChartType.png' />
</p>

```ts
1. 下载源码：https://gitee.com/mengshukeji/chartMix
2. 修改 src/utils/exportUtil.js createChart 方法，添加图表类型参数
3. 重新打包，将文件放置到项目中
```

6. **注册插件报错**
 <p align="center">
   <img src='/public/result/register-plugin-error.png' />
 </p>

```ts
解决办法回看`前台资源引用异常`;
```

## 开源贡献

1. 提交 [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new)
2. fork 本项目，提交 PR
3. 加入交流群：
 <p align="center">
   <img src='/public/result/qq-group.png' />
 </p>
