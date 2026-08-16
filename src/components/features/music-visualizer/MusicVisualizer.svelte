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

	return () => {
		document.removeEventListener("click", handleFirstClick);
		document.removeEventListener("click", handleNavClick);
		window.removeEventListener("popstate", hideVisualizer);
	};
});

onDestroy(() => {
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
