<script lang="ts">
	import '../app.css';
	import { initializeMap } from '$lib/maps';

	import { onMount } from 'svelte';
	import SelectArea from '$lib/components/SelectArea.svelte';

	let mapContainer: HTMLMapElement;
	let map = $state<kakao.maps.Map | null>(null);

	onMount(() => {
		map = initializeMap(mapContainer);
	});

	let { children } = $props();
</script>

<svelte:head>
	<title>어데메 🔍 - "어데가 있나 찾엉 봅써!"</title>
	<meta
		name="description"
		content="사진과 설명을 통해 제주도내 다양한 장소를 알아보는 미니게임 입니다."
	/>
	<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey={import.meta.env.VITE_KAKO_API_KEY}"></script>
</svelte:head>

<map bind:this={mapContainer} class="absolute top-0 block h-[100vh] w-[100vw]"></map>
<SelectArea {map} />
{@render children()}
