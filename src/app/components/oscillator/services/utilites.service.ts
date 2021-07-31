import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitesService {

  constructor() { }

  public nArray(n: number): number[] {
    return Array.from({ length : n }).map((_, i) => i);
  }
}
