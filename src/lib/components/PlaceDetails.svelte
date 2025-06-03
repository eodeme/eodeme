<script lang="ts">
	import { openPlaceDetails, timer } from '$lib/stores';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { fade, scale } from 'svelte/transition';

	type PlaceDetailsProps = { place: SelectedPlaceDetails };

	let { place }: PlaceDetailsProps = $props();

	const {
		elements: { portalled, overlay, content, title, description, close },
		states: { open }
	} = createDialog({ open: openPlaceDetails });
</script>

{#if $open && place}
	<div class="" use:melt={$portalled}>
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		></div>
		<div
			class="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[390px]
            max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-t-[8px] bg-white
            shadow-lg"
			transition:scale={{
				duration: 150,
				start: 0.96
			}}
			use:melt={$content}
		>
			<img
				src={place.picture}
				alt={place.placeName}
				class="h-[260px] w-full rounded-[inherit] object-cover"
			/>
			<article class="p-[8px_16px] leading-[130%]">
				<header class="flex items-center justify-between">
					<h1 use:melt={$title} class="m-0 text-[24px] font-[700] text-black">
						{place.placeName}
					</h1>
					{#if place.finished}
						<p use:melt={$description}>
							⏳ {place.leftTime / $timer.interval}초만에 맞춤
						</p>
					{:else}
						<p use:melt={$description}>⌛ 시간 초과</p>
					{/if}
				</header>
				<p class="m-[16px_0] truncate text-sm">
					{#each place.keywords as keyword, index}
						{'#'}{keyword}{index < place.keywords.length - 1 ? ', ' : ''}
					{/each}
				</p>
				<p></p>
				<dl class="grid grid-cols-[24px_1fr] gap-1 gap-y-[16px]">
					<dt><span aria-label="주소">📍</span></dt>
					<dd>{place.address}</dd>
					<dt><span aria-label="장소 정보">🌐</span></dt>
					<dd>
						<a href={place.outlink.visitjeju} target="_blank" rel="noopener"
							>{place.placeName} - 비짓제주 (https://www.visitjeju.net)</a
						>
					</dd>
					<!-- TODO: 장소 퍼머링크 구현하기 예) https://eodeme.github.io/?placeId=~~~ => 결과 모달 UI가 바로 나옴 -->
					<!-- <dt>🔗</dt> -->
					<!-- <dd></dd> -->
					<dt><span aria-label="아웃 링크">🗺️</span></dt>
					<dd>
						<a href={place.outlink.kakaoMap} target="_blank" rel="noopener">카카오 맵</a> |
						<a href={place.outlink.naverMap} target="_blank" rel="noopener">네이버 맵</a> 아웃링크
					</dd>
				</dl>
			</article>
		</div>
	</div>
{/if}
