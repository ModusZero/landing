<script lang="ts">
    import { CheckCheck, ChevronDown, ChevronRight, Folder, GitCommitHorizontal, List, ListTree } from '@lucide/svelte';
    import { changedPaths, diffsByFile, tr, u } from './demo-data';

    let { labels }: { labels: { reviewed: string; approve: string; commit: string; message: string } } = $props();

    const tone: Record<string, string> = { M: 'var(--st-waiting)', A: 'var(--ok)', U: 'var(--ok)', D: 'var(--danger)' };
    const base = (path: string) => path.split('/').pop()!;
    const dir = (path: string) => path.split('/').slice(0, -1).join('/');

    let selected = $state(changedPaths[0].path);
    let checked = $state<string[]>([]);
    let view = $state<'list' | 'tree'>('list');
    let closed = $state<Record<string, boolean>>({});
    let committed = $state(false);

    const groups = $derived(
        [...new Set(changedPaths.map((c) => dir(c.path)))].map((d) => ({
            dir: d,
            files: changedPaths.filter((c) => dir(c.path) === d),
        })),
    );
    const rows = $derived(diffsByFile[selected] ?? []);
    const totals = {
        add: changedPaths.reduce((n, c) => n + c.add, 0),
        del: changedPaths.reduce((n, c) => n + c.del, 0),
    };

    function mark(path: string) {
        checked = checked.includes(path) ? checked.filter((p) => p !== path) : [...checked, path];
    }
    function approveAll() {
        checked = changedPaths.map((c) => c.path);
    }
    function commit() {
        approveAll();
        committed = true;
        setTimeout(() => (committed = false), 3200);
    }
</script>

{#snippet file(c: (typeof changedPaths)[number], indent: boolean)}
    <button class="file" class:sel={c.path === selected} onclick={() => (selected = c.path)}>
        <b class="mono" style="color:{tone[c.status]}">{c.status}</b>
        <span class="name" class:done={checked.includes(c.path)}
            >{base(c.path)}{#if !indent}
                <i>{dir(c.path)}</i>{/if}</span
        >
        <span class="mono nums"
            >{#if c.add}<b class="ok">+{c.add}</b>{/if}{#if c.del}<b class="del">−{c.del}</b>{/if}</span
        >
        <span
            class="tick"
            class:on={checked.includes(c.path)}
            role="checkbox"
            tabindex="0"
            aria-checked={checked.includes(c.path)}
            onclick={(e) => (e.stopPropagation(), mark(c.path))}
            onkeydown={(e) => e.key === 'Enter' && mark(c.path)}>✓</span
        >
    </button>
{/snippet}

<div class="review">
    <aside>
        <div class="head mono">
            <span>AUTH-REFACTOR</span><span><b class="ok">+{totals.add}</b> <b class="del">−{totals.del}</b></span>
        </div>
        <div class="sub">
            <span class="mono progress">{checked.length}/{changedPaths.length} {labels.reviewed}</span>
            <span class="toggle">
                <button class:on={view === 'list'} title={u('list')} onclick={() => (view = 'list')}
                    ><List size={12} /></button
                >
                <button class:on={view === 'tree'} title={u('tree')} onclick={() => (view = 'tree')}
                    ><ListTree size={12} /></button
                >
            </span>
        </div>
        {#if view === 'list'}
            {#each changedPaths as c (c.path)}{@render file(c, false)}{/each}
        {:else}
            {#each groups as g (g.dir)}
                <button class="folder" onclick={() => (closed[g.dir] = !closed[g.dir])}>
                    {#if closed[g.dir]}<ChevronRight size={12} />{:else}<ChevronDown size={12} />{/if}<Folder
                        size={12}
                        style="color:var(--accent)"
                    /><span>{g.dir}</span><i class="mono">{g.files.length}</i>
                </button>
                {#if !closed[g.dir]}<div class="indent">
                        {#each g.files as c (c.path)}{@render file(c, true)}{/each}
                    </div>{/if}
            {/each}
        {/if}
    </aside>

    <section>
        <div class="path mono"><b>{changedPaths.find((c) => c.path === selected)?.status}</b> {selected}</div>
        <div class="diff mono">
            {#each rows as row, index (index)}
                <div class="line {row.type}">
                    <span class="gutter">{row.type === 'add' ? '+' : row.type === 'del' ? '−' : ''}</span><span
                        class="code">{tr(row.text) || ' '}</span
                    >
                </div>
            {/each}
        </div>
        <footer>
            <span class="input">{committed ? `✓ ${u('commitDone')}` : labels.message}</span>
            <button class="btn" onclick={approveAll}><CheckCheck size={13} />{labels.approve}</button>
            <button class="btn primary" onclick={commit}><GitCommitHorizontal size={13} />{labels.commit}</button>
        </footer>
    </section>
</div>

<style>
    .review {
        display: flex;
        height: 100%;
    }
    aside {
        width: 220px;
        flex-shrink: 0;
        padding: 0 4px;
        overflow: hidden;
        background: var(--bg-sidebar);
        border-right: 1px solid var(--border-subtle);
    }
    .head {
        display: flex;
        justify-content: space-between;
        padding: 12px 8px 6px;
        font-size: 10px;
        letter-spacing: 0.06em;
        color: var(--text-muted);
    }
    .sub {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px 8px;
    }
    .progress {
        font-size: 10px;
        color: var(--text-faint);
    }
    .toggle {
        display: inline-flex;
        padding: 2px;
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
    }
    .toggle button {
        display: flex;
        width: 20px;
        height: 18px;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        border-radius: 4px;
    }
    .toggle button.on {
        color: var(--text-main);
        background: var(--bg-raised);
    }
    .file {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 7px;
        padding: 5px 6px;
        text-align: left;
        border-radius: 6px;
        font-size: 12px;
    }
    .file:hover,
    .file.sel {
        background: var(--bg-active);
    }
    .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .name.done {
        color: var(--text-faint);
        text-decoration: line-through;
    }
    .name i {
        font-style: normal;
        font-size: 10px;
        color: var(--text-faint);
    }
    .nums {
        display: flex;
        gap: 4px;
        font-size: 10px;
    }
    .ok {
        color: var(--ok);
        font-weight: 400;
    }
    .del {
        color: var(--danger);
        font-weight: 400;
    }
    .tick {
        width: 14px;
        color: transparent;
        font-size: 11px;
        text-align: center;
    }
    .tick.on,
    .file:hover .tick.on {
        color: var(--ok);
    }
    .file:hover .tick {
        color: var(--text-faint);
    }
    .folder {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 6px;
        padding: 4px 6px;
        font-size: 12px;
        color: var(--text-muted);
        border-radius: 6px;
    }
    .folder:hover {
        background: var(--bg-hover);
    }
    .folder span {
        flex: 1;
        text-align: left;
    }
    .folder i {
        font-style: normal;
        font-size: 10px;
        color: var(--text-faint);
    }
    .indent {
        padding-left: 10px;
    }
    section {
        display: flex;
        flex: 1;
        min-width: 0;
        flex-direction: column;
    }
    .path {
        padding: 11px 14px;
        font-size: 12px;
        border-bottom: 1px solid var(--border-subtle);
    }
    .diff {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        font-size: 11.5px;
        line-height: 1.7;
    }
    .line {
        display: flex;
        white-space: pre;
    }
    .gutter {
        width: 30px;
        flex-shrink: 0;
        text-align: center;
        color: var(--text-faint);
    }
    .line.add {
        background: color-mix(in srgb, var(--ok) 11%, transparent);
    }
    .line.add .gutter {
        color: var(--ok);
    }
    .line.del {
        background: color-mix(in srgb, var(--danger) 11%, transparent);
    }
    .line.del .gutter {
        color: var(--danger);
    }
    .code {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    footer {
        display: flex;
        gap: 8px;
        padding: 9px;
        background: var(--bg-sidebar);
        border-top: 1px solid var(--border-subtle);
    }
    .input {
        flex: 1;
        padding: 5px 10px;
        font-size: 12px;
        color: var(--text-muted);
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
    }
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 10px;
        font-size: 12px;
        background: var(--bg-raised);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
    }
    .btn.primary {
        color: #0f1115;
        background: var(--accent);
        border-color: transparent;
    }
    @media (max-width: 760px) {
        aside {
            width: 150px;
        }
        .nums {
            display: none;
        }
    }
</style>
