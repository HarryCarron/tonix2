import { Component, Input, OnInit } from '@angular/core';
import { WAVETYPES, OscillatorData } from '../../app.objects';
import { OscillatorService } from '../oscillator/services/oscillator.service';
import { OscillatorGlobalService } from '../oscillator/services/oscillator-global.service';


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

  @Input() data: OscillatorData | undefined;

  readonly wavetypes = WAVETYPES;

  selectOscillator(oscNumber: number ): void {
    this.oscillatorGlobalService.selectedOsc$.next(oscNumber as number);
  }


  ngOnInit(): void {
    const data = this.data as OscillatorData;
    const connected = data.connected;

    this.oscillatorService.toggleOscillator(connected);
  }

}
