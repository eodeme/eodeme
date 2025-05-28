<script lang="ts">
	import { getContext } from 'svelte';
	import { timer } from '../states/timer.svelte';
	import { randomChooseAvailablePlace } from '$lib/maps/areas';
	import { selectedArea } from '$lib/stores/selectedArea';

	let leftTime = $derived(timer.maxTime - timer.currentTime);
	let timeIsOut = $derived(leftTime <= 0);

	let selectedPlace = $derived($selectedArea && randomChooseAvailablePlace($selectedArea));

	let hintLastIndex = $state(0);
	let start = $derived(selectedPlace?.start);
	let currentHit = $derived(start?.hints.slice(0, hintLastIndex + 1) ?? []);

	$effect(() => {
		if (!start) return () => {};

		const interval = setInterval(() => {
			if (timer.currentTime < timer.maxTime) {
				timer.currentTime += timer.interval;
			}
		}, timer.interval);

		return () => {
			clearInterval(interval);
		};
	});

	$effect(() => {
		if (leftTime <= 0) {
			setTimeout(() => {
				alert('시간이 초과되었습니다.');
				timer.currentTime = 0;
			});
		}
	});
</script>

{#if start}
	{#each currentHit as hint}
		<h2 class="z-2">
			{hint}
		</h2>
	{/each}

	<section class="absolute bottom-0 left-0 z-1 w-full">
		<article class="flex w-full justify-between">
			<div class="flex">
				<img class="w-[466px] rounded-tr-[8px]" src={start.picture} alt="hintImage" />
				<div
					class="flex max-w-[406px] flex-col gap-[8px] self-end text-[16px] font-[500] text-white"
				>
					<p class="bg-black p-[16px]">
						키워드: {start.keywords.join(', ')}
					</p>
					<p class="bg-black p-[16px]">
						{start.description}
					</p>
				</div>
			</div>
			<label
				data-time-is-out={timeIsOut}
				for="progress"
				class="mr-[16px] mb-[8px] self-end text-[24px] font-[500] text-shadow-[0_8px_12px_rgba(0,0,0,0.15),0_4px_4px_rgba(0,0,0,0.30)]"
			>
				{leftTime > 0 ? '⏳' : '⌛'}
				{leftTime / timer.interval}초 남음
			</label>
		</article>
		<progress
			id="progress"
			class="block w-full"
			value={timer.currentTime}
			max={timer.maxTime}
			data-time-is-out={timeIsOut}
		></progress>
	</section>
{/if}

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
