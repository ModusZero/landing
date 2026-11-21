<script lang="ts">
    import { Play } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { kanbanSeed, tr, u } from './demo-data';
    import { demo } from './demo-store.svelte';
    import StatusIcon from './StatusIcon.svelte';

    let {
        labels,
    }: { labels: { backlog: string; doing: string; review: string; done: string; start: string; add: string } } =
        $props();

    type Column = 'backlog' | 'doing' | 'review' | 'done';
    const columns: Column[] = ['backlog', 'doing', 'review', 'done'];

    let tasks = $state(kanbanSeed.map((task) => ({ ...task, pinned: false })));
    let over = $state<Column | null>(null);
    let draft = $state<Record<string, string>>({});
    let nextId = 100;

    onMount(() => demo.connect());

    /** Las tareas ligadas a una sesión siguen su estado, salvo que el visitante las haya movido a mano. */
    const placed = $derived(
        tasks.map((task) => {
            const session = task.session ? demo.get(task.session) : undefined;
            const auto: Column | null = !session
                ? null
                : session.status === 'review'
                  ? 'review'
                  : session.status === 'idle'
                    ? 'done'
                    : 'doing';
            return { ...task, shown: (!task.pinned && auto ? auto : task.column) as Column, linked: session };
        }),
    );

    function drop(event: DragEvent, column: Column) {
        event.preventDefault();
        over = null;
        const id = Number(event.dataTransfer?.getData('text/plain'));
        const task = tasks.find((t) => t.id === id);
        if (task) ((task.column = column), (task.pinned = true), demo.touch());
    }

    function add(column: Column) {
        const title = draft[column]?.trim();
        if (!title) return;
        tasks.push({ id: nextId++, title, session: null, column, pinned: true });
        draft[column] = '';
        demo.touch();
    }

    function start(id: number) {
        demo.spawn();
        const task = tasks.find((t) => t.id === id);
        if (task) ((task.session = demo.focused), (task.pinned = false), (task.column = 'doing'));
    }
</script>

<div class="board">
    {#each columns as column (column)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <section
            class:over={over === column}
            ondragover={(e) => (e.preventDefault(), (over = column))}
            ondragleave={() => (over = null)}
            ondrop={(e) => drop(e, column)}
        >
            <h4>{labels[column]} <i class="mono">{placed.filter((t) => t.shown === column).length}</i></h4>
            <div class="cards">
                {#each placed.filter((t) => t.shown === column) as task (task.id)}
                    <article
                        draggable="true"
                        ondragstart={(e) => e.dataTransfer?.setData('text/plain', String(task.id))}
                    >
                        <p>{tr(task.title)}</p>
                        {#if task.linked}
                            <span class="chip"
                                ><StatusIcon status={task.linked.status} size={11} />{task.linked.name}</span
                            >
                        {:else if column === 'backlog'}
                            <button class="start" onclick={() => start(task.id)}
                                ><Play size={11} />{labels.start}</button
                            >
                        {/if}
                    </article>
                {/each}
            </div>
            <form class="add" onsubmit={(e) => (e.preventDefault(), add(column))}>
                <input placeholder={labels.add} bind:value={draft[column]} onfocus={() => demo.touch()} />
            </form>
        </section>
    {/each}
</div>

<style>
    .board {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        height: 100%;
        padding: 12px;
    }
    section {
        display: flex;
        min-height: 0;
        flex-direction: column;
        background: var(--bg-sidebar);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        transition:
            border-color 0.15s,
            background 0.15s;
    }
    section.over {
        border-color: color-mix(in srgb, var(--accent) 60%, transparent);
        background: var(--accent-soft);
    }
    h4 {
        margin: 0;
        padding: 11px 12px 8px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-muted);
    }
    h4 i {
        margin-left: 4px;
        font-style: normal;
        color: var(--text-faint);
    }
    .cards {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 7px;
        padding: 0 8px;
        overflow: hidden;
    }
    article {
        padding: 8px 9px;
        cursor: grab;
        background: var(--bg-raised);
        border: 1px solid var(--border-subtle);
        border-radius: 9px;
        animation: pop 0.4s ease-out;
    }
    article:active {
        cursor: grabbing;
    }
    article p {
        margin: 0 0 6px;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-main);
    }
    .chip {
        display: inline-flex;
        max-width: 100%;
        align-items: center;
        gap: 6px;
        padding: 1px 7px;
        font-size: 11px;
        background: var(--bg-hover);
        border-radius: 5px;
    }
    .start {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: var(--text-muted);
    }
    .start:hover {
        color: var(--accent);
    }
    .add {
        padding: 6px 8px;
        border-top: 1px solid var(--border-subtle);
    }
    .add input {
        width: 100%;
        padding: 3px 4px;
        font: inherit;
        font-size: 12px;
        color: var(--text-main);
        background: transparent;
        border: 0;
        outline: none;
    }
    .add input::placeholder {
        color: var(--text-faint);
    }
    @keyframes pop {
        from {
            opacity: 0;
            transform: scale(0.97);
        }
    }
    @media (max-width: 760px) {
        .board {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            overflow: hidden;
        }
    }
</style>
