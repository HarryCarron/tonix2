import { Component, Input, OnInit } from '@angular/core';
import { WAVETYPES, OscillatorData } from '../../app.objects';
import { OscillatorService } from '../oscillator/oscillator.service';


@Component({
  selector: 'app-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.css'],
  providers: [OscillatorService]
})
export class OscillatorComponent implements OnInit {

  constructor(public oscillatorService: OscillatorService) {
  }

  @Input() data: OscillatorData | undefined;

  readonly wavetypes = WAVETYPES;


  ngOnInit(): void {
    const data = this.data as OscillatorData;
    const connected = data.connected;

    this.oscillatorService.toggleOscillator(connected);
  }

}
