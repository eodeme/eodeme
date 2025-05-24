<script lang="ts">
	import '../app.css';
	import { initializeMap } from '$lib/maps';

	import { onMount } from 'svelte';

	let mapContainer: HTMLMapElement;

	onMount(() => {
		const map = initializeMap(mapContainer);
	});

	let { children } = $props();
</script>

<svelte:head>
	<script
		src="http://dapi.kakao.com/v2/maps/sdk.js?appkey={import.meta.env.VITE_KAKO_API_KEY}"
	></script>
</svelte:head>

<map bind:this={mapContainer} class="absolute top-0 block h-[100vh] w-[100vw]"></map>

{@render children()}
