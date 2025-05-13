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

		const markerSize = 32;
		const markerImage = new kakao.maps.MarkerImage(
			'/images/🏁.png',
			new kakao.maps.Size(markerSize, markerSize),
			{
				offset: new kakao.maps.Point(16, 32)
			}
		);

		const marker = new kakao.maps.Marker({
			image: markerImage,
			position: map.getCenter()
		});
		marker.setMap(map);

		const overlay = new kakao.maps.CustomOverlay({
			map,
			content: `<article class="w-[128px] bg-white text-black">
					<img src="/images/hintPicture.png" alt="overlay image" class="" />
					<div>
						<div class="">새별오름</div>
						<button class="">자세히보기</button>
					</div>
				</article>`,
			position: marker.getPosition(),
			yAnchor: 1.3
		});

		kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
			const latlng = mouseEvent.latLng;

			if (latlng) {
				marker.setPosition(latlng);
				overlay.setPosition(latlng);
			}
		});
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
