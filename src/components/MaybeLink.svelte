<script lang="ts">
  export let href: string | undefined
</script>

{#if href}
  <a {...$$restProps} {href}>
    <slot />
  </a>
{:else}
  <slot />
{/if}
