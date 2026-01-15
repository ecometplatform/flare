# Flare

> **Framework Spec:** [README.md](../README.md)

Public frontend framework npm package. Think like framework maintainer - API design, DX, performance matter. Used by many.

## Philosophy

- Concise, sacrifice grammar
- Root cause > quick fix, Ask > half-baked
- Implement what is robust and correct, no quick fixes
- By default: NO backwards compat, NO "@deprecated", RUTHLESS refactors

## Planning

- Present fully defined plan before making changes
- Present plan FIRST, questions come AFTER investigation
- Write plans to `./.plans/[plan].md` in repository (gitignored), NOT terminal or system plans
- After implementation: explain changes, ask confirmation, update plan
- Search web for information when needed

## Development

- After framework code changes: rebuild package AND restart dev server for e2e

## Code

**Banned**
- `//` comments, `@ts-ignore`, `@ts-expect-error`, `as any`, `as unknown as X`
- Nested ternaries, param reassignment, `==` (use `===`)
- Reexports except adjacent `index.ts`

**Assertions**
- `!` and `as X` allowed ONLY if type-safe with comment explaining why

**Required**
- `/** */` JSDoc, `/* */` block - only when necessary
- Dot notation > destructuring (`ctx.env.X` not `const { X } = ctx.env`)
- Runtime checks > type assertions
- `async` ONLY if function awaits
- Array access → `T | undefined`, handle it
- `JSON.parse()` / `.json()` → `unknown`, narrow with zod
- `catch(e)` → `unknown`, narrow before use
- Self-closing JSX: `<Foo />` not `<Foo></Foo>`

**Format**
- No semicolons, double quotes, 100 char lines
- Biome for lint/format (NOT eslint)
- Type check repo-wide via `bun run type:check`

**Generated**
- Never edit `*.gen.*` - run generation scripts

## Repository

Bun + Turbo monorepo. Dependencies in root catalog only.

```
src/
├── apps/
│   └── flare-cloudflare-worker/   @flare/cloudflare-worker
└── packages/
    ├── flare/                     @flare/core
    └── cloudflare/                @flare/cloudflare
```

### Scripts

| Script | Purpose |
|--------|---------|
| `pkg:flare:build` | Build core package |
| `pkg:flare:test` | Test core package |
| `pkg:cloudflare:build` | Build CF adapter |
| `pkg:cloudflare:test` | Test CF adapter |
| `app:cloudflare-worker:dev` | Run test app |
| `test:unit` | Unit tests |
| `test:integration` | Integration tests |
| `test:e2e` | E2E tests |
