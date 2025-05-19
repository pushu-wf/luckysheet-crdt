/**
 * 验证码相关工具方法
 */
class VerificationCode {
	/**
	 * 获取验证码
	 * @param length
	 * @returns
	 */
	public getVerificationCode(length: number = 4): string {
		let code = "";
		for (let i = 0; i < length; i++) {
			code += Math.floor(Math.random() * 10);
		}
		return code;
	}

	/**
	 * 将验证码绘制到 canvas 上
	 * @param canvas
	 * @param code
	 * @returns
	 */
	public drawVerificationCode(canvas: HTMLCanvasElement, code: string): void {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const { width, height } = canvas;

		ctx.clearRect(0, 0, width, height);

		// 每一个数组应该占有的宽度
		const arr = code.split("");
		const itemWidth = width / arr.length;

		// 随机大小 颜色 角度 绘制传入的验证码
		arr.forEach((item, index) => {
			// x 的范围只能是
			ctx.save();
			const x = itemWidth * index;
			ctx.font = `${Math.random() * 20 + 20}px Arial`;
			ctx.fillStyle = this.getRandomColor();
			ctx.fillText(item, x, height / 2 + Math.random() * 20);
			ctx.restore();
		});

		this.drawRandomItem(ctx);
	}

	/**
	 * 获取随机颜色
	 * @returns
	 */
	private getRandomColor(): string {
		return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
	}

	/**
	 * 绘制随机干扰项 - 线段 / 圆圈 等
	 */
	private drawRandomItem(ctx: CanvasRenderingContext2D): void {
		const { width, height } = ctx.canvas;
		for (let i = 0; i < 10; i++) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(Math.random() * width, Math.random() * height);
			ctx.lineTo(Math.random() * width, Math.random() * height);
			ctx.strokeStyle = this.getRandomColor();
			ctx.stroke();
			ctx.restore();
		}
	}
}

export const verificationCode = new VerificationCode();
