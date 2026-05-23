import type { ReasoningEntry } from './types';

interface TeachingPanelProps {
  entries: ReadonlyArray<ReasoningEntry>;
  thinking: boolean;
}

export function TeachingPanel({ entries, thinking }: TeachingPanelProps) {
  // Most recent first; only entries with reasoning (AI moves).
  const annotated = entries
    .map((e, i) => ({ ...e, idx: i + 1 }))
    .filter((e) => e.reasoning !== '')
    .reverse();

  return (
    <aside className="w-full md:w-80 md:max-h-[600px] md:overflow-y-auto bg-atsf-surface rounded-lg border border-atsf-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-atsf-ink-muted">Teaching</h2>
        {thinking && (
          <span className="text-xs text-atsf-gold animate-pulse">thinking…</span>
        )}
      </div>
      {annotated.length === 0 && !thinking && (
        <p className="text-sm text-atsf-ink-muted italic">
          AI moves will be explained here.
        </p>
      )}
      <ol className="space-y-3">
        {annotated.map((e) => {
          const chosen = e.candidates[0];
          const alternatives = e.candidates.slice(1);
          return (
            <li key={e.idx} className="text-sm">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-atsf-ink-muted">#{e.idx}</span>
                <span className="font-bold text-atsf-ink">{e.move.player}</span>
                <span className="text-xs text-atsf-ink-muted">
                  board {e.move.boardIdx}, cell {e.move.cellIdx}
                </span>
              </div>
              <p className="mt-0.5 text-atsf-ink">{e.reasoning}</p>
              {chosen && alternatives.length > 0 && (
                <details className="mt-1.5">
                  <summary className="text-xs text-atsf-ink-muted cursor-pointer hover:text-atsf-ink">
                    Alternatives ({alternatives.length})
                  </summary>
                  <ul className="mt-1 ml-3 space-y-0.5">
                    {alternatives.map((alt, i) => {
                      const delta = -Math.abs(chosen.score - alt.score);
                      return (
                        <li key={i} className="text-xs text-atsf-ink-muted font-mono">
                          board {alt.move.boardIdx}, cell {alt.move.cellIdx}
                          <span className="ml-2">
                            ({delta === 0 ? 'tied' : `${delta} vs chosen`})
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
