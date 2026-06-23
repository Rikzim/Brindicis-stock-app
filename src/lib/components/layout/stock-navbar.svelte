<script>
  import { navigateTo } from "@/lib/utils/navigate";
  import Logo from "@/assets/logo.svelte";
  import { Search, Settings, ShieldCheck, LogOut, User } from "@/lib/utils/icon-map";
  import AuthedImage from "@/lib/components/ui/authed-image.svelte";
  import Button from "@/lib/components/ui/button.svelte";
  import Input from "@/lib/components/ui/input.svelte";
  import Badge from "@/lib/components/ui/badge.svelte";
  import { authStore } from "@/lib/state/auth-store";
  import { settingsStore } from "@/lib/state/settings-store";

  let {
    searchQuery = $bindable(""),
  } = $props();

  let showSettings = $state(false);
  let showProfile = $state(false);

  let user = $derived($authStore.user);
  let initial = $derived(user?.name?.charAt(0)?.toUpperCase() || "A");
  let settings = $derived($settingsStore);
</script>

<nav class="relative flex h-16 items-stretch bg-white rounded-2xl border-2 border-slate-200 transition-colors duration-250 dark:bg-slate-900 dark:border-slate-700">
  <!-- Logo Section -->
  <div class="flex items-center gap-2.5 pl-4 pr-3 sm:pl-5 sm:pr-6 shrink-0">
    <button type="button" onclick={() => window.location.reload()} class="flex items-center gap-2.5 cursor-pointer">
      <div class="flex size-8 items-center justify-center bg-[#FBBF24] rounded-lg shrink-0">
        <Logo class="h-5 w-auto" fill="#1F2937" />
      </div>
      <span class="hidden sm:inline text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        Brindicis <span class="text-amber-500 dark:text-amber-400">Stock</span>
      </span>
    </button>
  </div>

  <!-- Search Section -->
  <div class="relative flex flex-1 items-center px-3 sm:px-6">
    <div class="relative w-full">
      <Search class="text-slate-400 absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
      <Input
        placeholder="Pesquise..."
        bind:value={searchQuery}
        class="h-10 w-full rounded-lg border-slate-200/80 bg-slate-50/50 pl-10 pr-12 text-sm focus:bg-white focus-visible:ring-amber-400 shadow-none dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:bg-slate-950"
      />
      <Badge
        variant="outline"
        class="hidden sm:inline-flex text-slate-400 border-slate-200/60 bg-white absolute top-1/2 right-2.5 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-normal shadow-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
      >
        <span class="text-xs mr-0.5">⌘</span>K
      </Badge>
    </div>
  </div>

  <!-- Actions Section -->
  <div class="flex items-center gap-1 px-4 shrink-0">
    <Button variant="ghost" size="icon" onclick={() => navigateTo("/admin")}
      class="text-slate-500 dark:text-slate-400 size-9"
      title="Área Administrativa"
    >
      <ShieldCheck class="size-5" />
    </Button>
    <Button variant="ghost" size="icon" onclick={() => showSettings = !showSettings} class="text-slate-500 dark:text-slate-400 size-9">
      <Settings class="size-5" />
    </Button>
      <Button variant="ghost" size="icon" onclick={() => showProfile = !showProfile} class="rounded-full ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-500 transition-all size-9 overflow-hidden">
        {#if user?.image_path}
          <AuthedImage path={user.image_path} width={200} alt={user.name} class="size-8 rounded-full object-contain" />
        {:else if user}
        <div class="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold">
          {initial}
        </div>
      {:else}
        <div class="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <User class="size-4" />
        </div>
      {/if}
    </Button>
  </div>

  {#if showSettings}
    <button
      type="button"
      class="fixed inset-0 z-40"
      aria-label="Fechar configurações"
      onclick={() => showSettings = false}
      onkeydown={(e) => e.key === "Escape" && (showSettings = false)}
    ></button>
    <div class="absolute right-4 top-[68px] z-50 w-64 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-lg transition-colors duration-250 dark:border-slate-700 dark:bg-slate-800 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
      <h4 class="text-xs font-extrabold text-slate-500 uppercase tracking-widest border-b-2 border-slate-100 pb-2 dark:border-slate-700 dark:text-slate-400">
        Configurações
      </h4>
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-bold text-slate-800 dark:text-slate-200">Modo Escuro</span>
          <span class="text-[11px] text-slate-400 dark:text-slate-500">Alterar tema do sistema</span>
        </div>
        <button
          type="button"
          aria-label="Alternar modo escuro"
          onclick={() => settingsStore.toggleTheme()}
          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none dark:border-transparent {settings.theme === 'dark' ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-700'}"
        >
          <span
            class="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs transition duration-250 ease-in-out {settings.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}"
          ></span>
        </button>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-bold text-slate-800 dark:text-slate-200">Painel à Esquerda</span>
          <span class="text-[11px] text-slate-400 dark:text-slate-500">Mudar posição do card</span>
        </div>
        <button
          type="button"
          aria-label="Alternar posição do painel"
          onclick={() => settingsStore.togglePanelPosition()}
          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none dark:border-transparent {settings.panelPosition === 'left' ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-700'}"
        >
          <span
            class="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs transition duration-250 ease-in-out {settings.panelPosition === 'left' ? 'translate-x-5' : 'translate-x-0'}"
          ></span>
        </button>
      </div>
    </div>
  {/if}

  {#if showProfile}
    <button
      type="button"
      class="fixed inset-0 z-40"
      aria-label="Fechar perfil"
      onclick={() => showProfile = false}
      onkeydown={(e) => e.key === "Escape" && (showProfile = false)}
    ></button>
    <div class="absolute right-4 top-[68px] z-50 w-56 rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-colors duration-250 dark:border-slate-700 dark:bg-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
      <div class="px-4 py-3.5 flex flex-col border-b-2 border-slate-100 dark:border-slate-700">
        {#if user}
          <span class="text-sm font-bold text-slate-800 dark:text-slate-100">
            {user.name}
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {user.email}
          </span>
        {/if}
      </div>
      <Button
        variant="ghost"
        onclick={() => {
          authStore.reset();
          showProfile = false;
          navigateTo("/sign-in");
        }}
        class="flex w-full items-center gap-3 px-4 py-3 h-auto justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-none"
      >
        <LogOut class="size-4" />
        <span>Sair</span>
      </Button>
    </div>
  {/if}
</nav>
