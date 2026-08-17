<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { musicPlayerConfig } from "@/config/musicConfig";
import { AudioAnalyzer } from "./AudioAnalyzer";
import LyricsOverlay from "./LyricsOverlay.svelte";
import ThreeScene from "./ThreeScene.svelte";
import VisualizerControls from "./VisualizerControls.svelte";

const audioAnalyzer = new AudioAnalyzer();
let sceneReady = $state(false);
let backgroundColor = $state(
	musicPlayerConfig.visualizer?.background?.dark ?? "#0a0a15",
);

function connectAudio() {
	const audio = document.getElementById(
		"firefly-music-audio",
	) as HTMLAudioElement | null;
	if (!audio) {
		setTimeout(connectAudio, 200);
		return;
	}
	audio.crossOrigin = "anonymous";
	audioAnalyzer.connect(audio);

	if (audioCtxState() === "suspended") {
		audioAnalyzer.resume();
	}
}

function audioCtxState() {
	return audioAnalyzer.audioCtx?.state || "running";
}

// 中和封面/唱片的 transform 过渡，防止 DOM 销毁瞬间触发缩放闪烁
const neutralizeCoverTransitions = () => {
	const selectors = [
		".music-visualizer__record-cover",
		".music-visualizer__record-cover-image",
		".music-visualizer__record-disc-shell",
		".music-visualizer__record-overlay",
	];
	for (const sel of selectors) {
		for (const el of document.querySelectorAll(sel)) {
			const s = (el as HTMLElement).style;
			s.transition = "none";
			s.transform = "scale(1)";
		}
	}
};

// 导航一开始就用内联样式隐藏可视化层：内联样式不受 swup head-plugin 移除
// 页面级样式表的影响，避免容器替换前封面失去尺寸约束、按原图尺寸放大闪现
const hideVisualizerInline = () => {
	const page = document.querySelector(".music-visualizer-page");
	if (page instanceof HTMLElement) {
		page.style.display = "none";
	}
};

const registerSwupVisitHide = () => {
	if (!window.swup?.hooks) return undefined;
	// visit:start 对锚点点击、程序化 swup.navigate()（主页按钮）和前进/后退都会触发
	return window.swup.hooks.on("visit:start", hideVisualizerInline);
};

onMount(() => {
	// 清除进入页面时可能被误加的离开类：Swup 缓存页面会在点击事件冒泡期间同步挂载组件，
	// 导致本次进入点击被 handleNavClick 误判为离开。这里保证进入后可视化层必然显示。
	document.querySelector(".music-visualizer-page")?.classList.remove("music-visualizer-page--leaving");
	const mgr = window.__fireflyMusic;
	if (!mgr) {
		const waitForMgr = () => {
			if (window.__fireflyMusic) {
				connectAudio();
			} else {
				setTimeout(waitForMgr, 100);
			}
		};
		waitForMgr();
	} else {
		if (!mgr.getState().initialized) {
			mgr.init();
		}
		connectAudio();
	}

	const handleFirstClick = () => {
		audioAnalyzer.resume();
		document.removeEventListener("click", handleFirstClick);
	};
	document.addEventListener("click", handleFirstClick);

	// 离开页面的瞬间直接隐藏可视化层：不依赖 Swup 过渡类，点击站内链接或
	// 浏览器前进/后退（popstate）都会立即触发，杜绝封面放大/残留闪烁。
	const hideVisualizer = () => {
		neutralizeCoverTransitions();
		document.querySelector(".music-visualizer-page")
			?.classList.add("music-visualizer-page--leaving");
	};
	const handleNavClick = (event: MouseEvent) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const anchor = target.closest("a[href]");
		if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
		const href = anchor.getAttribute("href") || "";
		if (href.startsWith("http") || href.startsWith("//")) return;
		if (anchor.target === "_blank") return;
		hideVisualizer();
	};
	document.addEventListener("click", handleNavClick);
	window.addEventListener("popstate", hideVisualizer);

	// 注册 swup 内联隐藏；swup 在页面空闲时才初始化，未就绪则等 swup:enable
	let unregisterSwupHide = registerSwupVisitHide();
	const onSwupEnable = () => {
		unregisterSwupHide = registerSwupVisitHide();
	};
	if (!unregisterSwupHide) {
		document.addEventListener("swup:enable", onSwupEnable, { once: true });
	}

	return () => {
		document.removeEventListener("click", handleFirstClick);
		document.removeEventListener("click", handleNavClick);
		window.removeEventListener("popstate", hideVisualizer);
		document.removeEventListener("swup:enable", onSwupEnable);
		unregisterSwupHide?.();
	};
});

onDestroy(() => {
	// 销毁前同样中和封面过渡（onBeforeUnmount 思路）
	neutralizeCoverTransitions();
	audioAnalyzer.disconnect();
});
</script>

<div class="music-visualizer" style={`background: ${backgroundColor};`}>
	{#if sceneReady}
		<div class="music-visualizer__desktop-layout">
			<VisualizerControls />
			<LyricsOverlay />
		</div>
	{/if}
	<ThreeScene
		{audioAnalyzer}
		{backgroundColor}
		onSceneReady={() => (sceneReady = true)}
	/>
</div>
