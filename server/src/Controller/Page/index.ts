import { ENTRY_URL } from "../../Config";
import { Request, Response } from "express";

export function initPages(req: Request, res: Response) {
	console.log(" ==> initPages");
	res.set("Content-Type", "text/html;charset=utf-8");
	res.sendFile(ENTRY_URL);
}
