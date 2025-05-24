<script lang="ts">
	import '../app.css';
	import { initializeMap } from '$lib/maps';
	import mapData from '../assets/LSMD_ADM_SECT_UMD_50_202505.json';

	import { onMount } from 'svelte';
	import { drawPolygon } from '$lib/maps/polygon';

	let mapContainer: HTMLMapElement;

	onMount(() => {
		const map = initializeMap(mapContainer);

		const areaNameOverlay = new kakao.maps.CustomOverlay({});

		const areas = mapData.features.map((features) => {
			const coordinates = features.geometry.coordinates[0];

			return {
				name: features.properties.EMD_NM,
				path: Array.isArray(coordinates[0][0])
					? (coordinates as number[][][]).map((ring: number[][]) =>
							ring.map((coord: number[]) => new kakao.maps.LatLng(coord[1], coord[0]))
						)
					: (coordinates as number[][]).map(
							(coord: number[]) => new kakao.maps.LatLng(coord[1], coord[0])
						)
			};
		});
		for (const area of areas) {
			drawPolygon({ map, area, overlay: areaNameOverlay });
		}
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
