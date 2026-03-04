import React from 'react';
import { SRState } from '@/logic/gates';

interface FlipFlopSRProps {
  s: boolean;
  r: boolean;
  state: SRState;
  onSChange: (val: boolean) => void;
  onRChange: (val: boolean) => void;
  label?: string;
}

const FlipFlopSR: React.FC<FlipFlopSRProps> = ({ s, r, state, onSChange, onRChange, label }) => {
  return (
    <div className={`border rounded-lg p-4 space-y-3 shadow-sm ${
      state.invalid ? 'border-accent glow-yellow bg-card' : 'border-border bg-card'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className="font-sans font-semibold text-sm text-foreground">
          Flip-Flop SR {label && <span className="text-muted-foreground font-normal">({label})</span>}
        </h3>
        {state.invalid && (
          <span className="text-[10px] font-bold bg-accent text-accent-foreground px-2 py-0.5 rounded animate-pulse">
            INVÁLIDO
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onSChange(!s)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-all ${
            s ? 'bg-circuit-green/20 text-circuit-green' : 'bg-secondary text-muted-foreground'
          }`}
        >
          <span className="text-xs font-bold">S</span>
          <span className="text-lg font-bold">{s ? '1' : '0'}</span>
        </button>

        <button
          onClick={() => onRChange(!r)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-all ${
            r ? 'bg-circuit-green/20 text-circuit-green' : 'bg-secondary text-muted-foreground'
          }`}
        >
          <span className="text-xs font-bold">R</span>
          <span className="text-lg font-bold">{r ? '1' : '0'}</span>
        </button>

        <span className="text-muted-foreground">→</span>

        <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded font-bold ${
          state.invalid
            ? 'bg-accent/20 text-accent'
            : state.q
              ? 'bg-circuit-green/20 text-circuit-green'
              : 'bg-circuit-red/20 text-circuit-red'
        }`}>
          <span className="text-xs">Q</span>
          <span className="text-lg">{state.invalid ? '?' : state.q ? '1' : '0'}</span>
        </div>
      </div>
    </div>
  );
};

export default FlipFlopSR;
