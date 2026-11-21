/** Datos de ejemplo de la maqueta del IDE. Reflejan lo que muestra la app real. */

export type DemoStatus = 'working' | 'waiting' | 'review' | 'idle';
export type DemoFamily = 'read' | 'write' | 'exec' | 'search';

export interface DemoSession {
    id: string;
    name: string;
    branch: string;
    color: number;
    status: DemoStatus;
    /** Segundos que lleva en el estado actual. */
    since: number;
    now: { family: DemoFamily; label: string; target?: string } | null;
    additions: number;
    deletions: number;
    files: number;
    context: number;
    turns: number;
    message: string;
}

export const initialSessions: DemoSession[] = [
    {
        id: 'a',
        name: 'auth-refactor',
        branch: 'mod0/auth-refactor',
        color: 0,
        status: 'working',
        since: 120,
        now: { family: 'write', label: 'Editar session.ts', target: 'session.ts' },
        additions: 142,
        deletions: 38,
        files: 6,
        context: 0.59,
        turns: 4,
        message: '',
    },
    {
        id: 'b',
        name: 'payments-webhook',
        branch: 'mod0/payments-webhook',
        color: 1,
        status: 'waiting',
        since: 360,
        now: { family: 'exec', label: 'npm run migrate' },
        additions: 57,
        deletions: 4,
        files: 3,
        context: 0.36,
        turns: 2,
        message: '',
    },
    {
        id: 'c',
        name: 'fix-flaky-tests',
        branch: 'mod0/fix-flaky-tests',
        color: 2,
        status: 'review',
        since: 660,
        now: null,
        additions: 86,
        deletions: 21,
        files: 6,
        context: 0.48,
        turns: 3,
        message: '…el problema era un temporizador compartido entre suites.',
    },
    {
        id: 'd',
        name: 'docs-api',
        branch: 'main',
        color: 3,
        status: 'working',
        since: 60,
        now: { family: 'read', label: 'Leer README.md', target: 'README.md' },
        additions: 12,
        deletions: 0,
        files: 1,
        context: 0.15,
        turns: 1,
        message: '',
    },
    {
        id: 'e',
        name: 'perf-queries',
        branch: 'mod0/perf-queries',
        color: 4,
        status: 'working',
        since: 240,
        now: { family: 'search', label: 'Grep "SELECT … FROM orders"' },
        additions: 29,
        deletions: 11,
        files: 2,
        context: 0.82,
        turns: 2,
        message: '',
    },
    {
        id: 'f',
        name: 'ci-cache',
        branch: 'mod0/ci-cache',
        color: 5,
        status: 'review',
        since: 1500,
        now: null,
        additions: 41,
        deletions: 9,
        files: 2,
        context: 0.3,
        turns: 3,
        message: '…CI de 9 a 4 minutos con caché de dependencias.',
    },
];

/** Pasos que "ejecuta" una sesión simulada mientras trabaja. */
export const workSteps: Array<NonNullable<DemoSession['now']>> = [
    { family: 'read', label: 'Leer tokens.ts', target: 'tokens.ts' },
    { family: 'search', label: 'Grep "refreshToken"' },
    { family: 'write', label: 'Editar guard.ts', target: 'guard.ts' },
    { family: 'exec', label: 'npm test -- auth' },
    { family: 'write', label: 'Editar routes.ts', target: 'routes.ts' },
    { family: 'read', label: 'Leer schema.sql', target: 'schema.sql' },
];

export const graphScript: Array<{
    family: DemoFamily | 'prompt' | 'stop';
    label: string;
    target?: string;
    intent?: string;
    lane?: number;
    ms?: number;
}> = [
    { family: 'prompt', label: 'Refactoriza la autenticación a tokens rotativos' },
    {
        family: 'read',
        label: 'Leer session.ts',
        target: 'session.ts',
        intent: 'Primero reviso cómo se crean las sesiones hoy.',
        ms: 420,
    },
    { family: 'search', label: 'Grep "refreshToken"', intent: 'Busco todos los usos del refresh token.', ms: 310 },
    { family: 'read', label: 'Leer routes.ts', target: 'routes.ts', lane: 1, ms: 350 },
    { family: 'read', label: 'Leer tokens.ts', target: 'tokens.ts', ms: 380 },
    {
        family: 'write',
        label: 'Editar tokens.ts',
        target: 'tokens.ts',
        intent: 'Implemento la rotación: cada refresh invalida el anterior.',
        ms: 900,
    },
    {
        family: 'write',
        label: 'Editar session.ts',
        target: 'session.ts',
        intent: 'Conecto la sesión con el nuevo flujo.',
        ms: 1200,
    },
    { family: 'exec', label: 'npm test -- auth', intent: 'Corro los tests del módulo para validar.', ms: 8400 },
    {
        family: 'write',
        label: 'Editar guard.ts',
        target: 'guard.ts',
        intent: 'Ajusto el guard al nuevo formato.',
        ms: 700,
    },
    { family: 'stop', label: 'Listo' },
];

export const modules: Array<[string, number, number]> = [
    ['api', 14, 6],
    ['auth', 9, 4],
    ['db', 12, 7],
    ['jobs', 7, 3],
    ['middleware', 5, 2],
    ['payments', 10, 5],
    ['config', 3, 1],
    ['lib', 11, 6],
    ['models', 8, 5],
    ['queue', 6, 2],
    ['mail', 4, 2],
    ['unit', 18, 8],
    ['e2e', 6, 3],
];

export const moduleLinks: Array<[string, string, number]> = [
    ['api', 'auth', 7],
    ['api', 'payments', 5],
    ['api', 'middleware', 4],
    ['api', 'lib', 9],
    ['auth', 'db', 6],
    ['auth', 'models', 5],
    ['auth', 'config', 2],
    ['payments', 'db', 6],
    ['payments', 'queue', 3],
    ['payments', 'mail', 2],
    ['jobs', 'queue', 5],
    ['jobs', 'db', 4],
    ['middleware', 'auth', 3],
    ['db', 'models', 8],
    ['db', 'config', 2],
    ['queue', 'lib', 3],
    ['mail', 'lib', 2],
    ['unit', 'auth', 6],
    ['unit', 'payments', 4],
    ['unit', 'lib', 5],
    ['e2e', 'api', 5],
];

/** Módulo del grafo en el que trabaja cada sesión (para los anillos de color). */
export const sessionModule: Record<string, string> = {
    a: 'auth',
    b: 'payments',
    c: 'unit',
    d: 'api',
    e: 'db',
    f: 'jobs',
};

export const diffRows: Array<{ type: 'ctx' | 'add' | 'del'; text: string }> = [
    { type: 'ctx', text: "import { sign, verify } from './crypto';" },
    { type: 'ctx', text: "import { db } from '../db';" },
    { type: 'add', text: "import { rotate } from './rotation';" },
    { type: 'ctx', text: '' },
    { type: 'del', text: 'const TTL = 60 * 60;' },
    { type: 'add', text: 'const TTL = 60 * 15;' },
    { type: 'add', text: 'const REFRESH_TTL = 60 * 60 * 24 * 7;' },
    { type: 'ctx', text: '' },
    { type: 'del', text: 'export async function issueTokens(userId: string) {' },
    { type: 'add', text: 'export async function issueTokens(userId: string, family = crypto.randomUUID()) {' },
    { type: 'ctx', text: '    const access = sign({ sub: userId }, TTL);' },
    { type: 'del', text: "    const refresh = sign({ sub: userId, kind: 'refresh' }, TTL * 24);" },
    { type: 'add', text: "    const refresh = sign({ sub: userId, kind: 'refresh', family }, REFRESH_TTL);" },
    { type: 'add', text: '    await db.tokens.create({ userId, family, hash: refresh });' },
    { type: 'ctx', text: '    return { access, refresh };' },
    { type: 'ctx', text: '}' },
    { type: 'ctx', text: '' },
    { type: 'add', text: '// Cada refresh invalida el anterior; si se reutiliza uno viejo, se revoca la familia.' },
    { type: 'add', text: 'const rotated = await rotate(payload.family, token);' },
    { type: 'add', text: "if (!rotated) throw new Error('token reuse detected');" },
];

export const changedFiles = [
    { status: 'M', name: 'tokens.ts', dir: 'src/auth', add: 48, del: 12 },
    { status: 'M', name: 'session.ts', dir: 'src/auth', add: 31, del: 9 },
    { status: 'M', name: 'guard.ts', dir: 'src/middleware', add: 14, del: 6 },
    { status: 'A', name: 'rotation.ts', dir: 'src/auth', add: 39, del: 0 },
    { status: 'U', name: 'tokens.test.ts', dir: 'tests/unit', add: 62, del: 0 },
    { status: 'D', name: 'legacy.ts', dir: 'src/auth', add: 0, del: 24 },
];

export const kanbanSeed = [
    { id: 1, title: 'Migrar a tokens rotativos', session: 'a', column: 'doing' },
    { id: 2, title: 'Webhook de pagos idempotente', session: 'b', column: 'doing' },
    { id: 3, title: 'Estabilizar tests intermitentes', session: 'c', column: 'review' },
    { id: 4, title: 'Reducir tiempo de CI', session: 'f', column: 'review' },
    { id: 5, title: 'Rate limiting por IP', session: null, column: 'backlog' },
    { id: 6, title: 'Paginación por cursor', session: null, column: 'backlog' },
    { id: 7, title: 'Exportar facturas a PDF', session: null, column: 'backlog' },
    { id: 8, title: 'Actualizar a Node 24', session: null, column: 'done' },
] as Array<{ id: number; title: string; session: string | null; column: 'backlog' | 'doing' | 'review' | 'done' }>;

/** Textos de ejemplo en inglés (los datos están escritos en español). */
const EN: Record<string, string> = {
    'Hace idempotente el webhook de pagos': 'Make the payments webhook idempotent',
    'Estabiliza los tests intermitentes': 'Stabilize the flaky tests',
    'Actualiza la documentación del endpoint': 'Update the endpoint documentation',
    'Optimiza las consultas de orders': 'Optimize the orders queries',
    'Reduce el tiempo de CI': 'Reduce CI time',
    'Implementar la rotación': 'Implement rotation',
    'Editar session.ts': 'Edit session.ts',
    'Leer README.md': 'Read README.md',
    'Leer tokens.ts': 'Read tokens.ts',
    'Editar guard.ts': 'Edit guard.ts',
    'Editar routes.ts': 'Edit routes.ts',
    'Leer schema.sql': 'Read schema.sql',
    'Leer session.ts': 'Read session.ts',
    'Leer routes.ts': 'Read routes.ts',
    'Editar tokens.ts': 'Edit tokens.ts',
    Listo: 'Done',
    'Refactoriza la autenticación a tokens rotativos': 'Refactor authentication to rotating tokens',
    '…el problema era un temporizador compartido entre suites.': '…the problem was a timer shared between suites.',
    '…CI de 9 a 4 minutos con caché de dependencias.': '…CI from 9 to 4 minutes with dependency caching.',
    'Primero reviso cómo se crean las sesiones hoy.': 'First I check how sessions are created today.',
    'Busco todos los usos del refresh token.': 'I look for every use of the refresh token.',
    'Implemento la rotación: cada refresh invalida el anterior.':
        'I implement rotation: every refresh invalidates the previous one.',
    'Conecto la sesión con el nuevo flujo.': 'I wire the session to the new flow.',
    'Corro los tests del módulo para validar.': 'I run the module tests to validate.',
    'Ajusto el guard al nuevo formato.': 'I adjust the guard to the new format.',
    '// Cada refresh invalida el anterior; si se reutiliza uno viejo, se revoca la familia.':
        '// Every refresh invalidates the previous one; reusing an old one revokes the family.',
    'Migrar a tokens rotativos': 'Migrate to rotating tokens',
    'Webhook de pagos idempotente': 'Idempotent payments webhook',
    'Estabilizar tests intermitentes': 'Stabilize flaky tests',
    'Reducir tiempo de CI': 'Reduce CI time',
    'Rate limiting por IP': 'Per-IP rate limiting',
    'Paginación por cursor': 'Cursor pagination',
    'Exportar facturas a PDF': 'Export invoices to PDF',
    'Actualizar a Node 24': 'Upgrade to Node 24',
};

let lang: 'es' | 'en' = 'es';

export const setDemoLang = (value: 'es' | 'en') => {
    lang = value;
};

/** Traduce un texto de ejemplo al idioma de la página. */
export const tr = (text?: string | null): string => (text ? (lang === 'en' ? (EN[text] ?? text) : text) : '');

/** Textos de la interfaz de la maqueta (es/en). */
const UI: Record<'es' | 'en', Record<string, string>> = {
    es: {
        approve: 'Aprobar',
        stop: 'Detener',
        resume: 'Reanudar',
        newSession: 'Nueva sesión',
        play: 'Reproducir',
        pause: 'Pausar',
        restart: 'Reiniciar',
        diagram: 'Diagrama',
        timeline: 'Cronología',
        expand: 'Expandir',
        collapse: 'Colapsar',
        impact: 'Impacto',
        level: 'Nivel',
        list: 'Lista',
        tree: 'Árbol',
        commitDone: 'Commit creado',
        story: 'Historia',
        needsYou: 'te necesita',
        readyReview: 'listo para revisar',
        plan: 'Plan',
        detail: 'Detalle',
        why: 'Por qué',
        affected: 'afectados',
        changedBy: 'cambiados',
        drop: 'Suelta aquí',
        phases: 'fases',
        hint: 'Doble clic en una carpeta para abrirla',
        s0: 'Seis sesiones en paralelo, todas a la vista',
        s1: 'payments-webhook se bloqueó pidiendo un permiso',
        s2: 'Saltas a ella con Alt+2 y decides',
        s3: 'Aprobada: sigue trabajando sola',
        s4: 'fix-flaky-tests terminó con cambios: toca revisar',
        s5: 'auth-refactor pide permiso para ejecutar un comando',
        s6: 'Aprobado, continúa',
        s7: 'perf-queries terminó: pasa a revisión',
        s8: 'docs-api queda en reposo; nada más te necesita',
        t1: 'Revisar cómo se crean las sesiones',
        t2: 'Implementar la rotación',
        t3: 'Conectar session.ts',
        t4: 'Ajustar el guard',
        t5: 'Escribir tests',
    },
    en: {
        approve: 'Approve',
        stop: 'Stop',
        resume: 'Resume',
        newSession: 'New session',
        play: 'Play',
        pause: 'Pause',
        restart: 'Restart',
        diagram: 'Diagram',
        timeline: 'Timeline',
        expand: 'Expand',
        collapse: 'Collapse',
        impact: 'Impact',
        level: 'Depth',
        list: 'List',
        tree: 'Tree',
        commitDone: 'Commit created',
        story: 'Story',
        needsYou: 'needs you',
        readyReview: 'ready to review',
        plan: 'Plan',
        detail: 'Detail',
        why: 'Why',
        affected: 'affected',
        changedBy: 'changed',
        drop: 'Drop here',
        phases: 'phases',
        hint: 'Double-click a folder to open it',
        s0: 'Six sessions in parallel, all in sight',
        s1: 'payments-webhook got blocked asking for permission',
        s2: 'You jump to it with Alt+2 and decide',
        s3: 'Approved: it keeps working on its own',
        s4: 'fix-flaky-tests finished with changes: time to review',
        s5: 'auth-refactor asks permission to run a command',
        s6: 'Approved, it continues',
        s7: 'perf-queries finished: moves to review',
        s8: 'docs-api goes idle; nothing else needs you',
        t1: 'Review how sessions are created',
        t2: 'Implement rotation',
        t3: 'Wire session.ts',
        t4: 'Adjust the guard',
        t5: 'Write tests',
    },
};

export const u = (key: string): string => UI[lang][key] ?? key;

export const plans: Record<string, Array<{ key: string; done: boolean }>> = {
    a: [
        { key: 't1', done: true },
        { key: 't2', done: true },
        { key: 't3', done: false },
        { key: 't4', done: false },
        { key: 't5', done: false },
    ],
};

// ───────────── Proyecto: archivos, dependencias, impacto ─────────────
const names = (list: string[]) => list.map((n) => `${n}.ts`);
const layout: Record<string, string[]> = {
    'src/api/routes': names(['users', 'orders', 'payments', 'auth', 'health']),
    'src/api/handlers': names(['create', 'update', 'remove', 'list']),
    'src/auth': names(['session', 'tokens', 'login', 'rotation', 'guard', 'crypto', 'claims']),
    'src/db': names(['client', 'pool', 'schema', 'queries', 'seed', 'types']),
    'src/payments': names(['webhook', 'invoice', 'refund', 'stripe', 'events', 'ledger']),
    'src/jobs': names(['mailer', 'cleanup', 'reports', 'scheduler']),
    'src/middleware': names(['guard', 'cors', 'rate', 'logger']),
    'src/lib': names(['http', 'log', 'time', 'ids', 'retry', 'cache', 'json']),
    'src/models': names(['user', 'order', 'payment', 'token', 'session']),
    'src/queue': names(['client', 'worker', 'types', 'dlq']),
    'tests/unit': ['tokens.test.ts', 'webhook.test.ts', 'session.test.ts', 'ledger.test.ts', 'retry.test.ts'],
    'tests/e2e': names(['login', 'checkout', 'refunds']),
};
export const projectFiles = Object.entries(layout).flatMap(([dir, list]) => list.map((f) => `${dir}/${f}`));
const under = (module: string) => projectFiles.filter((f) => f.startsWith(`${module}/`));
const moduleEdges: Array<[string, string, number]> = [
    ['src/api', 'src/auth', 6],
    ['src/api', 'src/payments', 4],
    ['src/api', 'src/middleware', 3],
    ['src/api', 'src/lib', 6],
    ['src/auth', 'src/db', 5],
    ['src/auth', 'src/models', 4],
    ['src/payments', 'src/db', 5],
    ['src/payments', 'src/queue', 3],
    ['src/jobs', 'src/queue', 4],
    ['src/jobs', 'src/db', 3],
    ['src/middleware', 'src/auth', 3],
    ['src/db', 'src/models', 6],
    ['src/queue', 'src/lib', 3],
    ['tests/unit', 'src/auth', 4],
    ['tests/unit', 'src/payments', 3],
    ['tests/e2e', 'src/api', 4],
];
const fileEdges: Array<[number, number]> = [];
{
    const seen = new Set<string>();
    const add = (a: string, b: string) => {
        const edge = [projectFiles.indexOf(a), projectFiles.indexOf(b)] as [number, number];
        if (edge[0] >= 0 && edge[1] >= 0 && !seen.has(edge.join())) (seen.add(edge.join()), fileEdges.push(edge));
    };
    for (const [a, b, weight] of moduleEdges) {
        const from = under(a);
        const to = under(b);
        for (let i = 0; i < weight; i++) add(from[(i * 2) % from.length], to[(i * 3 + 1) % to.length]);
    }
    for (const f of ['session', 'login', 'rotation', 'guard']) add(`src/auth/${f}.ts`, 'src/auth/tokens.ts');
    add('src/middleware/guard.ts', 'src/auth/guard.ts');
    add('src/api/routes/auth.ts', 'src/auth/session.ts');
    add('tests/unit/tokens.test.ts', 'src/auth/tokens.ts');
}

export interface GNode {
    id: string;
    label: string;
    files: number;
    kind: 'dir' | 'file';
}

const groupOf = (path: string, open: Set<string>): string => {
    const parts = path.split('/');
    let prefix = '';
    for (let i = 0; i < parts.length; i++) {
        prefix = prefix ? `${prefix}/${parts[i]}` : parts[i];
        if (i === parts.length - 1 || !open.has(prefix)) return prefix;
    }
    return prefix;
};

export const allDirs = [
    ...new Set(
        projectFiles.flatMap((f) =>
            f
                .split('/')
                .slice(0, -1)
                .map((_, i, a) => a.slice(0, i + 1).join('/')),
        ),
    ),
].sort();

export function aggregate(open: Set<string>): { nodes: GNode[]; edges: Array<[string, string, number]> } {
    const nodes = new Map<string, GNode>();
    const groups = projectFiles.map((path) => {
        const id = groupOf(path, open);
        const node = nodes.get(id) ?? { id, label: id.split('/').pop()!, files: 0, kind: id === path ? 'file' : 'dir' };
        node.files++;
        nodes.set(id, node);
        return id;
    });
    const weights = new Map<string, number>();
    for (const [a, b] of fileEdges)
        if (groups[a] !== groups[b])
            weights.set(`${groups[a]}>${groups[b]}`, (weights.get(`${groups[a]}>${groups[b]}`) ?? 0) + 1);
    return {
        nodes: [...nodes.values()],
        edges: [...weights].map(([k, w]) => [...k.split('>'), w] as [string, string, number]),
    };
}

/** Archivos que dependen (directa o indirectamente) de los archivos dados. */
export function impactOf(seeds: string[]): string[] {
    const reverse: number[][] = projectFiles.map(() => []);
    for (const [a, b] of fileEdges) reverse[b].push(a);
    const start = new Set(seeds.map((p) => projectFiles.indexOf(p)).filter((i) => i >= 0));
    const seen = new Set(start);
    const queue = [...start];
    while (queue.length) for (const d of reverse[queue.pop()!]) if (!seen.has(d)) (seen.add(d), queue.push(d));
    return [...seen].filter((i) => !start.has(i)).map((i) => projectFiles[i]);
}

export const changedPaths: Array<{ path: string; status: 'M' | 'A' | 'U' | 'D'; add: number; del: number }> = [
    { path: 'src/auth/tokens.ts', status: 'M', add: 48, del: 12 },
    { path: 'src/auth/session.ts', status: 'M', add: 31, del: 9 },
    { path: 'src/middleware/guard.ts', status: 'M', add: 14, del: 6 },
    { path: 'src/auth/rotation.ts', status: 'A', add: 39, del: 0 },
    { path: 'tests/unit/tokens.test.ts', status: 'U', add: 62, del: 0 },
    { path: 'src/auth/legacy.ts', status: 'D', add: 0, del: 24 },
];

type Row = { type: 'ctx' | 'add' | 'del'; text: string };
export const diffsByFile: Record<string, Row[]> = {
    'src/auth/tokens.ts': diffRows,
    'src/auth/session.ts': [
        { type: 'ctx', text: "import { issueTokens, refreshTokens } from './tokens';" },
        { type: 'ctx', text: '' },
        { type: 'del', text: 'export function createSession(userId: string) {' },
        { type: 'add', text: 'export async function createSession(userId: string) {' },
        { type: 'del', text: '    return { userId, tokens: issueTokens(userId) };' },
        { type: 'add', text: '    const family = crypto.randomUUID();' },
        { type: 'add', text: '    return { userId, family, tokens: await issueTokens(userId, family) };' },
        { type: 'ctx', text: '}' },
    ],
    'src/middleware/guard.ts': [
        { type: 'ctx', text: "import { verify } from '../auth/crypto';" },
        { type: 'del', text: "const header = req.headers['authorization'];" },
        { type: 'add', text: "const header = req.headers['authorization']?.replace('Bearer ', '');" },
        { type: 'add', text: "if (!header) return res.status(401).json({ error: 'missing token' });" },
        { type: 'ctx', text: 'const payload = verify(header);' },
    ],
    'src/auth/rotation.ts': [
        { type: 'add', text: "import { db } from '../db';" },
        { type: 'add', text: '' },
        { type: 'add', text: 'export async function rotate(family: string, token: string) {' },
        { type: 'add', text: '    const current = await db.tokens.findOne({ family });' },
        { type: 'add', text: '    if (!current || current.hash !== token) return false;' },
        { type: 'add', text: '    return true;' },
        { type: 'add', text: '}' },
    ],
    'tests/unit/tokens.test.ts': [
        { type: 'add', text: "it('revoca la familia si se reutiliza un refresh', async () => {" },
        { type: 'add', text: '    const first = await issueTokens(user.id);' },
        { type: 'add', text: '    await refreshTokens(first.refresh);' },
        { type: 'add', text: '    await expect(refreshTokens(first.refresh)).rejects.toThrow();' },
        { type: 'add', text: '});' },
    ],
    'src/auth/legacy.ts': [
        { type: 'del', text: 'export const LEGACY_TTL = 60 * 60 * 24;' },
        { type: 'del', text: 'export function legacyToken(userId: string) {' },
        { type: 'del', text: '    return `${userId}.${Date.now()}`;' },
        { type: 'del', text: '}' },
    ],
};

const PROMPTS: Record<string, string> = {
    a: 'Refactoriza la autenticación a tokens rotativos',
    b: 'Hace idempotente el webhook de pagos',
    c: 'Estabiliza los tests intermitentes',
    d: 'Actualiza la documentación del endpoint',
    e: 'Optimiza las consultas de orders',
    f: 'Reduce el tiempo de CI',
};

/** Guion del thinking graph de cada sesión: mismos pasos, rotados y con su propio prompt. */
export function scriptFor(id: string): typeof graphScript {
    const middle = graphScript.slice(1, -1);
    const offset = id.charCodeAt(0) % middle.length;
    const rotated = id === 'a' ? middle : [...middle.slice(offset), ...middle.slice(0, offset)];
    return [{ ...graphScript[0], label: PROMPTS[id] ?? graphScript[0].label }, ...rotated, graphScript.at(-1)!];
}

/** Archivo en el que trabaja cada sesión (para los anillos del grafo del proyecto). */
export const sessionFile: Record<string, string> = {
    a: 'src/auth/session.ts',
    b: 'src/payments/webhook.ts',
    c: 'tests/unit/ledger.test.ts',
    d: 'src/api/routes/auth.ts',
    e: 'src/db/queries.ts',
    f: 'src/jobs/scheduler.ts',
};
