import { GateType, gateFunction } from './gates';

export interface LevelConfig {
  gateType: GateType;
}

export interface GateResult {
  level: number;
  index: number;
  gateType: GateType;
  inputA: boolean;
  inputB: boolean;
  output: boolean;
}

export interface CircuitResult {
  gateResults: GateResult[][];  // indexed by level (0 = bottom)
  finalOutput: boolean;
  inputValues: boolean[];
}

/**
 * Evaluates a tree circuit bottom-up.
 * 
 * Tree structure:
 * - N levels total
 * - Level N (bottom) has 2^(N-1) gates → needs 2^N inputs
 * - Level 1 (top) has 1 gate → produces final output
 * 
 * We store levels 0-indexed internally: level 0 = bottom, level (N-1) = top
 */
export function evaluateCircuit(
  numLevels: number,
  levelConfigs: LevelConfig[],
  inputs: boolean[]
): CircuitResult {
  const expectedInputs = Math.pow(2, numLevels);
  const paddedInputs = [...inputs];
  while (paddedInputs.length < expectedInputs) paddedInputs.push(false);

  const gateResults: GateResult[][] = [];
  let currentValues = paddedInputs;

  // Bottom-up: level 0 is the bottom (most gates), level numLevels-1 is top (1 gate)
  for (let lvl = 0; lvl < numLevels; lvl++) {
    const numGates = Math.pow(2, numLevels - 1 - lvl);
    // levelConfigs is ordered top-to-bottom (index 0 = Level 1 = top)
    // So for bottom-up processing: config index = numLevels - 1 - lvl
    const configIndex = numLevels - 1 - lvl;
    const gateType = levelConfigs[configIndex]?.gateType ?? 'AND';
    const gateFn = gateFunction[gateType];

    const levelResults: GateResult[] = [];
    const nextValues: boolean[] = [];

    for (let i = 0; i < numGates; i++) {
      const inputA = currentValues[i * 2];
      const inputB = currentValues[i * 2 + 1];
      const output = gateFn(inputA, inputB);

      levelResults.push({
        level: lvl,
        index: i,
        gateType,
        inputA,
        inputB,
        output,
      });
      nextValues.push(output);
    }

    gateResults.push(levelResults);
    currentValues = nextValues;
  }

  return {
    gateResults,
    finalOutput: currentValues[0] ?? false,
    inputValues: paddedInputs,
  };
}
