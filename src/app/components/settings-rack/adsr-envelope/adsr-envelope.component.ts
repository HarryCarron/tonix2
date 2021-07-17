import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { OscillatorGlobalService } from './../../oscillator/services/oscillator-global.service';
import { Oscillator } from './../../../app.component';
import { animationFrameScheduler, of, scheduled, timer } from 'rxjs';
import { repeat, takeUntil } from 'rxjs/operators';

const CONNECTED_KEY = 'connected';
const AMP_KEY = 'amp';

@Component({
  selector: 'app-adsr-envelope',
  templateUrl: './adsr-envelope.component.html',
  styleUrls: ['./adsr-envelope.component.css']
})
export class AdsrEnvelopeComponent implements OnInit, AfterViewInit {
  animationRunning: any;
  currentAnimation$: any;
  currentSubscription: any;


  constructor(private oscillatorGlobalService: OscillatorGlobalService) { }

  @Input() activeOscillator: Oscillator | undefined;

  get lineColour(): string {
    return this.isEditable ? 'white' : 'gray';
  }
  travelUnit: number | undefined;
  renderingWidth = 0;
  isEditable = false;

  private envelopeContainer: any;
  private svgContainer: any;

  availableHeight = 0;
  availableWidth = 0;

  points = [0, 0, 0, 0];


  readonly PAD = 40;

  secondDurationLabels = [0, 1, 2, 3, 4];

  secondWidth = 0;

  ngOnInit(): void {
    this.oscillatorGlobalService.selectedOsc$.subscribe(
      activeOscillator => activeOscillator && this.initEnvelope(activeOscillator as Oscillator)
    );
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(_ => {
      this.availableHeight =  this.envelopeContainer.offsetHeight;
      this.availableWidth =  this.envelopeContainer.offsetWidth;
      this.svgContainer.style.width = this.availableWidth;
      this.svgContainer.style.height = this.availableHeight;

      this.renderingWidth  = (this.availableWidth - this.PAD * 2);
      this.travelUnit  = this.renderingWidth / 10;
      this.secondWidth = (this.renderingWidth / 4);
    });

  }

  private initEnvelope(oscillator: Oscillator): void {

    this.observeEditableState(oscillator);
    const amp = oscillator.getValue(AMP_KEY);

    this.setAmpValue(Object.values(amp) as number[]);
  }

  private observeEditableState(oscillator: Oscillator): void {

    if (this.currentSubscription) {
      this.currentSubscription();
    }

    this.isEditable = oscillator.getValue(CONNECTED_KEY);

    this.currentSubscription = oscillator.valueChange.subscribe(
      (newConnectedState: any) => {
        if (CONNECTED_KEY in newConnectedState) {
          this.isEditable = (newConnectedState.connected as boolean);
        }
      }
    );
  }

  private setAmpValue(ampValues: number[]): void {
    ampValues.forEach((v, i, o) =>
      this.points[i] = o.slice(0, i + 1).reduce((a, b) => a + b) * this.secondWidth
    );
  }





  // private animate(): void {

  //   if (this.animationRunning) {
  //     this.currentAnimation$.next();
  //   }

  //   this.animationRunning = true;
  //   let count = -1;
  //   scheduled(of(0), animationFrameScheduler)
  //   .pipe(repeat(), takeUntil(this.currentAnimation$))
  //   .subscribe(x => {
  //     count ++;


  //     if (count === time) {
  //       this.animationRunning = false;
  //       this.currentAnimation$.next();
  //     }
  //   });
  // };


  @ViewChild('envelopeContainer') set envelopeContainerElem(e: any) {
    this.envelopeContainer = e.nativeElement;
  }

  @ViewChild('svgContainer') set svgContainerElem(e: any) {
    this.svgContainer = e.nativeElement;
  }

}

