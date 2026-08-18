import type { HomeConfig } from "../types/homeConfig";
import { profileConfig } from "./profileConfig";

export const homeConfig: HomeConfig = {
	// 头像（复用用户资料配置）
	avatar: profileConfig.avatar || "assets/images/avatar.avif",

	// 名字
	name: profileConfig.name,

	// 首页展示名字（留空则使用 name）
	displayName: profileConfig.name,

	// 职业/身份标签
	occupation: "云深遇归期/月下赴山河",

	// 个人签名（首条显示在首屏）
	bio: [profileConfig.bio || "Hello, I'm a whale."],

	hero: {
		// 首屏背景图（可选；留空则使用纯色背景）
		backgroundImage: "/assets/images/home/home.webp",
		backgroundImageMobile: "/assets/images/home/home-mobile.webp",
		quickActions: [
			{
				id: "articles",
				label: "查看文章",
				icon: "material-symbols:article-outline-rounded",
				href: "/list/",
			},
			{
				id: "guestbook",
				label: "给我留言",
				icon: "mingcute:comment-line",
				href: "/guestbook/",
			},
			{
				id: "friends",
				label: "交换友链",
				icon: "material-symbols:link-rounded",
				href: "/friends/",
			},
		],
	},

	// 数据卡视觉图
	dataLayer: {
		visitImage: "/assets/images/home/home-data-1.webp",
		archiveImage: "/assets/images/home/home-data-2.webp",
		pinnedImage: "/assets/images/panels/d1.webp",
		latestImage: "/assets/images/home/168102.webp",
		categoriesImage: "/assets/images/panels/d3.webp",
		tagsImage: "/assets/images/panels/d4.webp",
		contactImage: "/assets/images/home/20240326bdn1kh.webp",
	},

	// 技能图标
	skills: [],

	// 社交/联系方式（复用用户资料配置）
	links: profileConfig.links,
};
