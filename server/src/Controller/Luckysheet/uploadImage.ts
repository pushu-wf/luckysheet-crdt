import fs from "fs";
import multer from "multer";
import { Request, Response } from "express";
import { MULTER_CONFIG } from "../../Config";

// 配置 Multer
const { dest, single } = MULTER_CONFIG;
const upload = multer({ dest }).single(single);

/**
 * Luckysheet 自定义图片上传方法
 */
export async function uploadImage(req: Request, res: Response) {
	upload(req, res, async () => {
		const { file } = req;

		// 如果没有解析到 file 对象，则直接返回 400
		if (!file) {
			res.status(400).json({ code: 400, msg: "请选择文件" });
			return;
		}

		const { filename, originalname } = <Express.Multer.File>file;

		/**
		 * 处理文件路径：
		 *  将原始路径 Snipaste_2024-10-10_09-46-01.png
		 *  转换成 85d6d8c593b7239406ce2c13099c6110.png
		 *  保留后缀，方便用户以静态资源访问
		 */
		const suffix = originalname.split(".").pop();
		const oldpath = `${MULTER_CONFIG.dest}/${filename}`;
		const newpath = `${MULTER_CONFIG.dest}/${filename}.${suffix}`;

		// 重命名文件
		fs.renameSync(oldpath, newpath);

		res.json({
			code: 200,
			msg: "Success to upload.",
			url: `/uploads/${filename}.${suffix}`,
		});
	});
}
