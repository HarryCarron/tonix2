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

    const r = () => Math.floor(Math.random() * 10) / 10;

    this.oscillators = [1, 2, 3].map((oscNumber: number) =>
      new Oscillator(
        {
          number: oscNumber,
          wavetype: Wavetype.sine,
          connected: oscNumber === 1,
          detune: 0,
          amp: {
            attack: r(),
            decay: r(),
            sustain: 0.4,
            release: r()
          },
        }
      )
    );

    timer(1000).subscribe(() => this.oscillatorGlobalService.setActiveOscillator((this.oscillators as Oscillator[])[0]));

  }

}


class ChangeEmit {

  readonly valueChange = new Subject();

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

export class Oscillator extends ChangeEmit {

  constructor(data: OscillatorData) {
    super();
    this.number = data?.number;
    this.wavetype = data?.wavetype;
    this.connected = data.connected;
    this.detune = data.detune;
    this.amp = data.amp;
  }

  number: number | undefined;
  wavetype: Wavetype | undefined;
  connected: boolean | undefined;
  detune: number | undefined;
  amp: Amp | undefined;

}
