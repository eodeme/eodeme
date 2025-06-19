<script lang="ts">
	import {
		randomChooseAvailablePlace,
		createMarker,
		computeDistanceBetween,
		getOffsetCenterRight,
		retrieveDefaultLatLngAndLevel
	} from '$lib/maps';
	import { selectedArea, map, playedPlacesAddresses, openPlaceDetails, timer } from '$lib/stores';

	import PlaceDetails from '$lib/components/PlaceDetails.svelte';
	import { addToast } from '$lib/components/Toaster.svelte';

	let leftTime = $derived($timer.maxTime - $timer.currentTime);
	let timeIsOut = $derived(leftTime <= 0);

	let randomSelectedPlace = $derived(
		$selectedArea && randomChooseAvailablePlace($selectedArea, $playedPlacesAddresses)
	);
	let selectedByOverlayPlace = $state<(Place & { leftTime: number }) | null>(null);
	let selectedPlaceDetails = $state<SelectedPlaceDetails>(null);

	let isFinished = $state<null | boolean>(null);
	let start = $derived(randomSelectedPlace?.start);

	let hintLastIndex = $state(0);

	function addHintIndex() {
		if (start && hintLastIndex < start.hints.length) {
			const description = start.hints[hintLastIndex];
			addToast({
				data: {
					title: '<span aria-label="힌트">💡</span>',
					description,
					color: '#fff'
				}
			});
			hintLastIndex += 1;
		}
	}

	type GeneratePlaceDetailsProps = { place: Place; keywords: string[] } & {
		leftTime: number;
	};

	let preventClickMapHandler = $state(false);

	$effect(() => {
		if (!randomSelectedPlace) return () => {};
		if (!$map) return () => {};
		if (isFinished) return () => {};

		const { coordinate } = randomSelectedPlace.result;

		const clickMapHandler = (event: kakao.maps.event.MouseEvent) => {
			setTimeout(() => {
				if (!$map) throw new Error('Map is not initialized');
				if (!randomSelectedPlace) throw new Error('No place selected');

				if (preventClickMapHandler) {
					preventClickMapHandler = false;
					return;
				}

				const clickedCoordinate = event.latLng;
				const distance = computeDistanceBetween(coordinate, {
					latitude: clickedCoordinate.getLat(),
					longitude: clickedCoordinate.getLng()
				});

				if (distance <= 1000) {
					isFinished = true;
					const created = createMarker($map, {
						finished: isFinished,
						leftTime,
						coordinate: randomSelectedPlace.result.coordinate,
						onClickOverlay: openPlaceDetailsHandler({
							place: randomSelectedPlace,
							leftTime
						}),
						place: randomSelectedPlace
					});

					$openPlaceDetails = true;

					$playedPlacesAddresses.push(randomSelectedPlace.result.address);
				} else {
					addHintIndex();
				}
			});
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

				const created = createMarker($map, {
					finished: isFinished,
					coordinate: randomSelectedPlace.result.coordinate,
					place: randomSelectedPlace,
					onClickOverlay: openPlaceDetailsHandler({
						place: randomSelectedPlace,
						leftTime
					})
				});
				$playedPlacesAddresses.push(randomSelectedPlace.result.address);

				$openPlaceDetails = true;
			});
		}
	});

	function openPlaceDetailsHandler({ place, leftTime }: { place: Place; leftTime: number }) {
		return () => {
			if (start) {
				preventClickMapHandler = true;
				addToast({
					data: {
						title: '🛑',
						description: '진행 중엔 다른 장소의 세부정보를 볼 수 없습니다.',
						color: '#fff'
					}
				});
				return;
			}
			selectedByOverlayPlace = { ...place, leftTime };

			$openPlaceDetails = true;
		};
	}

	$effect(() => {
		if ($selectedArea === undefined) {
			resetToStartState();
		}
	});

	openPlaceDetails.subscribe((open) => {
		if (!$map) return;

		if (!open && $playedPlacesAddresses.length === 0) return;

		if (!open && $playedPlacesAddresses.length > 0) {
			resetToStartState();
			return;
		}

		const isOpenByOverlay = $selectedArea === undefined;

		const place = (() => {
			if (isOpenByOverlay) {
				if (!selectedByOverlayPlace)
					throw new Error('selectedByOverlayPlace is null when opening PlaceDetails');

				return selectedByOverlayPlace;
			}

			if (!randomSelectedPlace)
				throw new Error('randomSelectedPlace is null when opening PlaceDetails');

			return { ...randomSelectedPlace, leftTime };
		})();

		const placeDetails = generatePlaceDetails({
			place,
			keywords: place.start.keywords,
			leftTime: place.leftTime
		});
		selectedPlaceDetails = placeDetails;

		navigateToPlace($map, place);

		function generatePlaceDetails(props: GeneratePlaceDetailsProps): SelectedPlaceDetails {
			return {
				...props.place.result,
				leftTime: props.leftTime,
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

	function resetToStartState() {
		if (!$map) return;

		$selectedArea = undefined;
		const { center, level } = retrieveDefaultLatLngAndLevel();
		$map.setCenter(center);
		$map.setLevel(level);

		selectedPlaceDetails = null;
		isFinished = null;
		hintLastIndex = 0;
		$timer.currentTime = 0;
	}
</script>

{#if start}
	<img
		class="absolute bottom-[16px] left-[0] z-1 h-[350px] w-[466px] rounded-tr-[8px] object-cover"
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
