<script lang="ts">
    import { ArrowRight, Eye, Pause, Pencil, Play, RotateCcw, Search, Terminal } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { scriptFor, tr, u } from './demo-data';
    import { demo } from './demo-store.svelte';
    import StatusIcon from './StatusIcon.svelte';

    let { labels }: { labels: { turn: string; steps: string; prompt: string } } = $props();

    const ROW = 32;
    const LANE = 18;
    const icons = { read: Eye, write: Pencil, exec: Terminal, search: Search } as const;
    const names = { read: 'Leer', write: 'Editar', exec: 'Comando', search: 'Buscar' } as const;

    let view = $state<'diagram' | 'timeline'>('diagram');
    let playing = $state(true);
    let shown = $state(1);
    let selected = $state<number | null>(null);
    let last = '';

    onMount(() => {
        demo.connect();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) shown = 99;
        const timer = setInterval(() => {
            if (reduced || !playing) return;
            shown = shown >= script.length + 3 ? 1 : shown + 1;
        }, 950);
        return () => clearInterval(timer);
    });

    const script = $derived(scriptFor(demo.focused.slice(0, 1)));
    const rows = $derived(script.slice(0, Math.min(shown, script.length)));
    const running = $derived(shown < script.length ? shown - 1 : -1);

    // Al cambiar de sesión, el grafo empieza de nuevo.
    $effect(() => {
        if (demo.focused !== last) {
            last = demo.focused;
            shown = 1;
            selected = null;
        }
    });

    /** Fases: pasos consecutivos de la misma familia se agrupan en una sola caja. */
    const phases = $derived.by(() => {
        const out: Array<{ family: string; items: number[] }> = [];
        rows.forEach((node, index) => {
            if (node.family === 'prompt' || node.family === 'stop') return;
            const previous = out.at(-1);
            if (previous && previous.family === node.family) previous.items.push(index);
            else out.push({ family: node.family, items: [index] });
        });
        return out;
    });

    const parents = [-1, 0, 1, 1, 2, 4, 5, 6, 7, 8];
    const x = (lane: number) => 16 + lane * LANE;
    const y = (index: number) => (index + 1) * ROW + ROW / 2;

    function link(index: number): string {
        const parent = parents[index] ?? index - 1;
        const [x1, y1, x2, y2] = [x(rows[parent]?.lane ?? 0), y(parent), x(rows[index].lane ?? 0), y(index)];
        if (x1 === x2) return `M${x1},${y1} L${x2},${y2}`;
        const mid = (y1 + y2) / 2;
        return `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`;
    }

    const ms = (value?: number) => (value ? (value < 1000 ? `${value}ms` : `${(value / 1000).toFixed(1)}s`) : '');
    const chosen = $derived(selected !== null ? rows[selected] : null);
</script>

<div class="wrap">
    <div class="top">
        <div class="tabs">
            {#each demo.sessions.slice(0, 6) as s (s.id)}
                <button class:on={demo.focused === s.id} onclick={() => demo.focus(s.id)}
                    ><StatusIcon status={s.status} size={11} />{s.name}</button
                >
            {/each}
        </div>
        <div class="tools">
            <div class="seg">
                <button class:on={view === 'diagram'} onclick={() => ((view = 'diagram'), demo.touch())}
                    >{u('diagram')}</button
                >
                <button class:on={view === 'timeline'} onclick={() => ((view = 'timeline'), demo.touch())}
                    >{u('timeline')}</button
                >
            </div>
            <button class="icon" title={playing ? u('pause') : u('play')} onclick={() => (playing = !playing)}
                >{#if playing}<Pause size={13} />{:else}<Play size={13} />{/if}</button
            >
            <button class="icon" title={u('restart')} onclick={() => ((shown = 1), (selected = null))}
                ><RotateCcw size={13} /></button
            >
        </div>
    </div>

    <div class="turn mono">
        <b>T1</b><strong>{tr(script[0].label)}</strong><span>{Math.max(0, rows.length - 1)} {labels.steps}</span>
    </div>

    <div class="body">
        {#if view === 'timeline'}
            <div class="canvas">
                <svg width="64" height={rows.length * ROW} aria-hidden="true">
                    {#each rows as node, index (index)}
                        {#if index > 0}<path
                                d={link(index)}
                                transform="translate(0 {-ROW})"
                                fill="none"
                                stroke="var(--text-faint)"
                                stroke-opacity="0.5"
                                stroke-width="1.5"
                            />{/if}
                    {/each}
                    {#each rows as node, index (index)}
                        <circle
                            cx={x(node.lane ?? 0)}
                            cy={y(index) - ROW}
                            r={node.family === 'prompt' || node.family === 'stop' ? 5.5 : 4.5}
                            fill={node.family === 'prompt' || node.family === 'stop'
                                ? 'var(--bg-main)'
                                : `var(--f-${node.family})`}
                            stroke={node.family === 'prompt' || node.family === 'stop' ? 'var(--text-muted)' : 'none'}
                            stroke-width="2"
                            class:pulse={index === running}
                        />
                    {/each}
                </svg>
                {#each rows as node, index (index)}
                    {@const Icon = node.family in icons ? icons[node.family as keyof typeof icons] : null}
                    <button
                        class="row"
                        class:run={index === running}
                        class:sel={selected === index}
                        style="top:{index * ROW}px;height:{ROW}px"
                        onclick={() => ((selected = selected === index ? null : index), demo.touch())}
                    >
                        {#if Icon}<Icon size={13} style="color:var(--f-{node.family});flex-shrink:0" />{/if}
                        <span class="label" class:stop={node.family === 'stop'}
                            >{node.family === 'prompt' ? labels.prompt : tr(node.label)}</span
                        >
                        {#if node.target}<span class="target mono">{node.target}</span>{/if}
                        <span class="intent">{tr(node.intent)}</span>
                        <span class="ms mono">{index === running ? '…' : ms(node.ms)}</span>
                    </button>
                {/each}
            </div>
        {:else}
            <div class="flow">
                <span class="chip root">{labels.prompt}</span>
                {#each phases as phase, p (p)}
                    {@const Icon = phase.family in icons ? icons[phase.family as keyof typeof icons] : null}
                    <span class="arrow"><ArrowRight size={15} /></span>
                    <div
                        class="phase"
                        style="border-left-color:var(--f-{phase.family})"
                        class:run={phase.items.includes(running)}
                    >
                        <div class="ph">
                            {#if Icon}<Icon size={15} style="color:var(--f-{phase.family})" />{/if}<strong
                                >{names[phase.family as keyof typeof names]}</strong
                            >{#if phase.items.length > 1}<span class="mono">×{phase.items.length}</span>{/if}
                        </div>
                        {#each phase.items as item (item)}
                            <button
                                class="step"
                                class:sel={selected === item}
                                onclick={() => ((selected = selected === item ? null : item), demo.touch())}
                                >{tr(rows[item].label)}</button
                            >
                        {/each}
                    </div>
                {/each}
                {#if rows.at(-1)?.family === 'stop'}<span class="arrow"><ArrowRight size={15} /></span><span
                        class="chip done">{tr('Listo')}</span
                    >{/if}
            </div>
        {/if}
    </div>

    {#if chosen}
        <div class="detail">
            <b>{tr(chosen.label)}</b>
            {#if chosen.target}<span class="mono">{chosen.target}</span>{/if}
            {#if chosen.intent}<em>{u('why')}: {tr(chosen.intent)}</em>{/if}
        </div>
    {/if}
</div>

<style>
    .wrap {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        height: 40px;
        padding: 0 12px;
        border-bottom: 1px solid var(--border-subtle);
    }
    .tabs {
        display: flex;
        gap: 4px;
        min-width: 0;
        overflow: hidden;
    }
    .tabs button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 9px;
        font-size: 11px;
        white-space: nowrap;
        color: var(--text-muted);
        border-radius: 6px;
    }
    .tabs button:hover {
        background: var(--bg-hover);
    }
    .tabs button.on {
        color: var(--text-main);
        background: var(--bg-active);
    }
    .tools {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .seg {
        display: inline-flex;
        padding: 2px;
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
    }
    .seg button {
        padding: 2px 9px;
        font-size: 11px;
        color: var(--text-muted);
        border-radius: 4px;
    }
    .seg button.on {
        color: var(--text-main);
        background: var(--bg-raised);
    }
    .icon {
        display: inline-flex;
        width: 24px;
        height: 24px;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        border-radius: 6px;
    }
    .icon:hover {
        background: var(--bg-hover);
        color: var(--text-main);
    }
    .turn {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 34px;
        padding: 0 14px;
        font-size: 12px;
        border-bottom: 1px solid var(--border-subtle);
    }
    .turn b {
        color: var(--accent);
    }
    .turn strong {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
        color: var(--text-main);
        font-family: inherit;
    }
    .turn span {
        font-size: 10px;
        color: var(--text-faint);
    }
    .body {
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }
    .canvas {
        position: relative;
        height: 100%;
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
        text-align: left;
        animation: in 0.35s ease-out both;
    }
    .row:hover,
    .row.sel {
        background: var(--bg-hover);
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
    .flow {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 14px 6px;
        padding: 16px;
    }
    .arrow {
        display: flex;
        margin-top: 12px;
        color: var(--text-faint);
    }
    .chip {
        margin-top: 4px;
        padding: 7px 12px;
        font-size: 12px;
        font-weight: 600;
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        background: var(--bg-raised);
        animation: in 0.35s ease-out both;
    }
    .chip.done {
        color: var(--ok);
        border-color: color-mix(in srgb, var(--ok) 40%, transparent);
        background: color-mix(in srgb, var(--ok) 8%, transparent);
    }
    .phase {
        width: 168px;
        padding: 8px 10px;
        background: var(--bg-raised);
        border: 1px solid var(--border-subtle);
        border-left: 3px solid;
        border-radius: 10px;
        animation: in 0.35s ease-out both;
    }
    .phase.run {
        border-color: color-mix(in srgb, var(--st-working) 60%, transparent);
    }
    .ph {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 4px;
        font-size: 13px;
    }
    .ph span {
        font-size: 10px;
        color: var(--text-muted);
    }
    .step {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 2px 4px;
        text-align: left;
        font-size: 11px;
        color: var(--text-muted);
        border-radius: 4px;
    }
    .step:hover,
    .step.sel {
        background: var(--bg-hover);
        color: var(--text-main);
    }
    .detail {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 12px;
        padding: 8px 14px;
        font-size: 12px;
        background: var(--bg-sidebar);
        border-top: 1px solid var(--border-subtle);
    }
    .detail span {
        font-size: 10px;
        color: var(--text-faint);
    }
    .detail em {
        color: var(--text-muted);
    }
    @keyframes in {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .row,
        .chip,
        .phase {
            animation: none;
        }
    }
    @media (max-width: 760px) {
        .intent {
            display: none;
        }
        .phase {
            width: 140px;
        }
    }
</style>
