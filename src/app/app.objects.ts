export enum Wavetype {
  sine,
  saw,
  square
}

export const WAVETYPES = [
  {
    label: 'sine',
    id: Wavetype.sine
  },
  {
    label: 'sawtooth',
    id: Wavetype.saw
  },
  {
    label: 'square',
    id: Wavetype.square
  },
];

export interface OscillatorData {
  isLastOsc: boolean;
  number: number;
  wavetype: Wavetype;
  connected: boolean;
  detune: number;
}

export interface CoOrds {
  x: number;
  y: number;
}
