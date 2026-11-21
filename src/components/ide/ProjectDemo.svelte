<script lang="ts">
    import { Minimize2, Plus, Zap } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { aggregate, allDirs, changedPaths, impactOf, sessionFile, u } from './demo-data';
    import { demo } from './demo-store.svelte';
    import { forceLayout, type LayoutNode } from './force-layout';

    let { labels }: { labels: { depth: string; modules: string; links: string } } = $props();

    const W = 760;
    const H = 400;
    const TONE: Record<string, string> = { M: 'var(--st-waiting)', A: 'var(--ok)', U: 'var(--ok)', D: 'var(--danger)' };
    const radius = (files: number) => Math.min(28, 8 + Math.sqrt(files) * 2.6);

    const below = (level: number) => allDirs.filter((dir) => dir.split('/').length < level);
    let open = $state<Set<string>>(new Set(below(2)));
    let level = $state(2);
    let impactOn = $state(false);
    let selected = $state<string | null>(null);
    let hovered = $state<string | null>(null);

    onMount(() => demo.connect());

    const graph = $derived(aggregate(open));
    const laid = $derived.by(() => {
        const nodes: LayoutNode[] = graph.nodes.map((n) => ({ id: n.id, radius: radius(n.files), x: 0, y: 0 }));
        const edges = graph.edges.map(([from, to, weight]) => ({ from, to, weight }));
        return new Map(forceLayout(nodes, edges, W, H).map((n) => [n.id, n]));
    });

    const ids = $derived(new Set(graph.nodes.map((n) => n.id)));
    /** Nodo visible que contiene un archivo (el prefijo más largo presente en el grafo). */
    const nodeOf = (path: string) => {
        const parts = path.split('/');
        for (let end = parts.length; end > 0; end--) {
            const id = parts.slice(0, end).join('/');
            if (ids.has(id)) return id;
        }
        return undefined;
    };

    const changes = $derived.by(() => {
        const map = new Map<string, Record<string, number>>();
        for (const c of changedPaths) {
            const id = nodeOf(c.path);
            if (!id) continue;
            const counts = map.get(id) ?? {};
            counts[c.status] = (counts[c.status] ?? 0) + 1;
            map.set(id, counts);
        }
        return map;
    });

    const impacted = $derived(
        impactOn ? impactOf(changedPaths.filter((c) => c.status !== 'D').map((c) => c.path)) : [],
    );
    const impactedNodes = $derived(new Set(impacted.map(nodeOf).filter((id): id is string => !!id)));

    const rings = $derived.by(() => {
        const map = new Map<string, Array<{ color: number; working: boolean }>>();
        for (const s of demo.sessions) {
            const file = sessionFile[s.id];
            const id = file ? nodeOf(file) : undefined;
            if (id) map.set(id, [...(map.get(id) ?? []), { color: s.color, working: s.status === 'working' }]);
        }
        return map;
    });

    const related = $derived.by(() => {
        const focus = hovered ?? selected;
        if (!focus) return null;
        const set = new Set([focus]);
        for (const [a, b] of graph.edges) {
            if (a === focus) set.add(b);
            if (b === focus) set.add(a);
        }
        return set;
    });

    function toggle(id: string) {
        demo.touch();
        const next = new Set(open);
        if (next.has(id)) for (const dir of next) (dir === id || dir.startsWith(`${id}/`)) && next.delete(dir);
        else next.add(id);
        open = next;
        level = Math.max(1, ...[...next].map((d) => d.split('/').length + 1));
    }

    const picked = $derived(graph.nodes.find((n) => n.id === selected));
</script>

<div class="wrap">
    <div class="bar mono">
        <label
            >{u('level')}
            <input
                type="range"
                min="1"
                max="4"
                value={level}
                oninput={(e) => ((level = Number(e.currentTarget.value)), (open = new Set(below(level))), demo.touch())}
            />
            <b>{level}</b>
        </label>
        <button class="btn" title={u('collapse')} onclick={() => ((level = 1), (open = new Set()), demo.touch())}
            ><Minimize2 size={12} /></button
        >
        <button class="btn" class:on={impactOn} onclick={() => ((impactOn = !impactOn), demo.touch())}
            ><Zap size={12} />{u('impact')}{#if impactOn}<b>{impacted.length}</b>{/if}</button
        >
        <span class="count">{graph.nodes.length} {labels.modules} · {graph.edges.length} {labels.links}</span>
        <span class="legend"
            >{#each demo.sessions as s (s.id)}<i style="background:var(--s{s.color})"></i>{/each}</span
        >
    </div>

    <div class="stage">
        <svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Project dependency graph">
            <defs>
                <marker
                    id="demo-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="4.5"
                    markerHeight="4.5"
                    orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-faint)" /></marker
                >
            </defs>

            {#each graph.edges as [from, to, weight] (`${from}>${to}`)}
                {@const a = laid.get(from)}
                {@const b = laid.get(to)}
                {#if a && b}
                    {@const dx = b.x - a.x}
                    {@const dy = b.y - a.y}
                    {@const len = Math.hypot(dx, dy) || 1}
                    {@const focus = hovered ?? selected}
                    {@const active = focus !== null && (from === focus || to === focus)}
                    <line
                        x1={a.x + (dx / len) * a.radius}
                        y1={a.y + (dy / len) * a.radius}
                        x2={b.x - (dx / len) * (b.radius + 4)}
                        y2={b.y - (dy / len) * (b.radius + 4)}
                        stroke={active ? 'var(--accent)' : 'var(--text-faint)'}
                        stroke-width={0.8 + Math.log2(1 + weight) * 0.55}
                        stroke-opacity={related ? (active ? 0.9 : 0.08) : 0.32}
                        marker-end="url(#demo-arrow)"
                    />
                {/if}
            {/each}

            {#each graph.nodes as node (node.id)}
                {@const p = laid.get(node.id)}
                {#if p}
                    {@const r = radius(node.files)}
                    {@const counts = changes.get(node.id)}
                    {@const ring = rings.get(node.id) ?? []}
                    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                    <g
                        transform="translate({p.x} {p.y})"
                        opacity={related && !related.has(node.id) ? 0.25 : 1}
                        onpointerenter={() => (hovered = node.id)}
                        onpointerleave={() => (hovered = null)}
                        onclick={() => ((selected = selected === node.id ? null : node.id), demo.touch())}
                        ondblclick={() => node.kind === 'dir' && toggle(node.id)}
                    >
                        {#each ring as s, i (i)}<circle
                                r={r + 5 + i * 4}
                                fill="none"
                                stroke="var(--s{s.color})"
                                stroke-width="2.2"
                                class:pulse={s.working}
                            />{/each}
                        {#if impactedNodes.has(node.id)}<circle
                                r={r + 6}
                                fill="none"
                                stroke="var(--st-waiting)"
                                stroke-width="1.6"
                                stroke-dasharray="4 3"
                            />{/if}
                        {#if node.kind === 'file'}
                            <rect
                                x={-r}
                                y={-r * 0.8}
                                width={r * 2}
                                height={r * 1.6}
                                rx="5"
                                fill={selected === node.id ? 'var(--accent-soft)' : 'var(--bg-raised)'}
                                stroke={counts ? 'var(--st-waiting)' : 'var(--text-faint)'}
                                stroke-width={counts ? 2.2 : 1.5}
                            />
                        {:else}
                            <circle
                                {r}
                                fill={selected === node.id ? 'var(--accent-soft)' : 'var(--bg-raised)'}
                                stroke={counts
                                    ? 'var(--st-waiting)'
                                    : selected === node.id
                                      ? 'var(--accent)'
                                      : 'var(--text-faint)'}
                                stroke-width={counts ? 2.2 : 1.5}
                            />
                            <text text-anchor="middle" dy="0.35em" font-size="10" class="mono" fill="var(--text-faint)"
                                >{node.files}</text
                            >
                        {/if}
                        <text y={r + 13 + ring.length * 4} text-anchor="middle" font-size="11" fill="var(--text-muted)"
                            >{node.label}{node.kind === 'dir' ? '/' : ''}</text
                        >
                        {#if counts}
                            <g transform="translate({r * 0.7} {-r - 3})"
                                >{#each Object.entries(counts) as [letter, n], i (letter)}<text
                                        x={i * 16}
                                        font-size="10"
                                        class="mono"
                                        font-weight="700"
                                        fill={TONE[letter]}>{letter}{n > 1 ? n : ''}</text
                                    >{/each}</g
                            >
                        {/if}
                    </g>
                {/if}
            {/each}
        </svg>

        {#if picked}
            <div class="panel">
                <b>{picked.id}{picked.kind === 'dir' ? '/' : ''}</b>
                <span class="mono">{picked.files} {labels.modules === 'modules' ? 'files' : 'archivos'}</span>
                {#if picked.kind === 'dir'}<button class="btn" onclick={() => toggle(picked.id)}
                        ><Plus size={12} />{open.has(picked.id) ? u('collapse') : u('expand')}</button
                    >{/if}
            </div>
        {/if}
        <p class="tip">{u('hint')}</p>
    </div>
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
        gap: 12px;
        height: 44px;
        padding: 0 14px;
        font-size: 11px;
        color: var(--text-faint);
        border-bottom: 1px solid var(--border-subtle);
    }
    label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
    }
    label b {
        color: var(--text-main);
        font-weight: 500;
    }
    input[type='range'] {
        width: 90px;
        accent-color: var(--accent);
    }
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px;
        font-size: 11px;
        color: var(--text-muted);
        background: var(--bg-raised);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
    }
    .btn.on {
        color: #0f1115;
        background: var(--accent);
        border-color: transparent;
    }
    .btn b {
        font-weight: 500;
    }
    .count {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    .stage {
        position: relative;
        flex: 1;
        min-height: 0;
    }
    svg {
        width: 100%;
        height: 100%;
    }
    g {
        cursor: pointer;
        transition: opacity 0.15s;
    }
    .panel {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 170px;
        padding: 10px;
        font-size: 12px;
        background: var(--bg-raised);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        box-shadow: 0 10px 30px rgb(0 0 0 / 0.3);
    }
    .panel span {
        font-size: 10px;
        color: var(--text-faint);
    }
    .tip {
        position: absolute;
        bottom: 8px;
        left: 14px;
        margin: 0;
        font-size: 10px;
        color: var(--text-faint);
        pointer-events: none;
    }
    @media (max-width: 760px) {
        .count {
            display: none;
        }
    }
</style>
