import { AppModule } from "./app.module";

export enum Wavetype {
  sine,
  saw,
  square
}

export interface Amp {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
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
  number: number;
  wavetype: Wavetype;
  connected: boolean;
  detune: number;
  amp: Amp;
}

export interface CoOrds {
  x: number;
  y: number;
}
