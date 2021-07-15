import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OscillatorData } from 'src/app/app.objects';
import { Oscillator } from './../../../app.component';


@Injectable({
  providedIn: 'root'
})
export class OscillatorService {

  constructor() { }

  get activeOscNumber$(): Observable<Oscillator> {
    return this.currentlySelectedOscillator$ as Observable<Oscillator>;
  }

  readonly currentlySelectedOscillator$ = new BehaviorSubject<Oscillator | null>(null);

  setSelectedOscillator(oscillator: Oscillator): void {
    this.currentlySelectedOscillator$.next(oscillator);
  }
}
