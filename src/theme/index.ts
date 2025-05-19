// 公共提示颜色
const common_tip_colors = {
	// 成功色
	// 成功色的浅色背景颜色
	colorSuccessBg: " #dfede2",
	// 成功色的浅色背景色悬浮态
	colorSuccessBgHover: " #c1e0ca",
	// 成功色的描边色
	colorSuccessBorder: " #94d4a8",
	// 成功色的描边色悬浮态
	colorSuccessBorderHover: " #6bc78b",
	// 成功色的深色悬浮态
	colorSuccessHover: " #6bc78b",
	// 成功色
	colorSuccess: " #27ae60",
	// 成功色的深色激活态
	colorSuccessActive: " #178749",
	// 成功色的文本悬浮态
	colorSuccessTextHover: " #47ba73",
	// 成功色的文本默认态
	colorSuccessText: " #27ae60",
	// 成功色的文本激活态
	colorSuccessTextActive: " #178749",

	// # 警戒色
	// 警戒色的浅色背景颜色
	colorWarningBg: " #fffef0",
	// 警戒色的浅色背景色悬浮态
	colorWarningBgHover: " #fffdf0",
	// 警戒色的描边色
	colorWarningBorder: " #fff7c9",
	// 警戒色的描边色悬浮态
	colorWarningBorderHover: " #ffeea1",
	// 警戒色的深色悬浮态
	colorWarningHover: " #ffeea1",
	// 警戒色
	colorWarning: " #f2c94c",
	// 警戒色的深色激活态
	colorWarningActive: " #cca135",
	// 警戒色的文本悬浮态
	colorWarningTextHover: " #ffe278",
	// 警戒色的文本默认态
	colorWarningText: " #f2c94c",
	// 警戒色的文本激活态
	colorWarningTextActive: " #cca135",

	// # 错误色
	// 错误色的浅色背景颜色
	colorErrorBg: " #fff2f0",
	// 错误色的浅色背景色悬浮态
	colorErrorBgHover: " #fff1f0",
	// 错误色的描边色
	colorErrorBorder: " #ffccc7",
	// 错误色的描边色悬浮态
	colorErrorBorderHover: " #ffa39e",
	// 错误色的深色悬浮态
	colorErrorHover: " #ff7875",
	// 错误色
	colorError: " #ff4d4f",
	// 错误色的深色激活态
	colorErrorActive: " #d9363e",
	// 错误色的文本悬浮态
	colorErrorTextHover: " #ff7875",
	// 错误色的文本默认态
	colorErrorText: " #ff4d4f",
	// 错误色的文本激活态
	colorErrorTextActive: " #d9363e",

	// # 信息色
	// 信息色的浅色背景颜色
	colorInfoBg: " #e6f4ff",
	// 信息色的浅色背景色悬浮态
	colorInfoBgHover: " #bae0ff",
	// 信息色的描边色
	colorInfoBorder: " #91caff",
	// 信息色的描边色悬浮态
	colorInfoBorderHover: " #69b1ff",
	// 信息色的深色悬浮态
	colorInfoHover: " #69b1ff",
	// 信息色
	colorInfo: " #1677ff",
	// 信息色的深色激活态
	colorInfoActive: " #0958d9",
	// 信息色的文本悬浮态
	colorInfoTextHover: " #4096ff",
	// 信息色的文本默认态
	colorInfoText: " #1677ff",
	// 信息色的文本激活态
	colorInfoTextActive: " #0958d9",
};

// 公共中性色
const common_colors = {
	// # 文本
	// 一级文本色
	colorText: "rgba(0, 0, 0, 0.88)",
	// 二级文本色
	colorTextSecondary: "rgba(0, 0, 0, 0.65)",
	// 三级文本色
	colorTextTertiary: "rgba(0, 0, 0, 0.45)",
	// 四级文本色
	colorTextQuaternary: "rgba(0, 0, 0, 0.25)",

	// # 描边
	// 一级边框色
	colorBorder: " #d9d9d9",
	// 二级边框色
	colorBorderSecondary: " #f0f0f0",

	// # 填充
	// 一级填充色
	colorFill: "rgba(0, 0, 0, 0.15)",
	// 二级填充色
	colorFillSecondary: "rgba(0, 0, 0, 0.06)",
	// 三级填充色
	colorFillTertiary: "rgba(0, 0, 0, 0.04)",
	// 四级填充色
	colorFillQuaternary: "rgba(0, 0, 0, 0.02)",

	// # 背景
	// 组件容器背景色
	colorBgContainer: " #ffffff",
	// 浮层容器背景色
	colorBgElevated: " #ffffff",
	// 布局背景色
	colorBgLayout: " #f5f5f5",
	// 引起注意的背景色
	colorBgSpotlight: "rgba(0, 0, 0, 0.85)",
	// 浮层的背景蒙层颜色
	colorBgMask: "rgba(0, 0, 0, 0.45)",
};
export const configProvideTheme = {
	token: {
		wireframe: true,
		// 主色浅色背景色
		colorPrimaryBg: " #ebfaf0",
		// 主色浅色背景悬浮态
		colorPrimaryBgHover: " #dfede4",
		// 主色描边色
		colorPrimaryBorder: " #d1e0d7",
		// 主色描边色悬浮态
		colorPrimaryBorderHover: " #a3d4b9",
		// 主色悬浮态
		colorPrimaryHover: " #79c79f",
		// 品牌主色
		colorPrimary: " #55bb8a",
		// 主色激活态
		colorPrimaryActive: " #3b946c",
		// 主色文本悬浮态
		colorPrimaryTextHover: " #79c79f",
		// 主色文本
		colorPrimaryText: " #55bb8a",
		// 主色文本
		colorPrimaryTextActive: " #3b946c",
		...common_colors,
		...common_tip_colors,
	},
};
