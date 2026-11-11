<script lang="ts">
    import { setDemoLang } from './demo-data';
    import GraphDemo from './GraphDemo.svelte';
    import IdeFrame from './IdeFrame.svelte';
    import KanbanDemo from './KanbanDemo.svelte';
    import ProjectDemo from './ProjectDemo.svelte';
    import ReviewDemo from './ReviewDemo.svelte';
    import SessionsDemo from './SessionsDemo.svelte';

    interface Tab {
        id: 'sessions' | 'graph' | 'project' | 'review' | 'kanban';
        title: string;
        description: string;
        bullets: string[];
    }

    interface Props {
        tabs: Tab[];
        labels: Record<string, string>;
        lang: 'es' | 'en';
    }

    let { tabs, labels, lang }: Props = $props();

    // Se fija antes de pintar las pantallas hijas (también durante el render del servidor).
    setDemoLang(lang);

    let current = $state(0);
    const active = $derived(tabs[current]);
    // Índice de actividad (barra lateral) que corresponde a cada pantalla.
    const activity = { sessions: 0, graph: 1, kanban: 2, project: 3, review: 4 } as const;
</script>

<div class="tour">
    <div class="tabs" role="tablist">
        {#each tabs as tab, index (tab.id)}
            <button
                role="tab"
                aria-selected={index === current}
                class="tab cursor-target"
                class:on={index === current}
                onclick={() => (current = index)}
            >
                <span class="num">0{index + 1}</span>
                <span class="text">
                    <strong>{tab.title}</strong>
                    {#if index === current}
                        <span class="desc">{tab.description}</span>
                        <ul>
                            {#each tab.bullets as bullet (bullet)}<li>{bullet}</li>{/each}
                        </ul>
                    {/if}
                </span>
            </button>
        {/each}
    </div>

    <div class="stage">
        <div class="glow"></div>
        <div class="window">
            <IdeFrame
                active={activity[active.id]}
                labels={{
                    search: labels.search,
                    sessions: labels.sessions,
                    waiting: labels.waitingShort,
                    files: labels.files,
                    idle: labels.idleLabel,
                }}
            >
                {#key active.id}
                    {#if active.id === 'sessions'}
                        <SessionsDemo
                            labels={{
                                all: labels.all,
                                attention: labels.attention,
                                working: labels.working,
                                idle: labels.idle,
                                waiting: labels.waiting,
                            }}
                        />
                    {:else if active.id === 'graph'}
                        <GraphDemo labels={{ turn: labels.turn, steps: labels.steps, prompt: labels.prompt }} />
                    {:else if active.id === 'project'}
                        <ProjectDemo labels={{ depth: labels.depth, modules: labels.modules, links: labels.links }} />
                    {:else if active.id === 'review'}
                        <ReviewDemo
                            labels={{
                                reviewed: labels.reviewed,
                                approve: labels.approve,
                                commit: labels.commit,
                                message: labels.commitMessage,
                            }}
                        />
                    {:else}
                        <KanbanDemo
                            labels={{
                                backlog: labels.backlog,
                                doing: labels.doing,
                                review: labels.reviewCol,
                                done: labels.done,
                                start: labels.start,
                                add: labels.add,
                            }}
                        />
                    {/if}
                {/key}
            </IdeFrame>
        </div>
    </div>
</div>

<style>
    .tour {
        display: grid;
        grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
        gap: 40px;
        align-items: start;
    }
    .tabs {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .tab {
        display: flex;
        gap: 14px;
        padding: 14px 16px;
        text-align: left;
        color: var(--text-main);
        background: transparent;
        border: 1px solid transparent;
        border-radius: 14px;
        cursor: pointer;
        opacity: 0.6;
        transition:
            opacity 0.2s,
            background 0.2s,
            border-color 0.2s;
    }
    .tab:hover {
        opacity: 0.9;
    }
    .tab.on {
        opacity: 1;
        background: color-mix(in srgb, var(--text-main) 5%, transparent);
        border-color: var(--border-main);
    }
    .num {
        padding-top: 2px;
        font-family: ui-monospace, monospace;
        font-size: 11px;
        font-weight: 700;
        color: var(--accent);
    }
    .text {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    strong {
        font-size: 16px;
        font-weight: 700;
    }
    .desc {
        font-size: 14px;
        line-height: 1.55;
        opacity: 0.8;
    }
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 13px;
        opacity: 0.75;
    }
    li::before {
        content: '→ ';
        color: var(--accent);
    }
    .stage {
        position: relative;
        min-width: 0;
    }
    .glow {
        position: absolute;
        inset: 8% 6%;
        z-index: -1;
        background: var(--accent);
        opacity: 0.16;
        filter: blur(80px);
        border-radius: 50%;
    }
    .window {
        height: 540px;
        box-shadow: 0 40px 80px -20px rgb(0 0 0 / 0.55);
        border-radius: 14px;
    }
    @media (max-width: 1024px) {
        .tour {
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
        }
        .window {
            height: 480px;
        }
    }
</style>
