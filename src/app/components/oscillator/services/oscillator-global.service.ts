import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OscillatorData } from 'src/app/app.objects';
import { Oscillator } from './../../../app.component';

@Injectable({
  providedIn: 'root'
})
export class OscillatorGlobalService {

  readonly selectedOsc$ = new BehaviorSubject<Oscillator | null>(null);

  setActiveOscillator(requestedOscillator: Oscillator): void {
    const currentlyActive = this.selectedOsc$.getValue();
    if (currentlyActive !== requestedOscillator) {
      this.selectedOsc$.next(requestedOscillator);
    }
  }

  constructor() { }
}
