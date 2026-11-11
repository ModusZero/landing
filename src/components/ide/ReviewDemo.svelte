<script lang="ts">
    import { CheckCheck, GitCommitHorizontal } from '@lucide/svelte';
    import { changedFiles, diffRows, tr } from './demo-data';

    let { labels }: { labels: { reviewed: string; approve: string; commit: string; message: string } } = $props();

    const tone: Record<string, string> = { M: 'var(--st-waiting)', A: 'var(--ok)', U: 'var(--ok)', D: 'var(--danger)' };
    let selected = $state(0);
    let checked = $state<number[]>([]);
</script>

<div class="review">
    <aside>
        <div class="head mono">
            <span>AUTH-REFACTOR</span><span><b class="ok">+194</b> <b class="del">−51</b></span>
        </div>
        <p class="progress mono">{checked.length}/{changedFiles.length} {labels.reviewed}</p>
        {#each changedFiles as file, index (file.name)}
            <button class="file" class:sel={index === selected} onclick={() => (selected = index)}>
                <b class="mono" style="color:{tone[file.status]}">{file.status}</b>
                <span class="name" class:done={checked.includes(index)}>{file.name} <i>{file.dir}</i></span>
                <span class="mono nums">
                    {#if file.add}<b class="ok">+{file.add}</b>{/if}{#if file.del}<b class="del">−{file.del}</b>{/if}
                </span>
                <span
                    class="tick"
                    class:on={checked.includes(index)}
                    role="checkbox"
                    tabindex="0"
                    aria-checked={checked.includes(index)}
                    onclick={(event) => {
                        event.stopPropagation();
                        checked = checked.includes(index) ? checked.filter((i) => i !== index) : [...checked, index];
                    }}
                    onkeydown={(event) =>
                        event.key === 'Enter' &&
                        (checked = checked.includes(index) ? checked.filter((i) => i !== index) : [...checked, index])}
                    >✓</span
                >
            </button>
        {/each}
    </aside>

    <section>
        <div class="path mono">
            <b>{changedFiles[selected].status}</b>
            {changedFiles[selected].dir}/{changedFiles[selected].name}
        </div>
        <div class="diff mono">
            {#each diffRows as row, index (index)}
                <div class="line {row.type}">
                    <span class="gutter">{row.type === 'add' ? '+' : row.type === 'del' ? '−' : ''}</span>
                    <span class="code">{tr(row.text) || ' '}</span>
                </div>
            {/each}
        </div>
        <footer>
            <span class="input">{labels.message}</span>
            <span class="btn"><CheckCheck size={13} />{labels.approve}</span>
            <span class="btn primary"><GitCommitHorizontal size={13} />{labels.commit}</span>
        </footer>
    </section>
</div>

<style>
    .review {
        display: flex;
        height: 100%;
    }
    aside {
        width: 210px;
        flex-shrink: 0;
        padding: 0 4px;
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
    .progress {
        margin: 0;
        padding: 0 8px 8px;
        font-size: 10px;
        color: var(--text-faint);
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
    .tick.on {
        color: var(--ok);
    }
    .file:hover .tick {
        color: var(--text-faint);
    }
    .file:hover .tick.on {
        color: var(--ok);
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
    .add {
        background: color-mix(in srgb, var(--ok) 11%, transparent);
    }
    .add .gutter {
        color: var(--ok);
    }
    .del.line,
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
