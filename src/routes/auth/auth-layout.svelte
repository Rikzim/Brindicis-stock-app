<script>
  import Logo from "@/assets/logo.svelte";

  let { children } = $props();
</script>

<div class="container grid h-svh max-w-none items-center justify-center">
  <div class="mx-auto flex w-full flex-col justify-center gap-y-2 py-8 sm:w-[480px] sm:p-8">
    <div class="mb-6 flex flex-col items-center gap-2">
      <Logo class="h-20 w-auto" />
      <h1 class="text-2xl font-semibold tracking-tight">
        Brindicis Stock
      </h1>
    </div>
    {@render children?.()}
  </div>
</div>
