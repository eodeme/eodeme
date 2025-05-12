<script>
	import { timer } from "../states/timer.svelte";

	let leftTime = $derived(timer.maxTime - timer.currentTime);

	$effect(() => {
		const interval = setInterval(() => {
			if (timer.currentTime >= timer.maxTime) {
				alert("시간이 다 되었습니다.");
				clearInterval(interval);
				return;
			}

			timer.currentTime += timer.interval;
		}, timer.interval);

		return () => {
			clearInterval(interval);
		};
	});

</script>

<section class="absolute left-0 bottom-0 w-full z-1">
	<article class="flex w-full justify-between">
		<div class="flex">
			<img class="w-[466px] rounded-tr-[8px]" src="/images/hintPicture.png" alt="hintImage" />
			<div class="self-end flex flex-col gap-[8px] text-[16px] text-white max-w-[406px] font-[500]">
				<p class="bg-black p-[16px]">키워드: 일몰, 일출, 산, 해변, 걷기/등산, 가을, 자연경관, 수국</p>
				<p class="bg-black p-[16px]">바닷가에 불끈 솟은 산이다. 99개의 작은 봉우리가 모여있다. 
					2개의 분화구가 존재하는 화산지형이다.</p>
			</div>
		</div>
		<label for="progress" class="self-end text-[16px] font-[500]">
			<p class="p-[16px] text-[24px]">{leftTime > 0 ? '⏳' : '⌛'} {leftTime / timer.interval}초 남음</p>
		</label>
	</article>
	<progress id="progress" class="appearance-none h-[16px] block w-full [&::-webkit-progress-bar]:[rgba(0, 122, 255, 0.30)] [&::-webkit-progress-value]:[#007AFF]" value={timer.currentTime} max={timer.maxTime}></progress>
</section>
<style>
</style>
