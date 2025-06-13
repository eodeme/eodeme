import { writable } from 'svelte/store';

export const selectedArea = writable<AreaName | undefined>(undefined);
export const map = writable<kakao.maps.Map | undefined>(undefined);
export const playedPlaces = writable<{ EMD_CD: string }[]>([]);
export const openPlaceDetails = writable(false);

const maxTime = 10 * 1000;

type TimerState = {
	readonly maxTime: number;
	readonly interval: number;
	currentTime: number;
};

export const timer = writable<TimerState>({
	maxTime,
	interval: 1000,
	currentTime: 0
});
