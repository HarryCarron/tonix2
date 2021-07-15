import { Component, OnInit, ViewChild } from '@angular/core';
import { Amp, OscillatorData, Wavetype } from '../app/app.objects';
import { OscillatorGlobalService } from './components/oscillator/services/oscillator-global.service';
import { OscillatorComponent } from './components/oscillator/oscillator.component';
import { Subject, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private oscillatorGlobalService: OscillatorGlobalService) {}

  @ViewChild(OscillatorComponent) oscillatorComponent: OscillatorComponent | undefined;

  oscillators: Oscillator[] | undefined;

  ngOnInit(): void {

    this.oscillators = [1, 2, 3].map((oscNumber: number) =>
      new Oscillator(
        {
          number: oscNumber,
          wavetype: Wavetype.sine,
          connected: oscNumber === 1,
          detune: 0,
          amp: {
            attack: (Math.floor(Math.random() * 4) + 1) / 10,
            // attack: 1,
            decay: 0.2,
            sustain: 1.0,
            release: 0.8
          },
        }
      )
    );

    timer(300).subscribe(() => this.oscillatorGlobalService.setActiveOscillator(this.oscillators[0] as Oscillator));

  }

}


/**
 * todo: make base
 */
export class Oscillator {
  valueChange = new Subject();
  oscillatorChange = new Subject();

  constructor(data: OscillatorData) {
    this.number = data?.number;
    this.wavetype = data?.wavetype;
    this.connected = data.connected;
    this.detune = data.detune;
    this.amp = data.amp;
  }

    private number: number | undefined;
    private wavetype: Wavetype | undefined;
    private connected: boolean | undefined;
    private detune: number | undefined;
    private amp: Amp | undefined;

    public setValue(update: {key: string, value: any, emitEvent: boolean}): void {
      (this as any)[update.key] = update.value;
      if (!update.emitEvent) {
        return;
      }
      this.valueChange.next(
        { [update.key]: update.value }
      );
    }

    public getValue(key: string): any {
      return (this as any)[key];
    }
}
