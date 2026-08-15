import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "公告",

	// 首页跑马灯公告列表
	items: [
		{
			tag: "欢迎",
			title: "欢迎来到我的博客",
			content: "欢迎来到我的博客！这是一则示例公告。",
			time: "2026-08-15",
			link: "/about/",
			sort: 1,
		},
		{
			tag: "友链",
			title: "互换友链",
			content: "正在招募技术类博客友链，要求原创、稳定更新。点击了解更多。",
			time: "2026-08-14",
			link: "/friends/",
			sort: 2,
		},
		{
			tag: "维护",
			title: "公告",
			content: "示例公告，可自行修改或增删。",
			time: "2026-08-13",
			sort: 3,
		},
	],

	// 公告内容
	content: "欢迎来到我的博客！这是一则示例公告。",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "了解更多",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
