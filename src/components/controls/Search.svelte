<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { navigateToPage } from "@utils/navigation-utils";
import { onMount } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import type { SearchResult } from "@/global";
import { FLOATING_PANEL_CLOSE_EVENT } from "@/utils/floating-panel-utils";
import { url as formatUrl, getSearchUrl } from "@/utils/url-utils";

// --- State ---
let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let initialized = false;
let debounceTimer: NodeJS.Timeout;
let searchRequestId = 0;

// --- Mocks for Dev Mode ---
const fakeResult: SearchResult[] = [
	{
		url: formatUrl("/"),
		meta: { title: "This Is a Fake Search Result" },
		excerpt:
			"Because Pagefind cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: formatUrl("/"),
		meta: { title: "If You Want to Test the Search" },
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

// --- UI Logic ---
// pagefind.js 是按需加载的（见 Navbar.astro），搜索 UI 一被碰到就触发。
// 幂等，重复调用只会拿到同一个 promise。
const requestPagefind = (): void => {
	window.__loadPagefind?.();
};

const getPanel = (): HTMLElement | null =>
	document.getElementById("search-panel");

const togglePanel = (): void => {
	requestPagefind();
	const panel = getPanel();
	if (!panel) return;
	const willOpen = panel.classList.contains("float-panel-closed");
	panel.classList.toggle("float-panel-closed");
	if (willOpen) {
		// 展开后聚焦输入框，方便直接输入
		requestAnimationFrame(() => {
			document.getElementById("search-input")?.focus();
		});
	} else {
		keyword = "";
		result = [];
	}
};

const setPanelVisibility = (show: boolean): void => {
	const panel = getPanel();
	if (!panel || !keyword) return;
	show
		? panel.classList.remove("float-panel-closed")
		: panel.classList.add("float-panel-closed");
};

const closeSearchPanel = (): void => {
	getPanel()?.classList.add("float-panel-closed");
	keyword = "";
	result = [];
};

const cancelPendingSearch = (): void => {
	clearTimeout(debounceTimer);
	searchRequestId += 1;
	isSearching = false;
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeSearchPanel();
	navigateToPage(url);
};

// --- Core Search Logic ---
const search = async (kw: string): Promise<void> => {
	if (!kw) {
		cancelPendingSearch();
		setPanelVisibility(false);
		result = [];
		return;
	}
	if (!initialized) return;

	clearTimeout(debounceTimer);
	const requestId = ++searchRequestId;
	isSearching = true;

	debounceTimer = setTimeout(async () => {
		try {
			let searchResults: SearchResult[] = [];

			if (import.meta.env.PROD && window.pagefind) {
				const response = await window.pagefind.search(kw);
				searchResults = await Promise.all(
					response.results.map((item) => item.data()),
				);
			} else if (import.meta.env.DEV) {
				searchResults = fakeResult;
			}

			if (requestId !== searchRequestId) return;

			result = searchResults;
			setPanelVisibility(true);
		} catch (error) {
			if (requestId !== searchRequestId) return;

			console.error("Search error:", error);
			result = [];
			setPanelVisibility(false);
		} finally {
			if (requestId === searchRequestId) {
				isSearching = false;
			}
		}
	}, 300); // 300ms debounce
};

// --- Initialization onMount ---
onMount(() => {
	// 将面板挂到导航栏根节点：椭圆框的 backdrop-filter 会把绝对定位子元素的包含块
	// 限制在椭圆框内部，导致弹窗出现在搜索图标下方而非导航栏中央。
	// 挂到 #navbar 后，包含块变为定位的 #top-row，left-1/2 即可水平居中。
	// 面板默认隐藏，挂载过程无可见跳动。
	const panelHost = getPanel();
	const navbarRoot = document.getElementById("navbar");
	if (panelHost && navbarRoot && panelHost.parentElement !== navbarRoot) {
		navbarRoot.appendChild(panelHost);
	}

	const initializePagefind = () => {
		initialized = true;
		if (keyword) search(keyword);
	};

	if (import.meta.env.DEV) {
		console.log("Pagefind mock enabled in development mode.");
		initializePagefind();
	} else {
		if (window.pagefind) {
			// If script already loaded
			initializePagefind();
		} else {
			// Listen for the event
			document.addEventListener("pagefindready", initializePagefind, {
				once: true,
			});
			document.addEventListener("pagefindloaderror", initializePagefind, {
				once: true,
			});
		}
	}

	const panel = getPanel();
	panel?.addEventListener(FLOATING_PANEL_CLOSE_EVENT, cancelPendingSearch);

	// 点击页面空白处收起搜索面板
	const handleDocumentClick = (event: MouseEvent): void => {
		const p = getPanel();
		if (!p || p.classList.contains("float-panel-closed")) return;
		const target = event.target;
		if (target instanceof Node && p.contains(target)) return;
		const trigger = document.getElementById("search-switch");
		if (trigger && target instanceof Node && trigger.contains(target)) return;
		closeSearchPanel();
	};
	document.addEventListener("click", handleDocumentClick);

	return () => {
		panel?.removeEventListener(FLOATING_PANEL_CLOSE_EVENT, cancelPendingSearch);
		document.removeEventListener("pagefindready", initializePagefind);
		document.removeEventListener("pagefindloaderror", initializePagefind);
		document.removeEventListener("click", handleDocumentClick);
		cancelPendingSearch();
	};
});

// --- Reactive Statements ---
$: if (initialized) {
	search(keyword);
}
</script>

<!-- 放大镜按钮：所有端共用，点击展开/收起搜索面板 -->
<button on:click={togglePanel} aria-label="Search Panel" aria-controls="search-panel" aria-expanded="false" id="search-switch"
		class="btn-plain scale-animation rounded-lg w-9 h-9 md:w-11 md:h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- 搜索面板：导航栏正下方居中弹出 -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute top-[clamp(6.5rem,17vh,11rem)] left-1/2 -translate-x-1/2 w-[min(88vw,20rem)] shadow-2xl rounded-2xl p-2"
     data-floating-panel data-floating-panel-trigger="search-switch" inert aria-hidden="true">

    <!-- 面板内搜索输入框 -->
    <div id="search-bar-inside" class="flex relative items-center h-10 rounded-xl
      bg-black/4 hover:bg-black/6 focus-within:bg-black/6
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search"
              class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input id="search-input" placeholder={i18n(I18nKey.search)} bind:value={keyword}
               on:focus={requestPagefind}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               text-black/50 dark:text-white/50"
        >
    </div>

    <!-- search results -->
    {#if isSearching}
        <div class="transition first-of-type:mt-2 block rounded-xl text-lg px-3 py-2 text-50">
            {i18n(I18nKey.searchLoading)}
        </div>
    {:else if keyword && result.length > 0}
        {#each result.slice(0, 5) as item}
            <a href={item.url}
               on:click={(e) => handleResultClick(e, item.url)}
               class="transition first-of-type:mt-2 group block
           rounded-xl text-lg px-3 py-2 hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active)">
                <div class="transition text-90 inline-flex font-bold group-hover:text-(--primary)">
                    {@html item.meta.title}
                    <Icon icon="fa7-solid:chevron-right"
                          class="transition text-[0.75rem] translate-x-1 my-auto text-(--primary)"></Icon>
                </div>
                {#if item.excerpt.includes('<mark>')}
                    <div class="transition text-sm text-50" style="display: flex; align-items: flex-start; margin-top: 0.1rem">
                        <div>
                            {@html item.excerpt}
                        </div>
                    </div>
                {/if}

                {#if item.content && item.content.includes('<mark>')}
                    <div class="transition text-sm text-30" style="display: flex; align-items: flex-start; margin-top: 0.1rem">
                        <span style="display: inline-block; background-color: var(--btn-plain-bg-active); color: var(--primary); padding: 0.1em 0.4em; border-radius: 5px; font-size: 0.75em; font-weight: 600; margin-right: 0.5em; shrink: 0;">
                            {i18n(I18nKey.searchContent)}
                        </span>
                        <div>
                            {@html item.content}
                        </div>
                    </div>
                {/if}
            </a>
        {/each}
        {#if result.length > 5}
            <a href={getSearchUrl(keyword)}
               on:click={(e) => handleResultClick(e, getSearchUrl(keyword))}
               class="transition first-of-type:mt-2 group block rounded-xl text-lg px-3 py-2 hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active) text-(--primary) font-bold text-center">
                <span class="inline-flex items-center">
                    {i18n(I18nKey.searchViewMore).replace('{count}', (result.length - 5).toString())}
                    <Icon icon="fa7-solid:arrow-right" class="transition text-[0.75rem] ml-1"></Icon>
                </span>
            </a>
        {/if}
    {:else if keyword && result.length === 0}
        <div class="transition first-of-type:mt-2 block rounded-xl text-lg px-3 py-2 text-50">
            {i18n(I18nKey.searchNoResults)}
        </div>
    {/if}
</div>

<style>
    input:focus {
        outline: 0;
    }

    .search-panel {
        max-height: calc(100vh - 100px);
        overflow-y: auto;
        /* 展开/收起过渡动画：淡入淡出 + 轻微上下滑动 */
        transition:
            opacity 0.22s ease,
            translate 0.22s ease;
    }

    .search-panel.float-panel-closed {
        --tw-translate-y: -0.75rem;
    }
</style>