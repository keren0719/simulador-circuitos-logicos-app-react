import React, { useState, useCallback, useMemo } from 'react';
import { GateType } from '@/logic/gates';
import { evaluateSR, SRState } from '@/logic/gates';
import { evaluateCircuit, LevelConfig } from '@/logic/circuitEngine';
import ControlPanel from '@/components/ControlPanel';
import CircuitCanvas from '@/components/CircuitCanvas';
import FlipFlopSR from '@/components/FlipFlopSR';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faMicrochip } from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const [numLevels, setNumLevels] = useState(2);
  const [levelGateTypes, setLevelGateTypes] = useState<GateType[]>(['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR']);
  const [inputs, setInputs] = useState<boolean[]>(() => new Array(64).fill(false));

  const [flipFlopEnabled, setFlipFlopEnabled] = useState(false);
  const [flipFlopPosition, setFlipFlopPosition] = useState<'input' | 'output'>('output');
  const [srS, setSrS] = useState(false);
  const [srR, setSrR] = useState(false);
  const [srPrevQ, setSrPrevQ] = useState(false);

  const srState = useMemo<SRState>(() => evaluateSR(srS, srR, srPrevQ), [srS, srR, srPrevQ]);

  const handleSChange = useCallback((val: boolean) => {
    setSrS(val);
    const newState = evaluateSR(val, srR, srPrevQ);
    if (!newState.invalid) setSrPrevQ(newState.q);
  }, [srR, srPrevQ]);

  const handleRChange = useCallback((val: boolean) => {
    setSrR(val);
    const newState = evaluateSR(srS, val, srPrevQ);
    if (!newState.invalid) setSrPrevQ(newState.q);
  }, [srS, srPrevQ]);

  const numInputs = Math.pow(2, numLevels);

  const handleNumLevelsChange = useCallback((n: number) => setNumLevels(n), []);

  const handleGateTypeChange = useCallback((levelIndex: number, type: GateType) => {
    setLevelGateTypes(prev => {
      const next = [...prev];
      next[levelIndex] = type;
      return next;
    });
  }, []);

  const toggleInput = useCallback((index: number) => {
    setInputs(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const levelConfigs: LevelConfig[] = useMemo(() =>
    Array.from({ length: numLevels }, (_, i) => ({
      gateType: levelGateTypes[i] || 'AND',
    })),
    [numLevels, levelGateTypes]
  );

  const effectiveInputs = useMemo(() => {
    const ins = inputs.slice(0, numInputs);
    if (flipFlopEnabled && flipFlopPosition === 'input') {
      ins[0] = srState.invalid ? ins[0] : srState.q;
    }
    return ins;
  }, [inputs, numInputs, flipFlopEnabled, flipFlopPosition, srState]);

  const circuitResult = useMemo(() =>
    evaluateCircuit(numLevels, levelConfigs, effectiveInputs),
    [numLevels, levelConfigs, effectiveInputs]
  );

  const finalOutput = flipFlopEnabled && flipFlopPosition === 'output'
    ? (srState.invalid ? circuitResult.finalOutput : srState.q)
    : circuitResult.finalOutput;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-sans font-extrabold text-2xl text-foreground tracking-tight text-blue-500">
              {/* <span className="text-primary">◈</span>*/}
              <FontAwesomeIcon icon={faMicrochip} /> Simulador de Circuitos Lógicos 
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Taller #1 — Compuertas Lógicas
            </p>
          </div>
          <div className="text-right text-[12px] text-muted-foreground leading-relaxed">
            <div className="font-bold text-foreground">Estudiantes: Keren S. Subiroz, Keren H. Subiroz, Andres Buelvas, Pedro Iriarte y Jhon Bossa</div>
            <div className="font-medium">Profesor: Daniel Arias Lopez</div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-4">
            <ControlPanel
              numLevels={numLevels}
              onNumLevelsChange={handleNumLevelsChange}
              levelGateTypes={levelGateTypes}
              onLevelGateTypeChange={handleGateTypeChange}
              flipFlopEnabled={flipFlopEnabled}
              onFlipFlopToggle={setFlipFlopEnabled}
              flipFlopPosition={flipFlopPosition}
              onFlipFlopPositionChange={setFlipFlopPosition}
            />

            {flipFlopEnabled && (
              <FlipFlopSR
                s={srS}
                r={srR}
                state={srState}
                onSChange={handleSChange}
                onRChange={handleRChange}
                label={flipFlopPosition === 'input' ? 'alimenta Entrada 0' : 'recibe Salida Final'}
              />
            )}

            <div className={`border rounded-xl p-6 text-center transition-all card-elegant ${
              finalOutput
                ? 'border-circuit-green/40 bg-circuit-green/5 glow-green'
                : 'border-circuit-red/40 bg-circuit-red/5 glow-red'
            }`}>
              <div className="text-xs text-muted-foreground mb-2 font-sans font-bold uppercase tracking-[0.2em]">
                Salida Final
              </div>
              <div className={`text-6xl font-extrabold font-sans ${
                finalOutput ? 'text-circuit-green' : 'text-circuit-red'
              }`}>
                {finalOutput ? '1' : '0'}
              </div>
              <div className={`text-sm mt-2 font-semibold ${
                finalOutput ? 'text-circuit-green/70' : 'text-circuit-red/70'
              }`}>
                {finalOutput ? 'VERDADERO' : 'FALSO'}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden card-elegant">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-sans font-bold tracking-wide">Vista del Circuito</span>
              <span className="text-[12px] text-muted-foreground font-medium">
                {numLevels} nivel{numLevels > 1 ? 'es' : ''} · {numInputs} entradas · {numInputs - 1} compuertas
              </span>
            </div>
            <CircuitCanvas
              numLevels={numLevels}
              circuitResult={circuitResult}
              onToggleInput={toggleInput}
              flipFlopEnabled={flipFlopEnabled}
              flipFlopPosition={flipFlopPosition}
              srState={srState}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
