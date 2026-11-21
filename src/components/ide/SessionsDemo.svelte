<script lang="ts">
    import { Check, Eye, Pause, Pencil, Play, Plus, Search, Square, Terminal } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { plans, tr, u } from './demo-data';
    import { demo } from './demo-store.svelte';
    import StatusIcon from './StatusIcon.svelte';

    let { labels }: { labels: { all: string; attention: string; working: string; idle: string; waiting: string } } =
        $props();

    onMount(() => demo.connect());

    type Filter = 'all' | 'attention' | 'working' | 'idle';
    let filter = $state<Filter>('all');

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

    const match = (s: (typeof demo.sessions)[number]) =>
        filter === 'all' ||
        (filter === 'attention' && (s.status === 'waiting' || s.status === 'review')) ||
        (filter === 'working' && s.status === 'working') ||
        (filter === 'idle' && s.status === 'idle');

    const counts = $derived({
        all: demo.sessions.length,
        attention: demo.sessions.filter((s) => s.status === 'waiting' || s.status === 'review').length,
        working: demo.sessions.filter((s) => s.status === 'working').length,
        idle: demo.sessions.filter((s) => s.status === 'idle').length,
    });
    const visible = $derived(demo.sessions.filter(match));
    const focused = $derived(demo.get(demo.focused));
</script>

<div class="wrap">
    <div class="bar">
        <div class="seg">
            {#each [['all', labels.all], ['attention', labels.attention], ['working', labels.working], ['idle', labels.idle]] as [id, label] (id)}
                <button class:on={filter === id} onclick={() => ((filter = id as Filter), demo.touch())}
                    >{label} <i class="mono">{counts[id as Filter]}</i></button
                >
            {/each}
        </div>
        <button class="add" onclick={() => demo.spawn()}><Plus size={13} />{u('newSession')}</button>
    </div>

    <div class="grid">
        {#each visible as s, index (s.id)}
            <article
                class="card"
                class:alert={s.status === 'waiting'}
                class:focus={demo.focused === s.id}
                onclick={() => demo.focus(s.id)}
                role="presentation"
            >
                <span class="side" style="background:var(--s{s.color})"></span>
                <header>
                    <StatusIcon status={s.status} />
                    <h4>{s.name}</h4>
                    <span class="alt mono">Alt {demo.sessions.indexOf(s) + 1}</span>
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

                {#if plans[s.id]}
                    {@const done = plans[s.id].filter((p) => p.done).length}
                    <div class="plan mono">
                        <span class="meter"
                            ><span style="width:{(done / plans[s.id].length) * 100}%;background:var(--ok)"></span></span
                        >{done}/{plans[s.id].length} <em>{u(plans[s.id].find((p) => !p.done)?.key ?? 't1')}</em>
                    </div>
                {/if}

                <div class="trail">
                    {#each trail(index) as token, i (i)}<span style="background:var({token})"></span>{/each}
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

                <div class="actions">
                    {#if s.status === 'waiting'}
                        <button class="go" onclick={(e) => (e.stopPropagation(), demo.approve(s.id))}
                            ><Check size={12} />{u('approve')}</button
                        >
                    {:else if s.status === 'working'}
                        <button onclick={(e) => (e.stopPropagation(), demo.stop(s.id))}
                            ><Square size={11} />{u('stop')}</button
                        >
                    {:else if s.status === 'idle'}
                        <button onclick={(e) => (e.stopPropagation(), demo.resume(s.id))}
                            ><Play size={11} />{u('resume')}</button
                        >
                    {/if}
                </div>
            </article>
        {/each}
    </div>

    {#if focused}
        <div class="dock mono">
            <span class="who"><StatusIcon status={focused.status} size={11} />{focused.name}</span>
            <span class="line"><b>$</b> claude</span>
            <span class="line dim"
                >{#if focused.now}● {tr(focused.now.label)}{:else if focused.status === 'waiting'}? {labels.waiting}{:else}✓
                    {tr(focused.message) || '…'}{/if}</span
            >
        </div>
    {/if}
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
        justify-content: space-between;
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
    .seg button {
        padding: 3px 10px;
        font-size: 11px;
        color: var(--text-muted);
        border-radius: 4px;
    }
    .seg button:hover {
        color: var(--text-main);
    }
    .seg button.on {
        color: var(--text-main);
        background: var(--bg-raised);
    }
    .seg i {
        font-style: normal;
        color: var(--text-faint);
    }
    .add {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        font-size: 11px;
        color: #0f1115;
        background: var(--accent);
        border-radius: 6px;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 10px;
        padding: 12px;
        overflow: hidden;
        align-content: start;
        flex: 1;
        min-height: 0;
    }
    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 10px 9px 14px;
        overflow: hidden;
        cursor: pointer;
        background: var(--bg-sidebar);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        transition:
            background 0.2s,
            border-color 0.2s;
    }
    .card:hover,
    .card.focus {
        background: var(--bg-raised);
    }
    .card.focus {
        border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    }
    .card.alert {
        border-color: color-mix(in srgb, var(--st-waiting) 55%, transparent);
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
        min-height: 32px;
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
    .plan {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: var(--text-muted);
    }
    .plan em {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-style: normal;
        color: var(--text-faint);
    }
    .trail {
        display: flex;
        gap: 3px;
        height: 9px;
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
        flex-shrink: 0;
    }
    .meter span {
        display: block;
        height: 100%;
    }
    .actions {
        position: absolute;
        top: 8px;
        right: 8px;
        opacity: 0;
        transition: opacity 0.15s;
    }
    .card:hover .actions,
    .card.alert .actions {
        opacity: 1;
    }
    .actions button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 2px 8px;
        font-size: 10px;
        background: var(--bg-raised);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
    }
    .actions button.go {
        color: #0f1115;
        background: var(--st-waiting);
        border-color: transparent;
    }
    .dock {
        display: flex;
        align-items: center;
        gap: 14px;
        height: 34px;
        padding: 0 14px;
        font-size: 11px;
        background: var(--bg-sidebar);
        border-top: 1px solid var(--border-subtle);
    }
    .who {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
    }
    .line b {
        color: var(--accent);
    }
    .dim {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--text-muted);
    }
</style>
