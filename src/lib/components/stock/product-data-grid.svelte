<script lang="ts">
  type Props = {
    cx: string;
    number: number | null;
    family: string | null;
    drawer: string | null;
    pc: number;
  };

  let { cx, number, family, drawer, pc }: Props = $props();
</script>

<div class="px-5 py-2.5">
  <div class="grid grid-cols-3 gap-x-4 gap-y-1">
    <div>
      <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">CX.</span>
      <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">{cx || "—"}</span>
    </div>
    <div>
      <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">NÚMERO</span>
      <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200"
        >{number ?? "N/A"}</span
      >
    </div>
    <div>
      <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">FAMÍLIA</span
      >
      <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">{family || "—"}</span>
    </div>
    <div>
      <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">GAVETA</span>
      <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">{drawer || "—"}</span>
    </div>
    <div>
      <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">P.C.</span>
      <span class="text-xs font-extrabold text-amber-600">{pc.toFixed(2)} €</span>
    </div>
  </div>
</div>
