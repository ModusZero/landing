<script lang="ts">
    import { onMount } from 'svelte';
    import { forceLayout, type LayoutNode } from './force-layout';
    import { moduleLinks, modules, sessionModule } from './demo-data';
    import { demo } from './demo-store.svelte';

    let { labels }: { labels: { depth: string; modules: string; links: string } } = $props();

    const W = 760;
    const H = 440;
    const radius = (files: number) => Math.min(30, 8 + Math.sqrt(files) * 2.3);

    const nodes: LayoutNode[] = forceLayout(
        modules.map(([id, files]) => ({ id, radius: radius(files), x: 0, y: 0 })),
        moduleLinks.map(([from, to, weight]) => ({ from, to, weight })),
        W,
        H,
    );
    const at = new Map(nodes.map((node) => [node.id, node]));
    const files = new Map(modules.map(([id, count]) => [id, count]));

    let hovered = $state<string | null>(null);
    onMount(() => demo.connect());

    /** Sesiones activas en cada módulo (anillos de color, pulsan mientras la IA trabaja). */
    const activity = $derived.by(() => {
        const map = new Map<string, Array<{ color: number; working: boolean }>>();
        for (const session of demo.sessions) {
            const module = sessionModule[session.id];
            if (module)
                map.set(module, [
                    ...(map.get(module) ?? []),
                    { color: session.color, working: session.status === 'working' },
                ]);
        }
        return map;
    });

    const related = $derived.by(() => {
        if (!hovered) return null;
        const ids = new Set([hovered]);
        for (const [from, to] of moduleLinks) {
            if (from === hovered) ids.add(to);
            if (to === hovered) ids.add(from);
        }
        return ids;
    });
</script>

<div class="wrap">
    <div class="bar mono">
        <strong>{labels.depth} 3</strong>
        <span>{modules.length} {labels.modules} · {moduleLinks.length} {labels.links}</span>
        <span class="legend">
            {#each demo.sessions as s (s.id)}<i style="background:var(--s{s.color})"></i>{/each}
        </span>
    </div>

    <svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Project dependency graph">
        <defs>
            <marker
                id="demo-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="4.5"
                markerHeight="4.5"
                orient="auto-start-reverse"
            >
                <path d="M0,0 L10,5 L0,10 z" fill="var(--text-faint)" />
            </marker>
        </defs>

        {#each moduleLinks as [from, to, weight] (`${from}>${to}`)}
            {@const a = at.get(from)!}
            {@const b = at.get(to)!}
            {@const dx = b.x - a.x}
            {@const dy = b.y - a.y}
            {@const len = Math.hypot(dx, dy) || 1}
            {@const active = hovered !== null && (from === hovered || to === hovered)}
            <line
                x1={a.x + (dx / len) * a.radius}
                y1={a.y + (dy / len) * a.radius}
                x2={b.x - (dx / len) * (b.radius + 4)}
                y2={b.y - (dy / len) * (b.radius + 4)}
                stroke={active ? 'var(--accent)' : 'var(--text-faint)'}
                stroke-width={0.8 + Math.log2(1 + weight) * 0.55}
                stroke-opacity={hovered ? (active ? 0.9 : 0.08) : 0.32}
                marker-end="url(#demo-arrow)"
            />
        {/each}

        {#each nodes as node (node.id)}
            {@const rings = activity.get(node.id) ?? []}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <g
                transform="translate({node.x} {node.y})"
                opacity={related && !related.has(node.id) ? 0.25 : 1}
                onpointerenter={() => (hovered = node.id)}
                onpointerleave={() => (hovered = null)}
            >
                {#each rings as ring, i (i)}
                    <circle
                        r={node.radius + 5 + i * 4}
                        fill="none"
                        stroke="var(--s{ring.color})"
                        stroke-width="2.2"
                        class:pulse={ring.working}
                    />
                {/each}
                <circle r={node.radius} fill="var(--bg-raised)" stroke="var(--text-faint)" stroke-width="1.5" />
                <text
                    y={node.radius + 14 + rings.length * 4}
                    text-anchor="middle"
                    font-size="11.5"
                    fill="var(--text-muted)">{node.id}</text
                >
                <text text-anchor="middle" dy="0.35em" font-size="10" class="mono" fill="var(--text-faint)"
                    >{files.get(node.id)}</text
                >
            </g>
        {/each}
    </svg>
</div>

<style>
    .wrap {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .bar {
        display: flex;
        align-items: center;
        gap: 16px;
        height: 44px;
        padding: 0 14px;
        font-size: 11px;
        color: var(--text-faint);
        border-bottom: 1px solid var(--border-subtle);
    }
    .bar strong {
        font-weight: 500;
        color: var(--text-muted);
    }
    .legend {
        display: flex;
        gap: 6px;
        margin-left: auto;
    }
    .legend i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    svg {
        flex: 1;
        min-height: 0;
        width: 100%;
    }
    g {
        cursor: pointer;
        transition: opacity 0.15s;
    }
</style>
