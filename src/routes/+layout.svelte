<script lang="ts">
	import '../app.css';
	import { initializeMap } from '$lib/maps';
	import { map } from '$lib/stores';

	import { onMount } from 'svelte';
	import SelectArea from '$lib/components/SelectArea.svelte';
	import Toaster from '$lib/components/Toaster.svelte';

	let mapContainer: HTMLMapElement;

	onMount(() => {
		$map = initializeMap(mapContainer);
	});

	let { children } = $props();
</script>

<svelte:head>
	<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey={import.meta.env.VITE_KAKO_API_KEY}"></script>
</svelte:head>

<map bind:this={mapContainer} class="absolute top-0 block h-[100vh] w-[100vw]"></map>
<SelectArea />
<Toaster />
{@render children()}
