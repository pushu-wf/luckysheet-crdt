/**
 * Luckysheet Crdt Server Configuration - 统一配置对象
 */

import path from "path";
import dayjs from "dayjs";
import multer from "multer";

/**
 * HTTP 服务 与 websocket服务 共用一个端口
 */
const SERVER_PORT = 9000;

/**
 * 数据库配置对象 - sequelize
 * 数据库引擎 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle'
 * # 选择以下之一（请注意：目前默认为 MySQL 如果使用其他引擎，请自行下载其他的驱动程序）:
 *   npm install --save pg pg-hstore # Postgres
 *   npm install --save mysql2
 *   npm install --save mariadb
 *   npm install --save sqlite3
 *   npm install --save tedious # Microsoft SQL Server
 *   npm install --save oracledb # Oracle Database
 */
const SQL_CONFIG = {
	port: 3306, // 端口号 3306 3309
	host: "127.0.0.1", // localhost or 127.0.0.1
	database: "luckysheet_crdt",
	user: "root",
	password: "root",
	logger: true, // 开启日志
	enable: true, // 是否启用数据库服务
};

/**
 * 日志配置对象
 */
const LOGGER_CONFIG = {
	filepath: path.resolve(__dirname, "../../logs"),
	filename: `luckysheet.${dayjs().format("YYYY-MM-DD")}.log`,
};

// 静态资源存放地址
const UploadDest = path.resolve(__dirname, "../../public/uploads");

// 静态资源地址 打包后 web 的入口文件
const ENTRY_URL = path.resolve(__dirname, "../../public/dist/index.html");

//  JWT 密钥
const JWT_SECRET = "luckysheet_crdt_jsonwebtoken_secret";

// 配置静态资源目录
const STATIC_SOURCE_LIST = [
	path.resolve(__dirname, "../../public"),
	path.resolve(__dirname, "../../public/dist"),
	path.resolve(__dirname, "../../public/uploads"),
	path.resolve(__dirname, "../../public/dist/assets"),
	path.resolve(__dirname, "../../public/dist/expendPlugins"),
	path.resolve(__dirname, "../../public/dist/lib"),
];

// 配置 Lucky sheet图片上传 Multer 配置对象
const LuckySheetMuter = multer({ dest: UploadDest }).single("image");

// 导出 用户头像上传 Multer 配置对象
const UserAvatarMulter = multer({ dest: UploadDest }).single("userAvatar");

// 导出 文件导入 Multer 配置对象
const FileImportMulter = multer({
	storage: multer.diskStorage({
		filename: function (req, file, callback) {
			file.originalname = Buffer.from(file.originalname, "latin1").toString("utf-8");
			callback(null, file.originalname);
		},
	}),
}).single("file");

// 统一导出配置对象
export {
	ENTRY_URL,
	SQL_CONFIG,
	JWT_SECRET,
	UploadDest,
	SERVER_PORT,
	LOGGER_CONFIG,
	LuckySheetMuter,
	UserAvatarMulter,
	FileImportMulter,
	STATIC_SOURCE_LIST,
};
