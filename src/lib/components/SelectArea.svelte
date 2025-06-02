<script lang="ts">
	import { createToggleGroup, melt } from '@melt-ui/svelte';

	import area from '$lib/jsons/area.json';
	import { drawPolygon, mapCoordsToLatLng, rows, checkIsAvailableArea } from '$lib/maps';
	import { selectedArea, map } from '$lib/stores';

	const {
		elements: { root, item },
		states: { value }
	} = createToggleGroup({
		type: 'single',
		value: selectedArea
	});

	$effect(() => {
		if (!$map) return;
		if (!$value) return;

		if (typeof $value !== 'string')
			throw new Error(`Selected area must be a string, got ${typeof $value}`);

		if ($value in area === false) throw new Error(`Area "${$value}" is not defined in area store`);

		const { properties, geometry } = area[$value as AreaName];
		const { middlePoint } = properties.extends;

		$map.setCenter(new kakao.maps.LatLng(middlePoint.latitude, middlePoint.longitude));
		$map.setLevel(middlePoint.zoomLevel);

		const { coordinates } = geometry;

		if ($value === '제주시' || $value === '서귀포시') {
			const paths = mapCoordsToLatLng(coordinates);

			// @ts-expect-error
			const polygons = paths.map((path: kakao.maps.LatLng[]) => drawPolygon({ map: $map, path }));

			return () => {
				for (const polygon of polygons) {
					polygon.setMap(null);
				}
			};
		}

		const path = mapCoordsToLatLng(coordinates[0]);

		const polygon = drawPolygon({ map: $map, path });

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
							data-disabled={$selectedArea === areaName}
							disabled={checkIsAvailableArea(areaName) === false ||
								($value !== undefined && $value !== areaName)}
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

		&[disabled] {
			background-color: #e0e0e0;
			color: #9e9e9e;
		}

		&[aria-checked='true'] {
			background-color: rgba(44, 44, 44, 1);
			color: white;
		}
	}
</style>
