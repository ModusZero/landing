<script lang="ts">
    import { Play } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { kanbanSeed, tr } from './demo-data';
    import { demo } from './demo-store.svelte';
    import StatusIcon from './StatusIcon.svelte';

    let {
        labels,
    }: { labels: { backlog: string; doing: string; review: string; done: string; start: string; add: string } } =
        $props();

    onMount(() => demo.connect());

    const columns = ['backlog', 'doing', 'review', 'done'] as const;

    /** Las tareas ligadas a una sesión siguen su estado: así se mueve el tablero solo. */
    const tasks = $derived(
        kanbanSeed.map((task) => {
            const session = demo.sessions.find((s) => s.id === task.session);
            const column = !session
                ? task.column
                : session.status === 'review'
                  ? 'review'
                  : session.status === 'idle'
                    ? 'done'
                    : 'doing';
            return { ...task, column, session };
        }),
    );
</script>

<div class="board">
    {#each columns as column (column)}
        <section>
            <h4>{labels[column]} <i class="mono">{tasks.filter((t) => t.column === column).length}</i></h4>
            <div class="cards">
                {#each tasks.filter((t) => t.column === column) as task (task.id)}
                    <article>
                        <p>{tr(task.title)}</p>
                        {#if task.session}
                            <span class="chip"
                                ><StatusIcon status={task.session.status} size={11} />{task.session.name}</span
                            >
                        {:else if column !== 'done'}
                            <span class="start"><Play size={11} />{labels.start}</span>
                        {/if}
                    </article>
                {/each}
            </div>
            <div class="add">{labels.add}</div>
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
        background: var(--bg-raised);
        border: 1px solid var(--border-subtle);
        border-radius: 9px;
        animation: pop 0.4s ease-out;
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
    .add {
        padding: 9px 12px;
        font-size: 12px;
        color: var(--text-faint);
        border-top: 1px solid var(--border-subtle);
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
