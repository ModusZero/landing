<script lang="ts">
    import {
        FileCode,
        FileDiff,
        FolderTree,
        LayoutGrid,
        Network,
        Search,
        Settings,
        SquareKanban,
    } from '@lucide/svelte';
    import type { Snippet } from 'svelte';
    import { onMount } from 'svelte';
    import { tr } from './demo-data';
    import { demo } from './demo-store.svelte';
    import StatusIcon from './StatusIcon.svelte';

    interface Props {
        /** Índice de la actividad activa: 0 sesiones, 1 grafo, 2 kanban, 3 archivos, 4 revisión. */
        active: number;
        project?: string;
        labels: { search: string; sessions: string; waiting: string; files: string; idle: string };
        children: Snippet;
    }

    let { active, project = 'acme-api', labels, children }: Props = $props();

    onMount(() => demo.connect());

    const icons = [LayoutGrid, Network, SquareKanban, FolderTree, FileDiff, FileCode];
    const counts = $derived({
        working: demo.sessions.filter((s) => s.status === 'working').length,
        waiting: demo.sessions.filter((s) => s.status === 'waiting').length,
        review: demo.sessions.filter((s) => s.status === 'review').length,
    });

    const fmt = (seconds: number) => (seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`);

    function summary(s: (typeof demo.sessions)[number]): string {
        if (s.status === 'waiting') return `${labels.waiting} · ${fmt(s.since)}`;
        if (s.status === 'review') return `${s.files} ${labels.files} · +${s.additions} −${s.deletions}`;
        if (s.status === 'working') return s.now?.target ?? tr(s.now?.label);
        return `${labels.idle} · ${fmt(s.since)}`;
    }
</script>

<div class="ide frame">
    <header class="title">
        <span class="logo"></span>
        <strong>{project}</strong>
        <span class="search"><Search size={12} />{labels.search}<kbd class="mono">Ctrl K</kbd></span>
        <span class="counts mono">
            <span class="c working"><StatusIcon status="working" size={12} />{counts.working}</span>
            <span class="c waiting"><StatusIcon status="waiting" size={12} />{counts.waiting}</span>
            <span class="c review"><StatusIcon status="review" size={12} />{counts.review}</span>
        </span>
    </header>

    <div class="body">
        <nav class="activity">
            {#each icons as Icon, index (index)}
                <span class="act" class:on={index === active}><Icon size={16} strokeWidth={1.75} /></span>
            {/each}
            <span class="act bottom"><Settings size={16} strokeWidth={1.75} /></span>
        </nav>

        <main class="main">{@render children()}</main>

        <aside class="rail">
            <div class="rail-title">{labels.sessions}</div>
            {#each demo.sessions as s (s.id)}
                <button
                    class="row"
                    class:focus={demo.focused === s.id}
                    class:alert={s.status === 'waiting'}
                    onclick={() => (demo.focused = s.id)}
                >
                    <span class="bar" style="background:var(--s{s.color})"></span>
                    <span class="line"
                        ><StatusIcon status={s.status} size={12} /><span class="name">{s.name}</span></span
                    >
                    <span class="sub" class:waiting={s.status === 'waiting'} class:review={s.status === 'review'}
                        >{summary(s)}</span
                    >
                </button>
            {/each}
        </aside>
    </div>
</div>

<style>
    .frame {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        overflow: hidden;
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
    }
    .title {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 36px;
        padding: 0 12px;
        background: var(--bg-sidebar);
        border-bottom: 1px solid var(--border-subtle);
    }
    .logo {
        width: 14px;
        height: 14px;
        border-radius: 4px;
        background: var(--accent);
    }
    .search {
        display: flex;
        align-items: center;
        gap: 7px;
        margin: 0 auto;
        width: min(320px, 42%);
        height: 24px;
        padding: 0 8px;
        color: var(--text-muted);
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        font-size: 12px;
    }
    .search kbd {
        margin-left: auto;
        padding: 0 5px;
        font-size: 10px;
        border: 1px solid var(--border-subtle);
        border-radius: 4px;
    }
    .counts {
        display: flex;
        gap: 10px;
        font-size: 12px;
    }
    .c {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .c.working {
        color: var(--st-working);
    }
    .c.waiting {
        color: var(--st-waiting);
    }
    .c.review {
        color: var(--st-review);
    }
    .body {
        display: flex;
        flex: 1;
        min-height: 0;
    }
    .activity {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 42px;
        padding: 8px 0;
        align-items: center;
        background: var(--bg-sidebar);
        border-right: 1px solid var(--border-subtle);
    }
    .act {
        display: flex;
        width: 30px;
        height: 30px;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        border-radius: 8px;
    }
    .act.on {
        color: var(--accent);
        background: var(--accent-soft);
    }
    .act.bottom {
        margin-top: auto;
    }
    .main {
        flex: 1;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
    }
    .rail {
        width: 188px;
        padding: 0 6px 8px;
        overflow: hidden;
        background: var(--bg-sidebar);
        border-left: 1px solid var(--border-subtle);
    }
    .rail-title {
        padding: 10px 6px 8px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-muted);
    }
    .row {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1px;
        padding: 5px 8px 5px 12px;
        margin-bottom: 2px;
        text-align: left;
        border-radius: 8px;
    }
    .row:hover {
        background: var(--bg-hover);
    }
    .row.focus {
        background: var(--bg-active);
    }
    .row.alert {
        background: color-mix(in srgb, var(--st-waiting) 9%, transparent);
    }
    .bar {
        position: absolute;
        top: 7px;
        bottom: 7px;
        left: 2px;
        width: 2px;
        border-radius: 2px;
    }
    .line {
        display: flex;
        align-items: center;
        gap: 7px;
    }
    .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
    }
    .sub {
        padding-left: 19px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 11px;
        color: var(--text-faint);
    }
    .sub.waiting {
        color: var(--st-waiting);
    }
    .sub.review {
        color: var(--st-review);
    }
    @media (max-width: 760px) {
        .rail {
            display: none;
        }
        .search {
            display: none;
        }
    }
</style>
