<script lang="ts">
  import { apiClient } from "$lib/utils/api-client";

  type Props = {
    path?: string;
    width?: number;
    alt?: string;
    class?: string;
  };

  let { path = "", width, alt = "", class: className = "" }: Props = $props();

  let blobUrl = $state<string | null>(null);

  $effect(() => {
    blobUrl = null;
    if (!path) return;

    const url = width && !path.includes("?w=") ? `${path}?w=${width}` : path;
    let cancelled = false;
    let localUrl: string | null = null;

    apiClient
      .get<Blob>(url, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        localUrl = URL.createObjectURL(res.data);
        blobUrl = localUrl;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  });
</script>

{#if blobUrl}
  <img src={blobUrl} {alt} class={className} loading="lazy" decoding="async" />
{:else if path}
  <div class={className}></div>
{/if}
