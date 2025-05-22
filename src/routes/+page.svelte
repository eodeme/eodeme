<script lang="ts">
	import { timer } from '../states/timer.svelte';

	let leftTime = $derived(timer.maxTime - timer.currentTime);
	let timeIsOut = $derived(leftTime <= 0);

	$effect(() => {
		const disableTimer = new URLSearchParams(window.location.search).get('disableTimer') === 'true';
		if (disableTimer) return () => {};

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

	let allHint = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	let currentHintLastIndex = $state(4);

	let currentHit = $derived(allHint.slice(0, currentHintLastIndex + 1));
</script>

<!-- 선언적 표현 -->
{#each currentHit as hint}
	<h2 class="z-2">
		{hint}
	</h2>
{/each}

<section class="absolute bottom-0 left-0 z-1 w-full">
	<article class="flex w-full justify-between">
		<div class="flex">
			<img class="w-[466px] rounded-tr-[8px]" src="/images/hintPicture.png" alt="hintImage" />
			<div class="flex max-w-[406px] flex-col gap-[8px] self-end text-[16px] font-[500] text-white">
				<p class="bg-black p-[16px]">
					키워드: 일몰, 일출, 산, 해변, 걷기/등산, 가을, 자연경관, 수국
				</p>
				<p class="bg-black p-[16px]">
					바닷가에 불끈 솟은 산이다. 99개의 작은 봉우리가 모여있다. 2개의 분화구가 존재하는
					화산지형이다.
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
