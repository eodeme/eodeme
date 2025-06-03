<script lang="ts">
	import {
		randomChooseAvailablePlace,
		createMarker,
		computeDistanceBetween,
		getOffsetCenterRight
	} from '$lib/maps';
	import { selectedArea, map, markers, openPlaceDetails, timer } from '$lib/stores';
	import { fly } from 'svelte/transition';
	import PlaceDetails from '$lib/components/PlaceDetails.svelte';

	let leftTime = $derived($timer.maxTime - $timer.currentTime);
	let timeIsOut = $derived(leftTime <= 0);

	let randomSelectedPlace = $derived($selectedArea && randomChooseAvailablePlace($selectedArea));
	let selectedPlaceDetails = $state<SelectedPlaceDetails>(null);

	let isFinished = $state<null | boolean>(null);
	let start = $derived(randomSelectedPlace?.start);

	let hintLastIndex = $state(0);
	let currentHit = $derived(start?.hints.slice(0, hintLastIndex) ?? []);

	function addHintIndex() {
		if (start && hintLastIndex < start.hints.length) {
			hintLastIndex += 1;
		}
	}

	type GeneratePlaceDetailsProps = { place: Place; keywords: string[] } & (
		| {
				finished: true;
				leftTime: number;
		  }
		| {
				finished: false;
		  }
	);

	$effect(() => {
		if (!randomSelectedPlace) return () => {};
		if (!$map) return () => {};
		if (isFinished) return () => {};

		const { coordinate } = randomSelectedPlace?.result;

		const clickMapHandler = (event: kakao.maps.event.MouseEvent) => {
			const clickedCoordinate = event.latLng;
			const distance = computeDistanceBetween(coordinate, {
				latitude: clickedCoordinate.getLat(),
				longitude: clickedCoordinate.getLng()
			});

			if (distance <= 1000) {
				isFinished = true;
				const { marker, overlay } = createMarker($map, {
					finished: isFinished,
					leftTime,
					coordinate: randomSelectedPlace.result.coordinate,
					place: randomSelectedPlace
				});

				$openPlaceDetails = true;

				$markers.push(marker);

				$openPlaceDetails = true;
			} else {
				addHintIndex();
			}
		};

		kakao.maps.event.addListener($map, 'click', clickMapHandler);

		return () => {
			kakao.maps.event.removeListener($map, 'click', clickMapHandler);
		};
	});

	$effect(() => {
		if (!start) return () => {};
		if (isFinished !== null) return () => {};

		const interval = setInterval(() => {
			if ($timer.currentTime < $timer.maxTime) {
				$timer.currentTime += $timer.interval;
			}
		}, $timer.interval);

		return () => {
			clearInterval(interval);
		};
	});

	$effect(() => {
		if (!randomSelectedPlace) return () => {};
		if (!$map) return () => {};
		if (leftTime <= 0) {
			setTimeout(() => {
				isFinished = false;

				const { marker } = createMarker($map, {
					finished: isFinished,
					coordinate: randomSelectedPlace.result.coordinate,
					place: randomSelectedPlace
				});

				$markers.push(marker);

				$openPlaceDetails = true;
			});
		}
	});

	openPlaceDetails.subscribe((open) => {
		if (!open) {
			selectedPlaceDetails = null;
			return;
		}

		if (!randomSelectedPlace) throw new Error('No place selected');
		if (!$map) throw new Error('Map is not initialized');

		const placeDetails = generatePlaceDetails({
			place: randomSelectedPlace,
			keywords: randomSelectedPlace.start.keywords,
			...(isFinished ? { finished: true, leftTime } : { finished: false })
		});
		selectedPlaceDetails = placeDetails;

		navigateToPlace($map, randomSelectedPlace);

		function generatePlaceDetails(props: GeneratePlaceDetailsProps): SelectedPlaceDetails {
			return {
				...props.place.result,
				...(props.finished
					? { finished: props.finished, leftTime: props.leftTime }
					: { finished: false }),
				picture: props.place.start.picture,
				keywords: props.place.start.keywords
			};
		}

		function navigateToPlace(map: kakao.maps.Map, place: Place) {
			const center = new kakao.maps.LatLng(
				place.result.coordinate.latitude,
				place.result.coordinate.longitude
			);
			map.setLevel(3, { anchor: center });

			const offsetCenter = getOffsetCenterRight(center, map.getBounds());
			map.setCenter(offsetCenter);
		}
	});
</script>

{#if start}
	<div
		class="absolute right-[15px] bottom-[85px] mr-[16px] mb-[18px] flex flex-col-reverse gap-[8px]"
	>
		{#each currentHit as hint}
			<h2
				class="shadow-[0_4px_8px_rgba(0, 0, 0, 0.3)] z-2 max-w-[360px] bg-black p-[16px] font-[14px] text-white"
				transition:fly={{
					y: 30,
					duration: 200
				}}
			>
				{hint}
			</h2>
		{/each}
	</div>

	<img
		class="absolute bottom-[16px] left-[0] z-1 w-[466px] rounded-tr-[8px]"
		src={start.picture}
		alt="hintImage"
	/>
	<div
		class="absolute bottom-[16px] left-[466px] z-1 flex max-w-[406px] flex-col gap-[8px] text-[16px] font-[500] text-white"
	>
		<p class="bg-black p-[16px]">
			키워드: {start.keywords.join(', ')}
		</p>
		<p class="bg-black p-[16px]">
			{start.description}
		</p>
	</div>
	<label
		data-time-is-out={timeIsOut}
		for="progress"
		class="absolute right-[14px] bottom-[18px] z-1 mr-[16px] mb-[8px] self-end text-[24px] font-[500] text-shadow-[0_8px_12px_rgba(0,0,0,0.15),0_4px_4px_rgba(0,0,0,0.30)]"
	>
		{leftTime > 0 ? '⏳' : '⌛'}
		{leftTime / $timer.interval}초 남음
	</label>
	<progress
		id="progress"
		class="absolute bottom-[0] z-1 block w-full"
		value={$timer.currentTime}
		max={$timer.maxTime}
		data-time-is-out={timeIsOut}
	></progress>
{/if}

<PlaceDetails place={selectedPlaceDetails} />

<style>
	#progress {
		background-color: rgba(0, 122, 255, 0.3);
	}

	#progress::-webkit-progress-bar {
		background-color: rgba(0, 122, 255, 0.3);
		border-radius: 0;
	}

	#progress::-webkit-progress-value {
		background-color: #007aff;
		border-radius: 0;
	}

	#progress::-moz-progress-bar {
		background-color: #007aff;
	}

	#progress::-ms-fill {
		background-color: #007aff;
		border: none;
	}

	label[data-time-is-out='true'] {
		animation: tilt-n-move-shaking 0.25s linear infinite;
	}

	progress[data-time-is-out='true'] {
		animation: tilt-shaking 0.25s linear infinite;
	}

	@keyframes tilt-shaking {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(2deg);
		}
		50% {
			transform: rotate(0eg);
		}
		75% {
			transform: rotate(-2deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	@keyframes tilt-n-move-shaking {
		0% {
			transform: translate(0, 0) rotate(0deg);
		}
		25% {
			transform: translate(5px, 5px) rotate(5deg);
		}
		50% {
			transform: translate(0, 0) rotate(0eg);
		}
		75% {
			transform: translate(-5px, 5px) rotate(-5deg);
		}
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
	}
</style>
