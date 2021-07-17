import { Component, Input, OnInit } from '@angular/core';
import { WAVETYPES, OscillatorData } from '../../app.objects';
import { OscillatorService } from '../oscillator/services/oscillator.service';
import { OscillatorGlobalService } from '../oscillator/services/oscillator-global.service';
import { Oscillator } from './../../app.component';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.css'],
  providers: [OscillatorService]
})
export class OscillatorComponent implements OnInit {

  constructor(
      public oscillatorService: OscillatorService,
      public oscillatorGlobalService: OscillatorGlobalService
    ) {
  }

  get selectedOsc$(): Observable<Oscillator> {
    return this.oscillatorService.currentlySelectedOscillator$ as Observable<Oscillator>;
  }

  @Input() oscillator: Oscillator | undefined;

  readonly wavetypes = WAVETYPES;

  selectOscillator(oscillator: Oscillator ): void {
    this.oscillatorGlobalService.setActiveOscillator(oscillator);
  }

  ngOnInit(): void {}

}
