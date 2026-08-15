export interface HomeQuickAction {
	id: string;
	label: string;
	icon: string;
	href: string;
}

export interface HomeSkill {
	name: string;
	icon: string;
	group?: string;
}

export interface HomeDataLayerConfig {
	visitImage?: string;
	archiveImage?: string;
	pinnedImage?: string;
	latestImage?: string;
	categoriesImage?: string;
	tagsImage?: string;
	contactImage?: string;
	skillsImage?: string;
}

export interface HomeLink {
	name: string;
	icon: string;
	url: string;
	showName?: boolean;
}

export interface HomeConfig {
	// 头像（路径规则同 profileConfig.avatar）
	avatar: string;
	// 名字
	name: string;
	// 首页展示名字（留空则使用 name）
	displayName?: string;
	// 职业/身份标签
	occupation?: string;
	// 个人签名（首条显示在首屏）
	bio: string[];
	hero: {
		// 首屏背景图（可选；留空使用纯色背景）
		backgroundImage?: string;
		backgroundImageMobile?: string;
		// 快捷入口
		quickActions: HomeQuickAction[];
	};
	// 数据卡视觉图（可选；不填则使用内置 SVG 图形）
	dataLayer: HomeDataLayerConfig;
	// 技能图标
	skills: HomeSkill[];
	// 社交/联系方式
	links: HomeLink[];
}
