import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 是否在侧边栏显示音乐播放器组件
	showInSidebar: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	mode: "local",

	// 默认音量 (0-1)
	volume: 0.7,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// 是否显启用歌词
	showLyrics: true,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "10046455237",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	// 1. 支持传入歌词文件的路径
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 或者直接填入歌词字符串内容
	// lrc: "[00:00.00]歌词内容...",
	local: {
		playlist: [
			{
				name: "鱼仔",
				artist: "卢广仲",
				url: "/assets/music/卢广仲 - 鱼仔.mp3",
				cover: "/assets/music/cover/80344cb971754ed93f5a1b9dcca10c9f.webp",
				lrc: "/assets/music/lrc/卢广仲 - 鱼仔.lrc",
			},
			{
				name: "归期",
				artist: "钱润玉",
				url: "/assets/music/钱润玉 - 归期.mp3",
				cover: "/assets/music/cover/1534831387651.webp",
				lrc: "/assets/music/lrc/钱润玉 - 归期.lrc",
			},
			{
				name: "100种生活",
				artist: "卢广仲",
				url: "/assets/music/卢广仲 - 100种生活.mp3",
				cover: "/assets/music/cover/5ca13849dc0846782e362d12aed6543c.webp",
				lrc: "/assets/music/lrc/卢广仲 - 100种生活.lrc",
			},
			{
				name: "七里香",
				artist: "周杰伦",
				url: "/assets/music/周杰伦 - 七里香 .mp3",
				cover: "/assets/music/cover/d48704ec25f4f565ce836c8c0ff830d2.webp",
				lrc: "/assets/music/lrc/周杰伦 - 七里香 .lrc",
			},
			{
				name: "读心术",
				artist: "卓文萱",
				url: "/assets/music/卓文萱 - 读心术.mp3",
				cover: "/assets/music/cover/77d95b7e3cdf891cbcc3c182999e4e9c.webp",
				lrc: "/assets/music/lrc/卓文萱 - 读心术.lrc",
			},
			{
				name: "旅行的意义",
				artist: "陈绮贞",
				url: "/assets/music/陈绮贞 - 旅行的意义.mp3",
				cover: "/assets/music/cover/4d5982e312cd464be1cef3bd2a3eaadd.webp",
				lrc: "/assets/music/lrc/陈绮贞 - 旅行的意义.lrc",
			},
			{
				name: "When She's Gone",
				artist: "Josh Fudge",
				url: "/assets/music/Josh Fudge - When She's Gone.mp3",
				cover: "/assets/music/cover/f6f6c634e1271bfbf73e83a572270eac.webp",
				lrc: "/assets/music/lrc/Josh Fudge - When She's Gone.lrc",
			},
		],
	},

	// 3D 可视化配置
	visualizer: {
		background: {
			dark: "#000000",
			light: "#000000",
		},
		camera: {
			position: {
				x: 0,
				y: 32,
				z: 52,
			},
		},
		autoRotate: true,
		autoRotateSpeed: 0.3,
		height: {
			idle: 0.6,
			subBass: 4.0,
			bass: 3.0,
			lowMid: 2.0,
			mid: 2.5,
			highMid: 2.0,
			energy: 4.0,
			ripple: 3.0,
			rippleAccent: 1.0,
		},
		theme: {
			base1: "#000000",
			base2: "#000000",
			coolCore: "#16b8c9",
			coolEdge: "#69dce7",
			warmCore: "#8be8ee",
			warmEdge: "#d9ffff",
			rippleColor: "#3bcbd9",
			rippleCool: "#3bcbd9",
			rippleWarm: "#d9ffff",
			fogColor: "#050810",
			glowIntensity: 0.86,
		},
	},
};
