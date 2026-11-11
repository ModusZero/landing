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
