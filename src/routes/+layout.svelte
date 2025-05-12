<svelte:head>
    <script src="http://dapi.kakao.com/v2/maps/sdk.js?appkey={import.meta.env.VITE_KAKO_API_KEY}"></script> 
</svelte:head>

<script lang="ts">
	import '../app.css';
	
	import { onMount } from 'svelte';

	let mapContainer: HTMLMapElement;
	let map: kakao.maps.Map;
	

	onMount(() => {
		const options = {
			center: new kakao.maps.LatLng(33.37766874532601, 126.54238118414199),
			level: 9
		};
		map = new kakao.maps.Map(mapContainer, options);

		const mapTypeControl = new kakao.maps.MapTypeControl();
		map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

		const zoomControl = new kakao.maps.ZoomControl();
		map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

		map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true);
	});

	let { children } = $props();
</script>

<map bind:this={mapContainer} class="block absolute top-0 w-[100vw] h-[100vh]"></map>

{@render children()}
