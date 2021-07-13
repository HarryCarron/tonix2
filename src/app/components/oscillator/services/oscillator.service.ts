import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OscillatorService {

  constructor() { }

  readonly connectedState$ = new BehaviorSubject(false);

  toggleOscillator(state: boolean): void {
    this.connectedState$.next(state);
  }
}
