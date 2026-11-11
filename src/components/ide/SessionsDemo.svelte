<script lang="ts">
    import { Eye, Pencil, Search, Terminal } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { tr } from './demo-data';
    import { demo } from './demo-store.svelte';
    import StatusIcon from './StatusIcon.svelte';

    let { labels }: { labels: { all: string; attention: string; working: string; idle: string; waiting: string } } =
        $props();

    onMount(() => demo.connect());

    const family = { read: Eye, write: Pencil, exec: Terminal, search: Search } as const;
    const color = {
        read: 'var(--f-read)',
        write: 'var(--f-write)',
        exec: 'var(--f-exec)',
        search: 'var(--f-search)',
    } as const;
    const fmt = (seconds: number) => (seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`);

    /** Rastro de barras de colores: una por herramienta usada (determinista por sesión). */
    const trail = (seed: number) =>
        Array.from(
            { length: 14 },
            (_, i) => (['--f-read', '--f-search', '--f-write', '--f-exec'] as const)[(seed * 3 + i * 5 + (i % 3)) % 4],
        );

    const counts = $derived({
        all: demo.sessions.length,
        attention: demo.sessions.filter((s) => s.status === 'waiting' || s.status === 'review').length,
        working: demo.sessions.filter((s) => s.status === 'working').length,
        idle: demo.sessions.filter((s) => s.status === 'idle').length,
    });
</script>

<div class="wrap">
    <div class="bar">
        <div class="seg">
            <span class="on">{labels.all} <i class="mono">{counts.all}</i></span>
            <span>{labels.attention} <i class="mono">{counts.attention}</i></span>
            <span>{labels.working} <i class="mono">{counts.working}</i></span>
            <span>{labels.idle} <i class="mono">{counts.idle}</i></span>
        </div>
    </div>

    <div class="grid">
        {#each demo.sessions as s, index (s.id)}
            <article class="card" class:alert={s.status === 'waiting'} class:focus={demo.focused === s.id}>
                <span class="side" style="background:var(--s{s.color})"></span>
                <header>
                    <StatusIcon status={s.status} />
                    <h4>{s.name}</h4>
                    <span class="alt mono">Alt {index + 1}</span>
                </header>
                <p class="meta mono">{s.branch}</p>

                <div class="now">
                    {#if s.status === 'working' && s.now}
                        {@const Icon = family[s.now.family]}
                        <Icon size={14} style="color:{color[s.now.family]};margin-top:2px;flex-shrink:0" />
                        <div>
                            <p>{tr(s.now.label)}</p>
                            {#if s.now.target}<p class="target mono">{s.now.target}</p>{/if}
                        </div>
                    {:else if s.status === 'waiting'}
                        <p class="wait">{labels.waiting}</p>
                    {:else}
                        <p class="muted">{tr(s.message) || '—'}</p>
                    {/if}
                </div>

                <div class="trail">
                    {#each trail(index) as token, i (i)}
                        <span style="background:var({token})"></span>
                    {/each}
                </div>

                <footer class="mono">
                    <span style="color:var(--st-{s.status})">{fmt(s.since)}</span>
                    <span>↻ {s.turns}</span>
                    <span><b class="ok">+{s.additions}</b> <b class="del">−{s.deletions}</b></span>
                    <span class="ctx">
                        <span class="meter"
                            ><span
                                style="width:{s.context * 100}%;background:{s.context > 0.8
                                    ? 'var(--danger)'
                                    : 'var(--accent)'}"
                            ></span></span
                        >
                        {Math.round(s.context * 200)}k
                    </span>
                </footer>
            </article>
        {/each}
    </div>
</div>

<style>
    .wrap {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .bar {
        display: flex;
        align-items: center;
        height: 44px;
        padding: 0 14px;
        border-bottom: 1px solid var(--border-subtle);
    }
    .seg {
        display: inline-flex;
        padding: 2px;
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
    }
    .seg span {
        padding: 3px 10px;
        font-size: 11px;
        color: var(--text-muted);
        border-radius: 4px;
    }
    .seg span.on {
        color: var(--text-main);
        background: var(--bg-raised);
    }
    .seg i {
        font-style: normal;
        color: var(--text-faint);
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 10px;
        padding: 12px;
        overflow: hidden;
        align-content: start;
    }
    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 10px 10px 9px 14px;
        overflow: hidden;
        background: var(--bg-sidebar);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        transition: background 0.2s;
    }
    .card:hover,
    .card.focus {
        background: var(--bg-raised);
    }
    .card.alert {
        border-color: color-mix(in srgb, var(--st-waiting) 50%, transparent);
    }
    .side {
        position: absolute;
        inset: 0 auto 0 0;
        width: 3px;
    }
    header {
        display: flex;
        align-items: center;
        gap: 7px;
    }
    h4 {
        flex: 1;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-main);
    }
    .alt {
        font-size: 9px;
        color: var(--text-faint);
    }
    .meta {
        margin: -3px 0 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 10px;
        color: var(--text-faint);
    }
    .now {
        display: flex;
        gap: 7px;
        min-height: 34px;
        font-size: 12px;
    }
    .now p {
        margin: 0;
    }
    .target {
        font-size: 10px;
        color: var(--text-faint);
    }
    .wait {
        font-weight: 500;
        color: var(--st-waiting);
    }
    .muted {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: var(--text-muted);
    }
    .trail {
        display: flex;
        gap: 3px;
        height: 10px;
    }
    .trail span {
        width: 5px;
        height: 100%;
        border-radius: 2px;
        opacity: 0.7;
    }
    footer {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 10px;
        color: var(--text-muted);
    }
    .ok {
        color: var(--ok);
        font-weight: 400;
    }
    .del {
        color: var(--danger);
        font-weight: 400;
    }
    .ctx {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-left: auto;
    }
    .meter {
        width: 34px;
        height: 4px;
        overflow: hidden;
        background: var(--bg-hover);
        border-radius: 4px;
    }
    .meter span {
        display: block;
        height: 100%;
    }
</style>
