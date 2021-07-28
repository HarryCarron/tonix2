import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OscillatorGlobalService } from './../../oscillator/services/oscillator-global.service';
import { Oscillator } from './../../../app.component';
import { animationFrameScheduler, of, scheduled, timer } from 'rxjs';
import { repeat, takeUntil } from 'rxjs/operators';
import { Points } from './adsr-envelope.objects';


enum Curves {
  lin,
  exp,
  sin
}

const AVAILABLE_DURATION = 4;
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
  renderingHeight: any;

  readonly curveTypes = [Curves.lin, Curves.lin, Curves.lin];

  constructor(private oscillatorGlobalService: OscillatorGlobalService, private cd: ChangeDetectorRef) { }

  @Input() activeOscillator: Oscillator | undefined;

  get lineColour(): string {
    return this.isEditable ? 'white' : 'gray';
  }
  travelUnit: number | undefined;
  renderingWidth = 0;
  isEditable = false;

  get lineBase(): number {
    return this.availableHeight - (this.PAD + 10);
  }

  curves = Curves;

  private envelopeContainer: any;
  private svgContainer: any;

  availableHeight = 0;
  availableWidth = 0;

  cumulativePoints: Points = [0, 0, 0, 0];
  points: Points = [0, 0, 0, 0];


  readonly PAD = 35;

  secondDurationLabels = [0, 1, 2, 3, 4];

  /**
   * Value for width of the sustain portion of the envelope.
   * As sustain controls amplitude (and is controlled by Y axis of env) the width is entirely aesthetic;
   */
  sustainWidth = 0;

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

      this.renderingHeight  = this.availableHeight - (this.PAD * 2);
      this.renderingWidth  = this.availableWidth - (this.PAD * 2);
      this.travelUnit  = this.renderingWidth / 10;
      this.secondWidth = (this.renderingWidth / AVAILABLE_DURATION);
    });

  }

  private initEnvelope(oscillator: Oscillator): void {

    this.observeEditableState(oscillator);
    const amp = oscillator.getValue(AMP_KEY);

    this.setAmpValue(Object.values(amp) as number[]);
  }

  private observeEditableState(oscillator: Oscillator): void {

    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
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

    const sustainWidth = AVAILABLE_DURATION - (ampValues.filter((amp, i) => i !== 2).reduce((a, b) => a + b));

    let totalDuration = 0;

    ampValues.forEach((v, i) => {
      if (i !== 2) {
        totalDuration += v;
        this.cumulativePoints[i] = totalDuration * this.secondWidth;
        this.points[i] = v * this.secondWidth;
      } else {
        totalDuration += sustainWidth;
        this.sustainWidth =  sustainWidth * this.secondWidth;
        this.cumulativePoints[i] = this.renderingHeight - (v * this.renderingHeight);
      }
    });
  }

  toggleCurve(curveID: number): void {
    let curve = this.curveTypes[curveID];
    if (curve === 2) {
      curve = 0;
      this.curveTypes[curveID] = curve;
    } else {
      this.curveTypes[curveID] = curve + 1;
    }
    this.cd.detectChanges();

  }

  getAttackCurve(): string {
    const curveType = this.curveTypes[0];
    let curve = '';
    switch (curveType) {
      case(Curves.sin): {
        curve =  `Q ${ this.PAD } ${ this.PAD }, `;
        break;
      }
      case(Curves.exp): {
        curve = `Q ${ this.PAD + this.cumulativePoints[0] } ${ this.lineBase }, `;
        break;
      }
    }

    return [
      `M ${this.PAD} ${ this.lineBase } `,
      curve,
      `${this.PAD + this.cumulativePoints[0]} ${ this.PAD }`
    ].join('');
  }

  getDecayCurve(): string {
    const curveType = this.curveTypes[1];
    let curve = '';
    switch (curveType) {
        case(Curves.sin): {
          curve = `Q ${ this.PAD + this.cumulativePoints[1] } ${ this.PAD }, `;
          break;
        }
        case(Curves.exp): {
          curve = `Q ${ this.PAD + this.cumulativePoints[0] } ${ this.PAD + this.cumulativePoints[2] }, `;
        }
    }

    return [
      `M ${this.PAD + this.cumulativePoints[0]} ${ this.PAD } `,
      curve,
      `${this.PAD + this.cumulativePoints[1]} ${ this.PAD + this.cumulativePoints[2] }`
    ].join('');
  }

  getReleaseCurve(): string {

    return '';
  }


//   <line
//   #decayLine
//   [ngClass]="{'line-off' : !isEditable}"
//   [attr.x1]="PAD + points[0]"
//   [attr.y1]="PAD"
//   [attr.x2]="PAD + points[1]"
//   [attr.y2]="PAD + points[2]"
//   stroke-linecap="round"
//   stroke-width="3"
//   stroke="white"
// />


  @ViewChild('envelopeContainer') set envelopeContainerElem(e: any) {
    this.envelopeContainer = e.nativeElement;
  }

  @ViewChild('svgContainer') set svgContainerElem(e: any) {
    this.svgContainer = e.nativeElement;
  }

}

