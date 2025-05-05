<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { checked = false, disabled = false, label = '' } = $props();

  function handleChange() {
    if (!disabled) {
      checked = !checked;
      dispatch('change', checked);
    }
  }
</script>

<label class="flex items-center space-x-2 cursor-pointer">
  <input
    type="checkbox"
    class="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
    bind:checked
    disabled={disabled}
    onchange={handleChange}
  />
  {#if label}
    <span class="select-none">{label}</span>
  {/if}
</label>
