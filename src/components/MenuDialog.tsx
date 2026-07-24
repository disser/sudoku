export function MenuDialog({ showErrors, onToggleErrors, onNew, onReset, onStats, onClose }: { showErrors:boolean; onToggleErrors:()=>void; onNew:()=>void; onReset:()=>void; onStats:()=>void; onClose:()=>void }) {
  return <div className="overlay"><div className="dialog"><h2>Menu</h2><button onClick={onToggleErrors}>{showErrors ? 'Hide errors' : 'Show errors'}</button><button onClick={onReset}>Reset puzzle</button><button onClick={onNew}>New game</button><button onClick={onStats}>Stats</button><button onClick={onClose}>Close</button></div></div>;
}
