// Pure boolean logic gate functions — 2 inputs, 1 output

export type GateType = 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export const AND = (a: boolean, b: boolean): boolean => a && b;
export const OR = (a: boolean, b: boolean): boolean => a || b;
export const NAND = (a: boolean, b: boolean): boolean => !(a && b);
export const NOR = (a: boolean, b: boolean): boolean => !(a || b);
export const XOR = (a: boolean, b: boolean): boolean => a !== b;
export const XNOR = (a: boolean, b: boolean): boolean => a === b;

export const gateFunction: Record<GateType, (a: boolean, b: boolean) => boolean> = {
  AND, OR, NAND, NOR, XOR, XNOR,
};

export const ALL_GATE_TYPES: GateType[] = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'];

// SR Flip-Flop
export type SRState = { q: boolean; invalid: boolean };

export function evaluateSR(s: boolean, r: boolean, prevQ: boolean): SRState {
  if (s && r) return { q: prevQ, invalid: true };
  if (s && !r) return { q: true, invalid: false };
  if (!s && r) return { q: false, invalid: false };
  return { q: prevQ, invalid: false }; // S=0, R=0 → hold
}
