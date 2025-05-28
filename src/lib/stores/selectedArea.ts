import { writable } from 'svelte/store';
export const selectedArea = writable<AreaName | undefined>(undefined);
