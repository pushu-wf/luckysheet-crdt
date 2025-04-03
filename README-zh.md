<p align="center">
  <img src='/public/logo.svg' />
</p>

<h1 align="center">Luckysheet CRDT</h1>

简体中文 | [English](./README.md)

---

<p align="center">
  <img src='/public/result/result.gif' />
</p>

## 项目说明
1. 本项目基于 [Luckysheet](https://github.com/mengshukeji/Luckysheet) 源码修改，**请遵循原作者开源协议**，同时，**请不要删除或修改源码头部版权声明**。
2. 本项目以 **Apache2.0 协议开源**，请放心使用，同时，本项目也将回馈于 Luksysheet 社区，丰富社区生态，再次感谢 @[Luckysheet](https://github.com/mengshukeji/Luckysheet) 团队 ❤️
3. 项目为 **Luckysheet 协同增强版（全功能实现）**，意在**提供协同实现思路、数据存储服务、协同演示**等，项目基于 [Luckysheet](https://github.com/mengshukeji/Luckysheet) 实现，感谢原作者开源。
4. 本项目主要**实现协同功能**模块，对其他内容不做修改，功能使用上并无影响；
5. 项目支持 **可选数据库服务**，没有数据库的用户数据无法持久化存储，协同功能并不受影响。
6. 项目使用 **[Sequelize](https://www.sequelize.cn/)** 作为ORM数据服务技术，支持mysql、sqlite、postgres、mssql等数据库，方便用户快速迁移。
7. 项目使用 **Typescript** 作为主要开发语言，提供完整的类型提示，规范代码，提高开发效率。
8. **项目有 `master` 分支和 `master-alpha` 分支，最新发布的特性，会在 alpha 上进行测试，稳定后会合并到 master 上。**
9. 个人精力有限，**存在BUG及功能未完善之处**，请提交 [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new) ，我会及时处理；
10. 也欢迎大家 fork 项目，提交 pr ，一起完善项目；


## 收费声明
1. 请注意，本项目启动、运行、部署等环节，**没有Luckysheet-source 源码，不影响实际协同功能**。
2. 为了更好驱动开源，本项目至 `bf75470121f0f52737e604233add82ad2502218d` git head 起，**不再提供源码修改部分，如有需要，请联系作者收费获取**。
3. **没有 Luckysheet-source源码不影响实际功能，协同部分全部功能均开源**。
4. **没有源码的影响：**
   1. 源码仅用于二开场景下，做功能拓展使用；
   2. 如果没有二开需求，可不使用源码，如有二开需求，请先联系作者收费使用；
5. **请注意：**
   1. Luckysheet-source 会保留，但是不会持续更新，后续的功能升级，仅提供 lib 插件包；
   2. 收费标准：**`99 元`**
   3. 提供服务：仅提供源码包(不提供持续的功能升级、BUG修复，更不是买产品！)
6. **联系作者**：
   1. qq群: 522121825 (推荐)


## 项目启动
1. 克隆项目：
```bash
git clone https://gitee.com/wfeng0/luckysheet-crdt
```

2. **下载依赖:** 
```bash
## "dep": "npm install --s && cd server && npm install --s"
npm run dep
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
1. 先打包前台项目: `npm run build`
```js
build: {
  // 打包输出目录 - 会自动打包到 server 目录下
   outDir: "./server/public/dist",
   rollupOptions: {
      input: {
        // 前台入口文件 - 请注意，使用的 entry 为入口文件哈
      	main: "./entry.html",
      },
   },
},
```
2. 部署 server
```js
// 1. server 运行的时候，会自动构建一个 build 目录，里面是 js 文件，请将以下文件夹部署到服务器上：
- 🗂️wwwroot
  + 📂build // server 打包的 js 文件
  + 📂public // 后台静态资源
  + 🗒️package-lock.json
  + 🗒️package.json
```

3. 在服务器上安装node
```js
// 相关教程可自行上网查询，本例提供：
```
[centos参考此链接](https://blog.csdn.net/weixin_61367575/article/details/138012405)

4. 启动服务：`npm run serve`
等待编译完成，启动服务，部署完成后访问 `http://${ip}:9000` 即可


## 协同功能计划表
<!-- **已实现功能 ✅️，未实现功能 ❌️** -->
| 功能模块              | 已完成                                                                    | 未完成                                                                               |
| --------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 文件导入、导出        | ✅️ 导入文件✅️ 导出文件(导出不需要协同)                                      |                                                                                      |
| 单元格操作            | ✅️ 单个单元格操作✅️ 范围单元格操作                                          |                                                                                      |
| config操作            | ✅️ 行隐藏 ✅️ 列隐藏 ✅️ 修改行高 ✅️ 修改列宽                                   |                                                                                      |
| 通用保存              | ✅️ 修改工作表名称 ✅️ 修改工作表颜色 ✅️ 合并单元格                            | ❌️ 冻结行列 ❌️ 筛选范围 ❌️ 筛选的具体设置 ❌️ 交替颜色 ❌️ 条件格式 ❌️ 数据透视表 ❌️ 动态数组 |
| 函数链操作            |                                                                           | ❌️ 函数链操作                                                                         |
| 行列操作              | ✅️ 删除行或列 ✅️ 增加行或列                                                 |                                                                                      |
| 筛选操作              |                                                                           | ❌️ 清除筛选 ❌️ 恢复筛选                                                                |
| sheet操作             | ✅️ 新建sheet ✅️ 复制sheet ✅️ 删除sheet ✅️ 删除sheet后恢复操作 ✅️ 调整sheet位置 |                                                                                      |
| sheet属性(隐藏或显示) | ✅️ 隐藏或显示                                                              |                                                                                      |
| 表格信息更改          | ✅️ 修改工作簿名称                                                          |                                                                                      |
| 图表                  | ✅️ 新增图表 ✅️ 移动图表位置 ✅️ 缩放图表 ✅️ 修改图表配置                       |                                                                                      |


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
#### 1️⃣ 页面UI重构
1. 源码UI重构，请查阅 [Luckysheet-source-recover-style](/Luckysheet-source/src/css/recover.css)
<p align="center">
  <img src='/public/result/ui.gif' />
</p>

#### 2️⃣ 图表协同
1. 已实现vchart图表，请查阅 [Luckysheet-source-vchart](/Luckysheet-source/src/expendPlugins/vchart/plugin.js)
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
}

luckysheet.create(options)
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
}

luckysheet.create(options)
```

<span style="font-weight:900">注意事项：</span>
1. 文件导入依赖于 `exceljs | file-saver` 插件；
2. 故而有些功能受限于插件，如需拓展，请自行实现哈！
3. 请正确配置 `plugins: [ 'fileExport' ]` 后使用导入功能。


### 6️⃣ 拓展菜单功能
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
      		label: '保存',
      		value: 'saveFile',
      		order: 1
      	},
      	{ value: 'divider', order: 2 }
   ]
}
```



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

<p align="center">
  <img src='/public/result/extendplugins.png' />
</p>
```

5. **自定义创建图表类型**
  目前vchart 创建图表是随机的`饼图`|`折线图`，如果想实现自定义的图表类型传递，需要修改 chartmix 相关源码，具体步骤可参考如下：


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
解决办法回看 `前台资源引用异常`
```



## 开源贡献
1. 提交 [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new)
2. fork 本项目，提交 PR
3. 加入交流群：
<p align="center">
  <img src='/public/result/qq-group.png' />
</p>