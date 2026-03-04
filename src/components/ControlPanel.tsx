import React from 'react';
import { GateType, ALL_GATE_TYPES } from '@/logic/gates';

interface ControlPanelProps {
  numLevels: number;
  onNumLevelsChange: (n: number) => void;
  levelGateTypes: GateType[];
  onLevelGateTypeChange: (levelIndex: number, type: GateType) => void;
  flipFlopEnabled: boolean;
  onFlipFlopToggle: (enabled: boolean) => void;
  flipFlopPosition: 'input' | 'output';
  onFlipFlopPositionChange: (pos: 'input' | 'output') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  numLevels,
  onNumLevelsChange,
  levelGateTypes,
  onLevelGateTypeChange,
  flipFlopEnabled,
  onFlipFlopToggle,
  flipFlopPosition,
  onFlipFlopPositionChange,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5 card-elegant">
      <h2 className="font-sans font-extrabold text-lg text-foreground tracking-tight">
        ⚙ Configuración del Circuito
      </h2>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">Número de Niveles</label>
        <div className="flex items-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => onNumLevelsChange(n)}
              className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                numLevels === n
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted hover:scale-105'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Entradas: {Math.pow(2, numLevels)} | Compuertas: {Math.pow(2, numLevels) - 1}
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-muted-foreground">Tipo de Compuerta por Nivel</label>
        {Array.from({ length: numLevels }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-16 shrink-0 font-medium">
              Nivel {i + 1}
              <span className="block text-[10px] opacity-60">
                ({Math.pow(2, i)} comp.)
              </span>
            </span>
            <select
              value={levelGateTypes[i] || 'AND'}
              onChange={(e) => onLevelGateTypeChange(i, e.target.value as GateType)}
              className="flex-1 bg-secondary text-secondary-foreground border border-border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-ring outline-none transition-all"
            >
              {ALL_GATE_TYPES.map((gt) => (
                <option key={gt} value={gt}>{gt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-muted-foreground">Flip-Flop SR</label>
          <button
            onClick={() => onFlipFlopToggle(!flipFlopEnabled)}
            className={`w-12 h-6 rounded-full transition-all relative ${
              flipFlopEnabled ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-md transition-all ${
                flipFlopEnabled ? 'left-6' : 'left-0.5'
              }`}
            />
          </button>
        </div>
        {flipFlopEnabled && (
          <div className="flex gap-2">
            {(['output', 'input'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => onFlipFlopPositionChange(pos)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  flipFlopPosition === pos
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                En {pos === 'input' ? 'entrada' : 'salida'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
