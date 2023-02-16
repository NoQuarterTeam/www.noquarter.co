<script lang="ts">
  import Card from "./Card.svelte"
  let isSubmitted = false
  let isLoading = false

  const handleSubmit = (e: any) => {
    isLoading = true
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        e.target.reset()
        isSubmitted = true
      })
      .catch((err) => console.error(err))
      .finally(() => {
        isLoading = false
      })
  }
</script>

<Card title="Contact us" isLikeable={false} link={undefined} description={undefined} tags={[]} images={[]}>
  <form action="/api/contact" method="post" on:submit={handleSubmit}>
    {#if isSubmitted}
      <div class="text-center py-9 space-y-2">
        <p class="text-2xl">Thank you for your message!</p>
        <p class="text-lg">We will get back to you as soon as possible.</p>
      </div>
    {:else}
      <div class="space-y-2">
        <label for="name" class="block w-full">
          <span class="w-32">Name</span>
          <input
            id="name"
            name="name"
            required
            minlength="2"
            class="relative w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-2 py-2 md:py-3 md:px-8 font-mono shadow-2xl transition-colors placeholder:text-neutral-400 hover:border-neutral-600"
          />
        </label>
        <label for="email" class="block w-full">
          <span class="w-32">Email</span>
          <input
            id="email"
            required
            name="email"
            type="email"
            class="relative w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-2 py-2 md:py-3 md:px-8 font-mono shadow-2xl transition-colors placeholder:text-neutral-400 hover:border-neutral-600"
          />
        </label>
        <label for="message" class="block w-full">
          <span class="w-32">Message</span>
          <textarea
            rows="5"
            required
            id="message"
            name="message"
            minlength="100"
            class="resize-none relative w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-2 py-2 md:py-3 md:px-8 font-mono shadow-2xl transition-colors placeholder:text-neutral-400 hover:border-neutral-600"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          class="rounded-lg bg-neutral-700 px-3 py-2 md:py-3 md:px-8 transition-colors hover:bg-neutral-600"
        >
          {#if isLoading}
            Sending...
          {:else}
            Send it
          {/if}
        </button>
      </div>
    {/if}
  </form>
</Card>
