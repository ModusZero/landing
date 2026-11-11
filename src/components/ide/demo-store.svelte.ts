import { initialSessions, workSteps, type DemoSession } from './demo-data';

/**
 * Simulación compartida por todas las pantallas de la maqueta: las sesiones cambian de estado
 * con el tiempo, igual que en la app real, y cada pantalla muestra la misma "verdad".
 */
class DemoStore {
    sessions = $state<DemoSession[]>(structuredClone(initialSessions));
    focused = $state('a');
    tick = $state(0);

    private timer: ReturnType<typeof setInterval> | undefined;
    private users = 0;

    /** Arranca la simulación mientras haya al menos una pantalla usándola. */
    connect(): () => void {
        this.users++;
        if (!this.timer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

    private step() {
        this.tick++;
        for (const session of this.sessions) session.since += 2;

        const working = this.sessions.filter((s) => s.status === 'working');
        const pick = working[this.tick % Math.max(working.length, 1)];

        // El paso actual de la sesión que trabaja va rotando.
        if (pick) {
            pick.now = workSteps[(this.tick + pick.turns) % workSteps.length];
            pick.additions += 1 + (this.tick % 5);
            pick.context = Math.min(0.95, pick.context + 0.004);
        }

        // Cada cierto tiempo una sesión se bloquea pidiendo permiso, y otra termina y pasa a revisión.
        if (this.tick % 6 === 3 && working.length > 1)
            this.transition(working[0], 'waiting', { family: 'exec', label: 'git push origin' });
        if (this.tick % 6 === 0) {
            const blocked = this.sessions.find((s) => s.status === 'waiting');
            if (blocked) this.transition(blocked, 'working', workSteps[0]);
        }
        if (this.tick % 9 === 7 && working.length > 2) this.transition(working[working.length - 1], 'review', null);
        if (this.tick % 9 === 2) {
            const reviewed = this.sessions.find((s) => s.status === 'review');
            if (reviewed) this.transition(reviewed, 'idle', null);
        }
        if (this.tick % 12 === 11) {
            const idle = this.sessions.find((s) => s.status === 'idle');
            if (idle) this.transition(idle, 'working', workSteps[2]);
        }
    }

    private transition(session: DemoSession, status: DemoSession['status'], now: DemoSession['now']) {
        session.status = status;
        session.since = 0;
        session.now = now;
    }
}

export const demo = new DemoStore();
