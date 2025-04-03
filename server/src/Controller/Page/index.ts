import { ENTRY_URL } from '../../Config';
import { Request, Response } from 'express';

export function initPages(req: Request, res: Response) {
	res.setHeader('Content-Type', 'text/html; charset=utf-8').sendFile(
		ENTRY_URL
	);
}
