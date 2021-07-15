import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OscillatorService } from '../../components/oscillator/services/oscillator.service';
import { OscillatorGlobalService } from '../../components/oscillator/services/oscillator-global.service';
import { OscillatorData } from 'src/app/app.objects';
import { Oscillator } from 'src/app/app.component';

@Component({
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.css']
})
export class LedComponent {

  constructor(
    public oscillatorService: OscillatorService,
    public oscillatorGlobalService: OscillatorGlobalService
    ) { }

  @Input() oscillator: Oscillator | undefined;

  toggle(): void {
    const newConnectedState = !(this.oscillator as Oscillator).getValue('connected');
    (this.oscillator as Oscillator).setValue(
      {
        key: 'connected',
        value: newConnectedState,
        emitEvent: true
      }
      );
  }

}
