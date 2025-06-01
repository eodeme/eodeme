import { writable } from 'svelte/store';

export const selectedArea = writable<AreaName | undefined>(undefined);
export const map = writable<kakao.maps.Map | undefined>(undefined);
export const markers = writable<kakao.maps.CustomOverlay[]>([]);
