<script lang="ts">
    import { getAuthToken } from "@/lib/state/auth-store";

    const API_URL = import.meta.env.VITE_API_URL;

    let { path = "", width, alt = "", class: className = "" } = $props();

    let blobUrl = $state<string | null>(null);

    $effect(() => {
        blobUrl = null;
        if (!path) return;

        const token = getAuthToken();
        let url = path;
        if (!url.startsWith("http")) url = `${API_URL}${url}`;
        if (width) url = `${url}?w=${width}`;
        let cancelled = false;
        let localUrl: string | null = null;

        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.blob();
            })
            .then((blob) => {
                if (!cancelled) {
                    localUrl = URL.createObjectURL(blob);
                    blobUrl = localUrl;
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
            if (localUrl) URL.revokeObjectURL(localUrl);
        };
    });
</script>

{#if blobUrl}
    <img
        src={blobUrl}
        {alt}
        class={className}
        loading="lazy"
        decoding="async"
    />
{:else if path}
    <div class={className}></div>
{/if}
