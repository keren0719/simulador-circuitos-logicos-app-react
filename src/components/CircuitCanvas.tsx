import React from 'react';
import { CircuitResult } from '@/logic/circuitEngine';
import { SRState, GateType } from '@/logic/gates';

interface CircuitCanvasProps {
  numLevels: number;
  circuitResult: CircuitResult;
  onToggleInput: (index: number) => void;
  flipFlopEnabled: boolean;
  flipFlopPosition: 'input' | 'output';
  srState: SRState;
}

const GATE_W = 68;
const GATE_H = 46;
const INPUT_R = 16;
const LEVEL_GAP_X = 140;
const MIN_GAP_Y = 54;

const GateSymbol: React.FC<{
  x: number;
  y: number;
  gateType: GateType;
  output: boolean;
  id: string;
}> = ({ x, y, gateType, output, id }) => {
  const w = GATE_W;
  const h = GATE_H;
  const left = x - w / 2;
  const top = y - h / 2;
  const onColor = 'hsl(152, 55%, 42%)';
  const offColor = 'hsl(0, 68%, 52%)';
  const outColor = output ? onColor : offColor;
  const fillOn = 'hsl(152, 55%, 42%, 0.06)';
  const fillOff = 'hsl(0, 68%, 52%, 0.06)';
  const fillColor = output ? fillOn : fillOff;
  const shadowId = `shadow-${id}`;
  const gradId = `grad-${id}`;

  const renderBody = () => {
    switch (gateType) {
      case 'AND':
        return (
          <path
            d={`M${left},${top + 4} Q${left},${top} ${left + 4},${top} L${left + w * 0.5},${top} A${w * 0.5},${h / 2} 0 0,1 ${left + w * 0.5},${top + h} L${left + 4},${top + h} Q${left},${top + h} ${left},${top + h - 4} Z`}
            fill={`url(#${gradId})`} stroke={outColor} strokeWidth={2} filter={`url(#${shadowId})`}
          />
        );
      case 'OR':
        return (
          <path
            d={`M${left + 4},${top} Q${left + w * 0.35},${y} ${left + 4},${top + h} Q${left + w * 0.55},${top + h} ${left + w},${y} Q${left + w * 0.55},${top} ${left + 4},${top}`}
            fill={`url(#${gradId})`} stroke={outColor} strokeWidth={2} filter={`url(#${shadowId})`}
          />
        );
      case 'NAND':
        return (
          <g>
            <path
              d={`M${left},${top + 4} Q${left},${top} ${left + 4},${top} L${left + w * 0.42},${top} A${w * 0.42},${h / 2} 0 0,1 ${left + w * 0.42},${top + h} L${left + 4},${top + h} Q${left},${top + h} ${left},${top + h - 4} Z`}
              fill={`url(#${gradId})`} stroke={outColor} strokeWidth={2} filter={`url(#${shadowId})`}
            />
            <circle cx={left + w * 0.88} cy={y} r={5} fill="white" stroke={outColor} strokeWidth={2} />
          </g>
        );
      case 'NOR':
        return (
          <g>
            <path
              d={`M${left + 4},${top} Q${left + w * 0.35},${y} ${left + 4},${top + h} Q${left + w * 0.5},${top + h} ${left + w * 0.82},${y} Q${left + w * 0.5},${top} ${left + 4},${top}`}
              fill={`url(#${gradId})`} stroke={outColor} strokeWidth={2} filter={`url(#${shadowId})`}
            />
            <circle cx={left + w * 0.9} cy={y} r={5} fill="white" stroke={outColor} strokeWidth={2} />
          </g>
        );
      case 'XOR':
        return (
          <g>
            <path
              d={`M${left + 9},${top} Q${left + w * 0.38},${y} ${left + 9},${top + h} Q${left + w * 0.55},${top + h} ${left + w},${y} Q${left + w * 0.55},${top} ${left + 9},${top}`}
              fill={`url(#${gradId})`} stroke={outColor} strokeWidth={2} filter={`url(#${shadowId})`}
            />
            <path
              d={`M${left + 2},${top + 2} Q${left + w * 0.28},${y} ${left + 2},${top + h - 2}`}
              fill="none" stroke={outColor} strokeWidth={2}
            />
          </g>
        );
      case 'XNOR':
        return (
          <g>
            <path
              d={`M${left + 9},${top} Q${left + w * 0.38},${y} ${left + 9},${top + h} Q${left + w * 0.5},${top + h} ${left + w * 0.82},${y} Q${left + w * 0.5},${top} ${left + 9},${top}`}
              fill={`url(#${gradId})`} stroke={outColor} strokeWidth={2} filter={`url(#${shadowId})`}
            />
            <path
              d={`M${left + 2},${top + 2} Q${left + w * 0.28},${y} ${left + 2},${top + h - 2}`}
              fill="none" stroke={outColor} strokeWidth={2}
            />
            <circle cx={left + w * 0.9} cy={y} r={5} fill="white" stroke={outColor} strokeWidth={2} />
          </g>
        );
      default:
        return <rect x={left} y={top} width={w} height={h} rx={8} fill={fillColor} stroke={outColor} strokeWidth={2} />;
    }
  };

  return (
    <g>
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={outColor} floodOpacity="0.2" />
        </filter>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={output ? 'hsl(152, 55%, 97%)' : 'hsl(0, 68%, 97%)'} />
          <stop offset="100%" stopColor={output ? 'hsl(152, 55%, 92%)' : 'hsl(0, 68%, 94%)'} />
        </linearGradient>
      </defs>
      {renderBody()}
      <text x={x} y={y - 3} textAnchor="middle" fontSize={10} fontWeight="700" letterSpacing="0.5"
        fill={outColor} fontFamily="'Space Grotesk', sans-serif">
        {gateType}
      </text>
      <text x={x} y={y + 11} textAnchor="middle" fontSize={9} fontWeight="500"
        fill={outColor} opacity={0.85} fontFamily="'JetBrains Mono', monospace">
        {output ? '1' : '0'}
      </text>
    </g>
  );
};

const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  numLevels,
  circuitResult,
  onToggleInput,
  flipFlopEnabled,
  flipFlopPosition,
  srState,
}) => {
  const numInputs = Math.pow(2, numLevels);
  const inputSpacing = Math.max(MIN_GAP_Y, 44);
  const canvasHeight = Math.max(numInputs * inputSpacing + 40, 220);
  const canvasWidth = (numLevels + 2) * LEVEL_GAP_X + 80;

  const inputX = 60;
  const getInputY = (i: number) => (canvasHeight / numInputs) * i + (canvasHeight / numInputs) / 2;

  const getGatePos = (level: number, index: number) => {
    const gatesInLevel = Math.pow(2, numLevels - 1 - level);
    const spacing = canvasHeight / gatesInLevel;
    return {
      x: inputX + (level + 1) * LEVEL_GAP_X,
      y: spacing * index + spacing / 2,
    };
  };

  const wireOn = 'hsl(152, 55%, 42%)';
  const wireOff = 'hsl(225, 15%, 80%)';

  return (
    <div className="overflow-auto circuit-grid" style={{ maxHeight: '75vh' }}>
      <svg
        width={canvasWidth}
        height={canvasHeight}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className="mx-auto"
      >
        {/* Wires: inputs to level-0 gates */}
        {circuitResult.gateResults[0]?.map((gate, gi) => {
          const gatePos = getGatePos(0, gi);
          const inAy = getInputY(gi * 2);
          const inBy = getInputY(gi * 2 + 1);
          const midX = (inputX + INPUT_R + gatePos.x - GATE_W / 2) / 2;
          return (
            <g key={`wire-input-${gi}`}>
              <path d={`M${inputX + INPUT_R},${inAy} C${midX},${inAy} ${midX},${gatePos.y - 8} ${gatePos.x - GATE_W / 2},${gatePos.y - 8}`}
                stroke={gate.inputA ? wireOn : wireOff} strokeWidth={2} fill="none" strokeLinecap="round" />
              <path d={`M${inputX + INPUT_R},${inBy} C${midX},${inBy} ${midX},${gatePos.y + 8} ${gatePos.x - GATE_W / 2},${gatePos.y + 8}`}
                stroke={gate.inputB ? wireOn : wireOff} strokeWidth={2} fill="none" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Wires between levels */}
        {circuitResult.gateResults.map((levelGates, lvl) => {
          if (lvl === 0) return null;
          return levelGates.map((gate, gi) => {
            const gatePos = getGatePos(lvl, gi);
            const childA = getGatePos(lvl - 1, gi * 2);
            const childB = getGatePos(lvl - 1, gi * 2 + 1);
            const prevGates = circuitResult.gateResults[lvl - 1];
            const midX = (childA.x + GATE_W / 2 + gatePos.x - GATE_W / 2) / 2;
            return (
              <g key={`wire-${lvl}-${gi}`}>
                <path d={`M${childA.x + GATE_W / 2},${childA.y} C${midX},${childA.y} ${midX},${gatePos.y - 8} ${gatePos.x - GATE_W / 2},${gatePos.y - 8}`}
                  stroke={prevGates[gi * 2]?.output ? wireOn : wireOff} strokeWidth={2} fill="none" strokeLinecap="round" />
                <path d={`M${childB.x + GATE_W / 2},${childB.y} C${midX},${childB.y} ${midX},${gatePos.y + 8} ${gatePos.x - GATE_W / 2},${gatePos.y + 8}`}
                  stroke={prevGates[gi * 2 + 1]?.output ? wireOn : wireOff} strokeWidth={2} fill="none" strokeLinecap="round" />
              </g>
            );
          });
        })}

        {/* Wire to output */}
        {numLevels > 0 && (() => {
          const topPos = getGatePos(numLevels - 1, 0);
          const finalOut = circuitResult.finalOutput;
          const outX = topPos.x + GATE_W / 2 + 50;
          return (
            <line x1={topPos.x + GATE_W / 2} y1={topPos.y} x2={outX} y2={topPos.y}
              stroke={finalOut ? wireOn : 'hsl(0, 68%, 52%)'} strokeWidth={3} strokeLinecap="round" />
          );
        })()}

        {/* Output indicator */}
        {numLevels > 0 && (() => {
          const topPos = getGatePos(numLevels - 1, 0);
          const outX = topPos.x + GATE_W / 2 + 70;
          const finalOut = circuitResult.finalOutput;
          const color = finalOut ? 'hsl(152, 55%, 42%)' : 'hsl(0, 68%, 52%)';
          return (
            <g>
              <defs>
                <filter id="output-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={color} floodOpacity="0.35" />
                </filter>
              </defs>
              <circle cx={outX} cy={topPos.y} r={22}
                fill={finalOut ? 'hsl(152, 55%, 42%, 0.1)' : 'hsl(0, 68%, 52%, 0.1)'}
                stroke={color} strokeWidth={2.5} filter="url(#output-glow)"
              />
              <text x={outX} y={topPos.y + 6} textAnchor="middle" fontSize={16} fontWeight="800"
                fill={color} fontFamily="'Outfit', sans-serif">{finalOut ? '1' : '0'}</text>
              <text x={outX} y={topPos.y - 30} textAnchor="middle" fontSize={10} fontWeight="600"
                fill="hsl(225, 10%, 45%)" fontFamily="'Outfit', sans-serif" letterSpacing="2">SALIDA</text>
            </g>
          );
        })()}

        {/* Gates */}
        {circuitResult.gateResults.map((levelGates, lvl) =>
          levelGates.map((gate, gi) => {
            const pos = getGatePos(lvl, gi);
            return (
              <g key={`gate-${lvl}-${gi}`}>
                <GateSymbol x={pos.x} y={pos.y} gateType={gate.gateType} output={gate.output} id={`${lvl}-${gi}`} />
                <text x={pos.x} y={pos.y - GATE_H / 2 - 6} textAnchor="middle" fontSize={8} fontWeight="600"
                  fill="hsl(225, 10%, 55%)" fontFamily="'Outfit', sans-serif" letterSpacing="0.5">
                  N{numLevels - lvl}
                </text>
              </g>
            );
          })
        )}

        {/* Input nodes */}
        {Array.from({ length: numInputs }, (_, i) => {
          const y = getInputY(i);
          const val = circuitResult.inputValues[i];
          const isFFInput = flipFlopEnabled && flipFlopPosition === 'input' && i === 0;
          const color = val ? 'hsl(152, 55%, 42%)' : 'hsl(225, 15%, 72%)';
          return (
            <g key={`input-${i}`} onClick={() => !isFFInput && onToggleInput(i)} style={{ cursor: isFFInput ? 'default' : 'pointer' }}>
              <defs>
                <filter id={`input-shadow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={color} floodOpacity="0.25" />
                </filter>
              </defs>
              <circle cx={inputX} cy={y} r={INPUT_R}
                fill={val ? 'hsl(152, 55%, 95%)' : 'hsl(225, 15%, 97%)'}
                stroke={color}
                strokeWidth={2.5} filter={`url(#input-shadow-${i})`}
              />
              <text x={inputX} y={y + 5} textAnchor="middle" fontSize={12} fontWeight="700"
                fill={val ? 'hsl(152, 55%, 35%)' : 'hsl(225, 10%, 50%)'} fontFamily="'Outfit', sans-serif">
                {val ? '1' : '0'}
              </text>
              <text x={inputX - 24} y={y + 4} textAnchor="end" fontSize={9} fontWeight="600"
                fill="hsl(225, 10%, 50%)" fontFamily="'Outfit', sans-serif">
                {isFFInput ? 'FF→' : ''}E{i}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CircuitCanvas;
