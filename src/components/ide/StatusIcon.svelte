<script lang="ts">
    import { Bell, Eye } from '@lucide/svelte';
    import type { DemoStatus } from './demo-data';

    let { status, size = 14 }: { status: DemoStatus; size?: number } = $props();
</script>

<span class="icon" style="width:{size}px;height:{size}px">
    {#if status === 'working'}
        <span class="ring spin" style="width:{size - 2}px;height:{size - 2}px"></span>
    {:else if status === 'waiting'}
        <Bell {size} class="pulse waiting" />
    {:else if status === 'review'}
        <Eye {size} class="review" />
    {:else}
        <span class="idle" style="width:{size - 4}px;height:{size - 4}px"></span>
    {/if}
</span>

<style>
    .icon {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
    }
    .ring {
        display: block;
        border-radius: 50%;
        border: 2px solid color-mix(in srgb, var(--st-working) 25%, transparent);
        border-top-color: var(--st-working);
    }
    .idle {
        display: block;
        border-radius: 50%;
        border: 2px solid var(--st-idle);
    }
    :global(.waiting) {
        color: var(--st-waiting);
    }
    :global(.review) {
        color: var(--st-review);
    }
</style>
