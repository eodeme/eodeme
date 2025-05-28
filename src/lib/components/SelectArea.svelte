<script lang="ts">
	import { createToggleGroup, melt } from '@melt-ui/svelte';

	import area from '$lib/stores/area.json';
	import { drawPolygon, mapCoordsToLatLng } from '$lib/maps';

	let { map }: { map: kakao.maps.Map | null } = $props();

	const {
		elements: { root, item },
		states: { value }
	} = createToggleGroup({
		type: 'single'
	});

	const rows = [
		{ city: 'jeju', areas: ['제주시', '제주시내', '애월', '한림', '조천', '구좌', '우도'] },
		{
			city: 'seogwipo',
			areas: ['서귀포시', '서귀포시내', '성산', '대정', '안덕', '남원', '표선']
		}
	] as const;

	$effect(() => {
		if (!map) return;
		if (!$value) return;

		if (typeof $value !== 'string')
			throw new Error(`Selected area must be a string, got ${typeof $value}`);

		if ($value in area === false) throw new Error(`Area "${$value}" is not defined in area store`);

		const selectedArea = area[$value as keyof typeof area];
		const { middlePoint } = selectedArea.properties.extends;

		map.setCenter(new kakao.maps.LatLng(middlePoint.latitude, middlePoint.longitude));
		map.setLevel(middlePoint.zoomLevel);

		const { coordinates } = selectedArea.geometry;

		if ($value === '제주시' || $value === '서귀포시') {
			const paths = mapCoordsToLatLng(coordinates);

			// @ts-expect-error
			const polygons = paths.map((path: kakao.maps.LatLng[]) => drawPolygon({ map, path }));

			return () => {
				for (const polygon of polygons) {
					polygon.setMap(null);
				}
			};
		}

		const path = mapCoordsToLatLng(coordinates[0]);

		const polygon = drawPolygon({ map, path });

		return () => {
			polygon.setMap(null);
		};
	});
</script>

<ul
	use:melt={$root}
	class="absolute z-1 space-y-[16px] rounded-br-[8px] bg-white p-[10px_16px]"
	aria-label="지역 선택하기"
>
	{#each rows as row}
		<li class="flex gap-x-[8px]">
			{#each row.areas as areaName}
				<ul>
					<li>
						<button
							class="toggle-item"
							use:melt={$item({ value: areaName, disabled: map === null })}
						>
							{areaName}
						</button>
					</li>
				</ul>
			{/each}
		</li>
	{/each}
</ul>

<style>
	.toggle-item {
		display: grid;
		place-content: center;

		font-size: 16px;
		font-weight: 400;
		line-height: 100%;
		background-color: #f5f5f5;
		border-radius: 8px;
		padding: 8px;

		&:hover {
			background-color: #b9b9b9;
		}

		&[aria-checked='true'] {
			background-color: rgba(44, 44, 44, 1);
			color: white;
		}
	}
</style>
