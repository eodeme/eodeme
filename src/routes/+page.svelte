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
		<label for="progress" class="self-end text-[24px] font-[500] mb-[8px] mr-[16px] text-shadow-[0_8px_12px_rgba(0,0,0,0.15),0_4px_4px_rgba(0,0,0,0.30)]">
			{leftTime > 0 ? '⏳' : '⌛'} {leftTime / timer.interval}초 남음
		</label>
	</article>
	<progress id="progress" class="block w-full" value={timer.currentTime} max={timer.maxTime}></progress>
</section>
<style>
#progress {
	background-color: rgba(0, 122, 255, 0.30);
}


#progress::-webkit-progress-bar {
  background-color: rgba(0, 122, 255, 0.30);
  border-radius: 0;
}

#progress::-webkit-progress-value {
  background-color: #007AFF;
  border-radius: 0;
}

#progress::-moz-progress-bar {
  background-color: #007AFF;
}

#progress::-ms-fill {
  background-color: #007AFF;
  border: none;
}
</style>
