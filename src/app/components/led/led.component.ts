import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OscillatorService } from '../../components/oscillator/services/oscillator.service';
import { LogService } from '../../logService/log.service';

@Component({
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.css']
})
export class LedComponent {

  constructor(public oscillatorService: OscillatorService) { }

  @Input() oscNumber: number | undefined;

  toggle(): void {
    const currentState = this.oscillatorService.connectedState$.getValue();
    this.oscillatorService.toggleOscillator(!currentState);
  }

}
