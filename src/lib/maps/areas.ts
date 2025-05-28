import areaNameToCode from '$lib/jsons/areaNameToCode.json';
import places from '$lib/jsons/places.json';

export const rows = [
	{ city: 'jeju', areas: ['제주시', '제주시내', '애월', '한림', '조천', '구좌', '우도'] },
	{
		city: 'seogwipo',
		areas: ['서귀포시', '서귀포시내', '성산', '대정', '안덕', '중문', '남원', '표선']
	}
] as const satisfies ReadonlyArray<{
	city: 'jeju' | 'seogwipo';
	areas: ReadonlyArray<AreaName>;
}>;

export function checkIsAvailableArea(areaName: AreaName): boolean {
	const code = areaNameToCode[areaName];
	if (areaName === '제주시' || areaName === '서귀포시') {
		return places.some((place) => place.start.COL_ADM_SE === code.COL_ADM_SE);
	}
	if (!('EMD_CD' in code)) throw new Error(`Invalid area name: ${areaName}`);

	return places.some((place) => place.start.EMD_CD === code.EMD_CD);
}

export function randomChooseAvailablePlace(areaName: AreaName): Place {
	const filteredPlaces = filterAvailablePlaces(areaName);
	if (filteredPlaces.length === 0) throw new Error(`No places available for area "${areaName}"`);

	return filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];
}

function filterAvailablePlaces(areaName: AreaName): ReadonlyArray<Place> {
	const code = areaNameToCode[areaName];
	if (areaName === '제주시' || areaName === '서귀포시') {
		return places.filter((place) => place.start.COL_ADM_SE === code.COL_ADM_SE);
	}
	if (!('EMD_CD' in code)) throw new Error(`Invalid area name: ${areaName}`);

	return places.filter((place) => place.start.EMD_CD === code.EMD_CD);
}
