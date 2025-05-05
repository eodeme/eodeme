<script>
	import Checkbox from "$lib/components/Checkbox.svelte";

	let checked = $state(false);

</script>
<h1>Welcome</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev</a></p>

<Checkbox {checked} on:change={() => {
	checked = !checked;
}} />
<Checkbox  />
<Checkbox {checked} disabled />
<Checkbox  />
<Checkbox {checked} />
<Checkbox  />
