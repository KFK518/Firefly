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
	occupation: "技术博主 / 全栈爱好者",

	// 个人签名（首条显示在首屏）
	bio: [profileConfig.bio || "Hello, I'm Firefly."],

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
		latestImage: "/assets/images/home/home2.webp",
		categoriesImage: "/assets/images/panels/d3.webp",
		tagsImage: "/assets/images/panels/d4.webp",
		contactImage: "/assets/images/home/home-data-3.webp",
	},

	// 技能图标
	skills: [
		{ name: "Astro", icon: "simple-icons:astro", group: "Frontend" },
		{ name: "TypeScript", icon: "simple-icons:typescript", group: "Language" },
		{ name: "Tailwind CSS", icon: "simple-icons:tailwindcss", group: "Style" },
		{ name: "Python", icon: "simple-icons:python", group: "Language" },
		{ name: "Docker", icon: "simple-icons:docker", group: "DevOps" },
	],

	// 社交/联系方式（复用用户资料配置）
	links: profileConfig.links,
};
