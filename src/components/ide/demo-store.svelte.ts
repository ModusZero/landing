import { initialSessions, u, workSteps, type DemoSession } from './demo-data';

const POOL = ['api-limits', 'seed-data', 'ui-polish', 'e2e-flaky', 'sdk-docs', 'ci-matrix'];

/**
 * Simulación compartida por todas las pantallas de la maqueta: las sesiones cambian de estado con el tiempo,
 * igual que en la app real, y cada pantalla muestra la misma "verdad". Una historia guionada recorre los casos
 * más interesantes (permiso pendiente, salto a la sesión, aprobación, revisión) y se pausa cuando el visitante
 * interactúa, para dejarle explorar.
 */
class DemoStore {
    sessions = $state<DemoSession[]>(structuredClone(initialSessions));
    focused = $state('a');
    tick = $state(0);
    caption = $state('');
    toast = $state<string | null>(null);
    playing = $state(true);

    private timer: ReturnType<typeof setInterval> | undefined;
    private users = 0;
    private idleUntil = 0;
    private spawned = 0;
    private storyAt = 0;

    /** Arranca la simulación mientras haya al menos una pantalla usándola. */
    connect(): () => void {
        this.users++;
        if (!this.timer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.caption = u('s0');
            this.timer = setInterval(() => this.step(), 2200);
        }
        return () => {
            this.users--;
            if (this.users <= 0 && this.timer) {
                clearInterval(this.timer);
                this.timer = undefined;
            }
        };
    }

    /** El visitante interactuó: la historia espera unos segundos para no pisarle lo que hace. */
    touch() {
        this.idleUntil = Date.now() + 14000;
    }

    get(id: string) {
        return this.sessions.find((s) => s.id === id);
    }

    focus(id: string) {
        this.touch();
        this.focused = id;
    }

    approve(id: string) {
        this.touch();
        this.transition(id, 'working', workSteps[0]);
    }

    stop(id: string) {
        this.touch();
        this.transition(id, 'idle', null);
    }

    resume(id: string) {
        this.touch();
        this.transition(id, 'working', workSteps[2]);
    }

    spawn() {
        this.touch();
        const name = POOL[this.spawned++ % POOL.length];
        const color = this.sessions.length % 8;
        this.sessions.push({
            id: `n${this.spawned}`,
            name,
            branch: `mod0/${name}`,
            color,
            status: 'working',
            since: 0,
            now: workSteps[0],
            additions: 0,
            deletions: 0,
            files: 0,
            context: 0.05,
            turns: 1,
            message: '',
        });
        this.focused = `n${this.spawned}`;
    }

    togglePlay() {
        this.playing = !this.playing;
        this.idleUntil = 0;
    }

    restart() {
        this.sessions = structuredClone(initialSessions);
        this.focused = 'a';
        this.storyAt = 0;
        this.toast = null;
        this.caption = u('s0');
        this.idleUntil = 0;
        this.playing = true;
    }

    /** Guion: [segundos desde el inicio, subtítulo, acción]. */
    private script: Array<[number, string, (() => void) | undefined]> = [
        [1, 's1', () => (this.toast = `payments-webhook ${u('needsYou')}`)],
        [3, 's2', () => (this.focused = 'b')],
        [5, 's3', () => (this.transition('b', 'working', workSteps[0]), (this.toast = null))],
        [7, 's4', undefined],
        [
            9,
            's5',
            () => (
                this.transition('a', 'waiting', { family: 'exec', label: 'git push origin' }),
                (this.toast = `auth-refactor ${u('needsYou')}`),
                (this.focused = 'a')
            ),
        ],
        [11, 's6', () => (this.transition('a', 'working', workSteps[3]), (this.toast = null))],
        [13, 's7', () => (this.transition('e', 'review', null), (this.toast = `perf-queries ${u('readyReview')}`))],
        [15, 's8', () => (this.transition('d', 'idle', null), (this.toast = null))],
        [18, 's0', () => this.restart()],
    ];

    private step() {
        for (const session of this.sessions) session.since += 2;
        if (!this.playing) return;
        this.tick++;

        // El paso actual de las sesiones que trabajan va rotando.
        const working = this.sessions.filter((s) => s.status === 'working');
        const pick = working[this.tick % Math.max(working.length, 1)];
        if (pick) {
            pick.now = workSteps[(this.tick + pick.turns) % workSteps.length];
            pick.additions += 1 + (this.tick % 5);
            pick.context = Math.min(0.95, pick.context + 0.004);
        }

        if (Date.now() < this.idleUntil) return;
        this.storyAt++;
        const entry = this.script.find(([at]) => at === this.storyAt);
        if (entry) {
            this.caption = u(entry[1]);
            entry[2]?.();
        }
    }

    private transition(id: string, status: DemoSession['status'], now: DemoSession['now']) {
        const session = this.get(id);
        if (!session) return;
        session.status = status;
        session.since = 0;
        session.now = now;
    }
}

export const demo = new DemoStore();
