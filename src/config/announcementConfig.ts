import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "公告",

	// 首页跑马灯公告列表
	items: [
		{
			tag: "欢迎",
			title: "欢迎来到我的博客",
			content: "欢迎新朋友的到来！",
			time: "2026-08-15",
			link: "/about/",
			sort: 1,
		},
		{
			tag: "类型",
			title: "互换友链",
			content: "个人博客网站",
			time: "2026-08-14",
			link: "/friends/",
			sort: 2,
		},
		{
			tag: "维护",
			title: "公告",
			content: "目前网站状态正常",
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
