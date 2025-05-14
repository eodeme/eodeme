const maxTime = 60 * 1000; // 1 minute

type TimerState = {
	readonly maxTime: number;
	readonly interval: number;
	currentTime: number;
};

export const timer = $state<TimerState>({
	maxTime,
	interval: 1000,
	currentTime: 0
});
