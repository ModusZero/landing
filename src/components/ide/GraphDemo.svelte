<script lang="ts">
    import { Eye, Pencil, Search, Terminal } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { graphScript, tr } from './demo-data';

    let { labels }: { labels: { turn: string; steps: string; prompt: string } } = $props();

    const ROW = 34;
    const LANE = 18;
    const icons = { read: Eye, write: Pencil, exec: Terminal, search: Search } as const;

    // Índice del padre de cada paso: las lecturas en paralelo comparten padre (rama a la derecha).
    const parents = [-1, 0, 1, 1, 2, 4, 5, 6, 7, 8];

    let shown = $state(graphScript.length);

    onMount(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        shown = 1;
        const timer = setInterval(() => {
            shown = shown >= graphScript.length + 3 ? 1 : shown + 1;
        }, 950);
        return () => clearInterval(timer);
    });

    const rows = $derived(graphScript.slice(0, Math.min(shown, graphScript.length)));
    const x = (lane: number) => 16 + lane * LANE;
    const y = (index: number) => (index + 1) * ROW + ROW / 2;
    const running = $derived(shown < graphScript.length ? shown - 1 : -1);

    function link(index: number): string {
        const parent = parents[index];
        const [x1, y1, x2, y2] = [x(rows[parent]?.lane ?? 0), y(parent), x(rows[index].lane ?? 0), y(index)];
        if (x1 === x2) return `M${x1},${y1} L${x2},${y2}`;
        const mid = (y1 + y2) / 2;
        return `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`;
    }
</script>

<div class="canvas">
    <div class="turn" style="height:{ROW}px">
        <span class="mono t">T1</span>
        <strong>{tr(graphScript[0].label)}</strong>
        <span class="mono count">{Math.max(0, rows.length - 1)} {labels.steps}</span>
    </div>

    <svg width="64" height={(rows.length + 1) * ROW} aria-hidden="true">
        {#each rows as node, index (index)}
            {#if index > 0}<path
                    d={link(index)}
                    fill="none"
                    stroke="var(--text-faint)"
                    stroke-opacity="0.5"
                    stroke-width="1.5"
                />{/if}
        {/each}
        {#each rows as node, index (index)}
            <circle
                cx={x(node.lane ?? 0)}
                cy={y(index)}
                r={node.family === 'prompt' || node.family === 'stop' ? 5.5 : 4.5}
                fill={node.family === 'prompt' || node.family === 'stop' ? 'var(--bg-main)' : `var(--f-${node.family})`}
                stroke={node.family === 'prompt' || node.family === 'stop' ? 'var(--text-muted)' : 'none'}
                stroke-width="2"
                class:pulse={index === running}
            />
        {/each}
    </svg>

    {#each rows as node, index (index)}
        {@const Icon = node.family in icons ? icons[node.family as keyof typeof icons] : null}
        <div class="row" class:run={index === running} style="top:{(index + 1) * ROW}px;height:{ROW}px">
            {#if Icon}<Icon size={13} style="color:var(--f-{node.family});flex-shrink:0" />{/if}
            <span class="label" class:stop={node.family === 'stop'}
                >{node.family === 'prompt' ? labels.prompt : tr(node.label)}</span
            >
            {#if node.target}<span class="target mono">{node.target}</span>{/if}
            <span class="intent">{tr(node.intent)}</span>
            <span class="ms mono"
                >{index === running
                    ? '…'
                    : node.ms
                      ? node.ms < 1000
                          ? `${node.ms}ms`
                          : `${(node.ms / 1000).toFixed(1)}s`
                      : ''}</span
            >
        </div>
    {/each}
</div>

<style>
    .canvas {
        position: relative;
        height: 100%;
        overflow: hidden;
    }
    .turn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 14px;
        border-bottom: 1px solid var(--border-subtle);
    }
    .t {
        font-size: 11px;
        font-weight: 700;
        color: var(--accent);
    }
    .turn strong {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
        color: var(--text-main);
    }
    .count {
        font-size: 10px;
        color: var(--text-faint);
    }
    svg {
        position: absolute;
        top: 0;
        left: 0;
    }
    .row {
        position: absolute;
        right: 0;
        left: 64px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding-right: 14px;
        font-size: 12px;
        animation: in 0.35s ease-out both;
    }
    .row.run {
        background: var(--accent-soft);
    }
    .label {
        flex-shrink: 0;
        max-width: 44%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--text-main);
    }
    .label.stop {
        color: var(--ok);
    }
    .target {
        flex-shrink: 0;
        font-size: 10px;
        color: var(--text-faint);
    }
    .intent {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 11px;
        font-style: italic;
        color: var(--text-muted);
    }
    .ms {
        flex-shrink: 0;
        font-size: 10px;
        color: var(--text-faint);
    }
    @keyframes in {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .row {
            animation: none;
        }
    }
    @media (max-width: 760px) {
        .intent {
            display: none;
        }
    }
</style>
