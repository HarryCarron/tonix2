import { Component } from '@angular/core';
import { OscillatorData, Wavetype } from '../app/app.objects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly oscillators: OscillatorData[] = [
    {
      number: 1,
      wavetype: Wavetype.sine,
      connected: true,
      isLastOsc: false,
      detune: 0
    },
    {
      number: 2,
      wavetype: Wavetype.sine,
      connected: true,
      isLastOsc: false,
      detune: 0
    },
    {
      number: 3,
      wavetype: Wavetype.sine,
      connected: true,
      isLastOsc: true,
      detune: 0
    },
  ];
}
