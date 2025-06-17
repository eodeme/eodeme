<script lang="ts" context="module">
	import { createToaster, melt } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	export type ToastData = {
		title: string;
		description: string;
		color: string;
	};

	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

	export const addToast = helpers.addToast;
</script>

<div
	class="absolute right-[15px] bottom-[85px] mr-[16px] mb-[18px] flex flex-col-reverse gap-[8px]"
	use:portal
>
	{#each $toasts as { id, data } (id)}
		<header
			class="shadow-[0_4px_8px_rgba(0, 0, 0, 0.3)] z-2 flex max-w-[380px] gap-1 bg-black p-[16px] font-[12px] text-white"
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, y: 30 }}
			out:fly={{ duration: 150, y: 30 }}
		>
			<h3 use:melt={$title(id)}>
				{@html data.title}
			</h3>
			<p use:melt={$description(id)}>
				{data.description}
			</p>
		</header>
	{/each}
</div>
