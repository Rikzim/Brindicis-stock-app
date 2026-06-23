<script lang="ts">
  import { navigateTo } from "$lib/utils/navigate";
</script>

<div class="flex h-dvh items-center justify-center bg-[#F3F4F6] dark:bg-slate-950">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-slate-800 dark:text-white">404</h1>
    <p class="mt-2 text-lg text-slate-600 dark:text-slate-400">Página não encontrada</p>
    <a
      href="/stock"
      onclick={(e) => {
        e.preventDefault();
        navigateTo("/stock");
      }}
      class="mt-6 inline-block rounded-lg bg-[#FBBF24] px-6 py-3 text-sm font-semibold text-[#1F2937] hover:bg-amber-500 transition-colors"
    >
      Voltar ao Início
    </a>
  </div>
</div>
