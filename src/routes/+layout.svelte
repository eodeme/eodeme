<script lang="ts">
	import '../app.css';
	import mapData from '../assets/LSMD_ADM_SECT_UMD_50_202505.json';

	import { onMount } from 'svelte';

	let mapContainer: HTMLMapElement;
	let map: kakao.maps.Map;
	let customOverlay: kakao.maps.CustomOverlay;
	let infowindow: kakao.maps.InfoWindow;

	interface Area {
		name: string;
		path: kakao.maps.LatLng[] | kakao.maps.LatLng[][];
	}

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
			content: `<article class="w-[128px] h-[139.6px] flex flex-col items-center bg-gray-200 rounded shadow-md">
					<img src="/images/hintPicture.png" alt="overlay image" class="w-full rounded-t-lg" />
					<div class="font-medium flex flex-col items-center p-[5px]">
						<div class="text-[10px] p-[2px]">새별오름</div>
						<button class="text-[10px] p-[2px] bg-white w-[110px]">자세히보기</button>
					</div>
				</article>`,
			position: marker.getPosition(),
			yAnchor: 1.3
		});

		customOverlay = new kakao.maps.CustomOverlay({});
		infowindow = new kakao.maps.InfoWindow({ removable: true });

		const areas: Area[] = mapData.features.map((features) => {
			const coordinates = features.geometry.coordinates[0];
			const name = features.properties.EMD_NM;

			return {
				name,
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
			displayArea(area);
		}
	});

	// 다각형을 생상하고 이벤트를 등록하는 함수입니다
	function displayArea(area: Area) {
		// 다각형을 생성합니다
		const polygon = new kakao.maps.Polygon({
			map: map, // 다각형을 표시할 지도 객체
			path: area.path,
			strokeWeight: 2,
			strokeColor: '#004c80',
			strokeOpacity: 0.8,
			fillColor: '#fff',
			fillOpacity: 0.7
		});

		// 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
		// 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
		kakao.maps.event.addListener(
			polygon,
			'mouseover',
			function (mouseEvent: kakao.maps.event.MouseEvent) {
				polygon.setOptions({ fillColor: '#09f' });

				customOverlay.setContent('<div class="area">' + area.name + '</div>');

				customOverlay.setPosition(mouseEvent.latLng);
				customOverlay.setMap(map);
			}
		);

		// 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
		kakao.maps.event.addListener(
			polygon,
			'mousemove',
			function (mouseEvent: kakao.maps.event.MouseEvent) {
				customOverlay.setPosition(mouseEvent.latLng);
			}
		);

		// 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
		// 커스텀 오버레이를 지도에서 제거합니다
		kakao.maps.event.addListener(polygon, 'mouseout', function () {
			polygon.setOptions({ fillColor: '#fff' });
			customOverlay.setMap(null);
		});

		// 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
		kakao.maps.event.addListener(
			polygon,
			'click',
			function (mouseEvent: kakao.maps.event.MouseEvent) {
				var content =
					'<div class="info">' +
					'   <div class="title">' +
					area.name +
					'</div>' +
					'   <div class="size">총 면적 : 약 ' +
					Math.floor(polygon.getArea()) +
					' m<sup>2</sup></div>' +
					'</div>';

				infowindow.setContent(content);
				infowindow.setPosition(mouseEvent.latLng);
				infowindow.open(map);
			}
		);
	}

	let { children } = $props();
</script>

<svelte:head>
	<script
		src="http://dapi.kakao.com/v2/maps/sdk.js?appkey={import.meta.env.VITE_KAKO_API_KEY}"
	></script>
</svelte:head>

<map bind:this={mapContainer} class="absolute top-0 block h-[100vh] w-[100vw]"></map>

{@render children()}
