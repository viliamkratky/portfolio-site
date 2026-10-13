import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { NavRoute } from '../config/site';
import { stack } from '../config/site';
import { socialIcons } from '../lib/social-icons';
import type { BuildInfo } from '../lib/build-info';
import { keysEnabled, on, setKeysEnabled, status, toggleGrid, type MenuMode } from './bus';

type Project = { slug: string; title: string; type: string; hasPage: boolean; year: string; period: string };
type Links = { email: string; github: string; linkedin: string; resume: string };

type Props = {
  routes: NavRoute[];
  projects: Project[];
  links: Links;
  build: BuildInfo;
  name: string;
};

type Result = { title: string; body: ReactNode };

type Cli = {
  name: string;
  aliases?: string[];
  args?: string;
  hint: string;
  run: (arg: string) => Result | void;
};

const projectHref = (p: Project) => (p.hasPage ? `/work/${p.slug}` : `/work#${p.slug}`);

function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="t-mono grid grid-cols-[minmax(84px,auto)_1fr] gap-x-6 gap-y-2 text-[13px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-fg-3">{k}</dt>
          <dd className="text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CommandMenu({ routes, projects, links, build, name }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<MenuMode>('search');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [keysOn, setKeysOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const show = useCallback((m: MenuMode, q = '') => {
    setMode(m);
    setQuery(q);
    setResult(null);
    setKeysOn(keysEnabled());
    setOpen(true);
  }, []);

  useEffect(() => {
    window.__menuReady = true;
    const queued = window.__menuQueue?.pop();
    window.__menuQueue = [];
    if (queued) show(queued.mode, queued.query);
    return on('menu:open', (d) => show(d.mode, d.query));
  }, [show]);

  const close = () => setOpen(false);

  const navigate = (href: string, label: string) => {
    close();
    status(`Opening ${label}`);
    if (href.startsWith('http')) window.open(href, '_blank', 'noopener');
    else window.location.href = href;
  };

  const copyEmail = async () => {
    close();
    try {
      await navigator.clipboard.writeText(links.email);
      status(`Copied ${links.email}`);
    } catch {
      status('Copy failed');
    }
  };

  const grid = () => {
    close();
    status(toggleGrid() ? 'Grid overlay on. Type :grid to hide' : 'Grid overlay off');
  };

  const toggleKeys = () => {
    const next = !keysEnabled();
    setKeysEnabled(next);
    setKeysOn(next);
    status(next ? 'Single-key shortcuts on' : 'Single-key shortcuts off');
  };

  const cli: Cli[] = useMemo(
    () => [
      {
        name: 'whoami',
        hint: 'Who built this',
        run: () => ({
          title: 'whoami',
          body: (
            <div className="space-y-4">
              <p className="text-[15px] leading-relaxed text-fg">
                {name}, a design-minded full-stack engineer. I take products from an unclear problem to a polished,
                working system: interface, frontend, backend, AI and the infrastructure that ships it.
              </p>
              <Rows
                rows={[
                  ['focus', 'web products · interfaces · content platforms · AI'],
                  ['mode', 'design + engineering, end to end'],
                  ...(links.email ? ([['email', links.email]] as [string, ReactNode][]) : []),
                ]}
              />
            </div>
          ),
        }),
      },
      {
        name: 'stack',
        hint: 'Tools in daily use',
        run: () => ({
          title: 'stack',
          body: <Rows rows={stack.map((g) => [g.group.toLowerCase(), g.items.join(' · ')])} />,
        }),
      },
      {
        name: 'system',
        aliases: ['uname'],
        hint: 'How this build was made',
        run: () => ({
          title: 'system',
          body: (
            <Rows
              rows={[
                ['build', build.stamp],
                ['commit', `${build.sha}${build.dirty ? ' (uncommitted changes)' : ''}`],
                ['built', `${build.date} ${build.time}`],
                ['framework', `astro ${build.astro}, react ${build.react} (2 islands)`],
                ['styles', 'tailwind v4 + design tokens'],
                ['host', build.host],
                ['js', 'keyboard module eager; islands hydrate when visible or idle'],
              ]}
            />
          ),
        }),
      },
      {
        name: 'history',
        aliases: ['log'],
        hint: 'Project timeline',
        run: () => ({
          title: 'history',
          body: <Rows rows={projects.map((p) => [p.year, `${p.title} · ${p.type}`])} />,
        }),
      },
      { name: 'grid', hint: 'Toggle the construction grid', run: () => grid() },
      { name: 'keys', args: 'on|off', hint: 'Single-key shortcuts', run: (a) => {
          const want = a === 'on' ? true : a === 'off' ? false : !keysEnabled();
          setKeysEnabled(want);
          close();
          status(want ? 'Single-key shortcuts on' : 'Single-key shortcuts off');
        } },
      { name: 'help', hint: 'Keyboard shortcuts', run: () => { setMode('help'); setQuery(''); } },
      {
        name: 'open',
        args: '<project>',
        hint: 'Open a case study',
        run: (a) => {
          const p = projects.find((x) => x.slug.startsWith(a) || x.title.toLowerCase().startsWith(a));
          if (p) navigate(projectHref(p), p.title);
          else return { title: `open ${a}`, body: <p className="t-mono text-fg-2">no project matches “{a}”. try :ls</p> };
        },
      },
      ...routes.map<Cli>((r) => ({
        name: r.id,
        aliases: r.id === 'work' ? ['projects', 'ls'] : undefined,
        hint: `Go to ${r.label}`,
        run: () => navigate(r.href, r.label),
      })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, routes, links, build],
  );

  const isCli = query.startsWith(':');
  const cliInput = query.slice(1).trim().toLowerCase();
  const [cliVerb, ...cliRest] = cliInput.split(/\s+/);
  const cliArg = cliRest.join(' ');

  const cliMatches = useMemo(() => {
    if (!isCli) return [];
    if (cliVerb === 'open') {
      return projects
        .filter((p) => !cliArg || p.slug.startsWith(cliArg) || p.title.toLowerCase().includes(cliArg))
        .map((p) => ({ key: `open ${p.slug}`, label: `:open ${p.slug}`, hint: p.title, run: () => navigate(projectHref(p), p.title) }));
    }
    return cli
      .filter((c) => !cliVerb || [c.name, ...(c.aliases ?? [])].some((n) => n.startsWith(cliVerb)))
      .map((c) => ({
        key: c.name,
        label: `:${c.name}${c.args ? ` ${c.args}` : ''}`,
        hint: c.hint,
        run: () => {
          const r = c.run(cliArg);
          if (r) setResult(r);
        },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCli, cliVerb, cliArg, cli, projects]);

  const nearest = useMemo(() => {
    if (!isCli || cliMatches.length || !cliVerb) return [];
    return cli
      .map((c) => ({ c, d: [...c.name].filter((ch, i) => cliVerb[i] === ch).length }))
      .sort((a, b) => b.d - a.d)
      .slice(0, 3)
      .map((x) => x.c.name);
  }, [isCli, cliMatches, cliVerb, cli]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, mode, result]);

  const item = 'flex-1 truncate';
  const right = 't-mono ml-auto shrink-0 text-[11.5px] text-fg-3';

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      shouldFilter={!isCli}
      loop
      overlayClassName=""
      contentClassName=""
    >
      <Dialog.Title className="sr-only">Command menu</Dialog.Title>
      <Dialog.Description className="sr-only">
        Search pages and projects, or type a colon to run a command.
      </Dialog.Description>
      <div className="relative overflow-hidden rounded-2xl border border-line-2 bg-elevated shadow-[0_40px_120px_-30px_rgb(0_0_0/0.35)]">

        {mode === 'help' ? (
          <Help routes={routes} keysOn={keysOn} onToggle={toggleKeys} onBack={() => setMode('search')} />
        ) : (
          <>
            <div className="relative flex h-14 items-center gap-3 border-b border-line px-4">
              <span className={`t-mono w-3 text-[14px] ${isCli ? 'text-accent-ink' : 'text-fg-3'}`} aria-hidden="true">
                {isCli ? ':' : '›'}
              </span>
              <Command.Input
                ref={inputRef}
                value={isCli ? query.slice(1) : query}
                onValueChange={(v) => {
                  setResult(null);
                  setQuery(isCli ? `:${v}` : v);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && isCli && query === ':') {
                    e.preventDefault();
                    setQuery('');
                  }
                  if (e.key === ':' && query === '') {
                    e.preventDefault();
                    setQuery(':');
                  }
                }}
                placeholder={isCli ? 'command, e.g. whoami, stack, system' : 'Search pages and projects, or type : for commands'}
                className={`h-full flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3 ${isCli ? 'font-mono' : ''}`}
              />
              <kbd className="kbd">esc</kbd>
            </div>

            {result ? (
              <div className="relative p-5">
                <p className="t-meta mb-4 flex items-center gap-2 text-fg-3">
                  <span className="text-accent-ink">:</span>
                  {result.title}
                </p>
                {result.body}
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setQuery(':');
                  }}
                  className="t-meta mt-6 text-fg-3 hover:text-fg"
                >
                  ← back to commands
                </button>
              </div>
            ) : (
              <Command.List className="relative px-2 pb-2">
                <Command.Empty>
                  {isCli ? (
                    <span>
                      command not found: <span className="text-fg">{cliVerb}</span>
                      {nearest.length > 0 && <> · did you mean {nearest.map((n) => `:${n}`).join(', ')}?</>}
                    </span>
                  ) : (
                    'No results. Type : to see commands.'
                  )}
                </Command.Empty>

                {isCli ? (
                  <Command.Group heading="Commands">
                    {cliMatches.map((m) => (
                      <Command.Item key={m.key} value={m.key} onSelect={m.run}>
                        <span className={`${item} font-mono text-[13.5px]`}>{m.label}</span>
                        <span className={right}>{m.hint}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : (
                  <>
                    <Command.Group heading="Navigation">
                      {routes.map((r) => (
                        <Command.Item key={r.id} value={`Go to ${r.label}`} onSelect={() => navigate(r.href, r.label)}>
                          <Glyph d="M3 8h10M9 4l4 4-4 4" />
                          <span className={item}>Go to {r.label}</span>
                          <span className={right}>g {r.key}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                    <Command.Group heading="Work">
                      {projects.map((p) => (
                        <Command.Item
                          key={p.slug}
                          value={`${p.title} ${p.type}`}
                          keywords={[p.slug, 'project', 'case study']}
                          onSelect={() => navigate(projectHref(p), p.title)}
                        >
                          <Glyph d="M3 4.5h10v8H3zM3 7h10" />
                          <span className={item}>{p.title}</span>
                          <span className={right}>{p.hasPage ? p.type : 'case study soon'}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                    {(links.email || links.github || links.linkedin || links.resume) && (
                    <Command.Group heading="Contact & links">
                      {links.email && (
                        <Command.Item value="Copy email address" keywords={['mail', 'contact']} onSelect={copyEmail}>
                          <Glyph d="M2.5 4.5h11v7h-11zM2.5 4.5L8 9l5.5-4.5" />
                          <span className={item}>Copy email address</span>
                          <span className={right}>{links.email}</span>
                        </Command.Item>
                      )}
                      {links.github && (
                        <Command.Item value="Open GitHub" onSelect={() => navigate(links.github, 'GitHub')}>
                          <Brand d={socialIcons.github} />
                          <span className={item}>Open GitHub</span>
                          <span className={right}>↗</span>
                        </Command.Item>
                      )}
                      {links.linkedin && (
                        <Command.Item value="Open LinkedIn" onSelect={() => navigate(links.linkedin, 'LinkedIn')}>
                          <Brand d={socialIcons.linkedin} />
                          <span className={item}>Open LinkedIn</span>
                          <span className={right}>↗</span>
                        </Command.Item>
                      )}
                      {links.resume && (
                        <Command.Item value="Open resume" keywords={['cv']} onSelect={() => navigate(links.resume, 'Resume')}>
                          <Glyph d="M4 2.5h6l2.5 2.5v8.5H4zM6 8h4M6 10.5h4" />
                          <span className={item}>Open resume</span>
                          <span className={right}>PDF</span>
                        </Command.Item>
                      )}
                    </Command.Group>
                    )}
                    <Command.Group heading="Interface">
                      <Command.Item value="Keyboard shortcuts" keywords={['help', 'keys']} onSelect={() => setMode('help')}>
                        <Glyph d="M2.5 4.5h11v7h-11zM5 7h1M7.5 7h1M10 7h1M5.5 9.5h5" />
                        <span className={item}>Keyboard shortcuts</span>
                        <span className={right}>?</span>
                      </Command.Item>
                      <Command.Item value="Toggle grid overlay" keywords={['layout', 'columns']} onSelect={grid}>
                        <Glyph d="M3 3v10M6.33 3v10M9.66 3v10M13 3v10" />
                        <span className={item}>Toggle grid overlay</span>
                        <span className={right}>:grid</span>
                      </Command.Item>
                      <Command.Item value="Run a command" keywords={['cli', 'terminal', 'whoami', 'stack', 'system']} onSelect={() => setQuery(':')}>
                        <Glyph d="M4 5l3 3-3 3M8.5 11.5H12" />
                        <span className={item}>Run a command…</span>
                        <span className={right}>:</span>
                      </Command.Item>
                    </Command.Group>
                  </>
                )}
              </Command.List>
            )}

            <div className="t-mono relative flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-fg-3">
              <span className="flex items-center gap-3">
                <span><kbd className="kbd">↑↓</kbd> move</span>
                <span><kbd className="kbd">↵</kbd> select</span>
                <span className="hidden sm:inline"><kbd className="kbd">:</kbd> commands</span>
              </span>
              <button type="button" className="hover:text-fg" onClick={() => setMode('help')}>
                <kbd className="kbd">?</kbd> shortcuts
              </button>
            </div>
          </>
        )}
      </div>
    </Command.Dialog>
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-fg-3">
      <path d={d} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Brand({ d }: { d: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mx-px shrink-0 text-fg-3">
      <path d={d} />
    </svg>
  );
}

function Help({
  routes,
  keysOn,
  onToggle,
  onBack,
}: {
  routes: NavRoute[];
  keysOn: boolean;
  onToggle: () => void;
  onBack: () => void;
}) {
  const groups: { title: string; rows: [string[], string][] }[] = [
    {
      title: 'Navigation',
      rows: [
        [['j'], 'Next section'],
        [['k'], 'Previous section'],
        ...routes.map<[string[], string]>((r) => [['g', r.key], r.label]),
      ],
    },
    {
      title: 'Interface',
      rows: [
        [['⌘', 'K'], 'Command menu'],
        [['/'], 'Search'],
        [[':'], 'Command mode'],
        [['?'], 'This overlay'],
        [['1', '–', '5'], 'Hero layers (home)'],
        [['esc'], 'Close'],
      ],
    },
  ];

  return (
    <div className="relative">
      <div className="flex h-14 items-center justify-between border-b border-line px-5">
        <p className="t-meta text-fg-2">Keyboard</p>
        <button type="button" onClick={onBack} className="t-meta text-fg-3 hover:text-fg">
          ← back
        </button>
      </div>
      <div className="grid gap-8 p-5 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="t-meta mb-3 text-fg-3">{g.title}</p>
            <ul className="space-y-2">
              {g.rows.map(([keys, label]) => (
                <li key={label} className="flex items-center justify-between gap-4 text-[14px] text-fg-2">
                  <span>{label}</span>
                  <span className="flex gap-1">
                    {keys.map((k, i) =>
                      k === '–' ? (
                        <span key={i} className="text-fg-4">–</span>
                      ) : (
                        <kbd key={i} className="kbd">{k}</kbd>
                      ),
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
        <div>
          <p className="text-[14px] text-fg">Single-key shortcuts</p>
          <p className="text-[13px] text-fg-3">Turn off if they conflict with speech input or your browser.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={keysOn}
          onClick={onToggle}
          className="relative h-6 w-11 shrink-0 rounded-full bg-surface transition-colors aria-checked:bg-fg"
        >
          <span className="sr-only">Single-key shortcuts</span>
          <span
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-(--dur-2) ${keysOn ? 'left-[22px] bg-bg' : 'left-[3px] bg-fg-3'}`}
          />
        </button>
      </div>
    </div>
  );
}
