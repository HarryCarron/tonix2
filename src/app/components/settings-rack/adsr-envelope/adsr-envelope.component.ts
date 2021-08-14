import { AfterViewInit, Component, Input, OnInit, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { OscillatorGlobalService } from './../../oscillator/services/oscillator-global.service';
import { UtilitesService } from './../../oscillator/services/utilites.service';
import { Oscillator } from './../../../app.component';
import { timer } from 'rxjs';
import { Points } from './adsr-envelope.objects';
import { DragAndDropComponent } from './../../../baseComponents/drag-and-drop/drag-and-drop.component';

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
export class AdsrEnvelopeComponent extends DragAndDropComponent implements OnInit, AfterViewInit {
  animationRunning: any;
  currentAnimation$: any;
  currentSubscription: any;
  renderingHeight: any;

  pathWidth = 3;

  hovered = [
    false,
    false,
    false,
    false
  ];

  readonly curveTypes = [Curves.lin, Curves.lin, Curves.lin];
  svgPositions: any;
  amp: any;

  constructor(

    private oscillatorGlobalService: OscillatorGlobalService,
    private cd: ChangeDetectorRef,
    public utils: UtilitesService,
    public renderer: Renderer2
    ) {
      super(renderer);
    }

  @Input() activeOscillator: Oscillator | undefined;

  get lineColour(): string {
    return this.isEditable ? 'white' : 'gray';
  }
  travelUnit = 0;
  renderingWidth = 0;
  isEditable = false;

  get lineBase(): number {
    return this.availableHeight - (this.YPAD + 10);
  }

  curves = Curves;

  private envelopeContainer: any;
  private svgContainer: any;

  availableHeight = 0;
  availableWidth = 0;

  cumulativePoints: Points = [0, 0, 0, 0];
  points: Points = [0, 0, 0, 0];

  readonly handleRadius: number = 4;
  readonly YPAD = 35;
  readonly XPAD = 50;

  secondDurationLabels = [0, 1, 2, 3, 4];

  /**
   * Value for width of the sustain portion of the envelope.
   * As sustain controls amplitude (and is controlled by Y axis of env) the width is entirely aesthetic;
   */
  sustainWidth = 0;

  secondWidth = 0;

  ngOnInit(): void {
    const activeOscillator = this.oscillatorGlobalService.selectedOsc$.getValue();

    if (activeOscillator) {
      this.initEnvelope(activeOscillator as Oscillator);
    }

    this.subscribeToOscillatorChanges();
    this.subscribeToPointChanges();

  }
  private subscribeToOscillatorChanges(): void {
    this.oscillatorGlobalService.selectedOsc$.subscribe(
      newActiveOscillator => newActiveOscillator && this.initEnvelope(newActiveOscillator as Oscillator)
    );
  }

  private subscribeToPointChanges(): void {
    this.dragAndDrop$.subscribe((data: any) => {
      const actualX = ((data.mouseLocation.x - (this.svgPositions.left + this.XPAD)) / 100) / (this.secondWidth / 100);

      if (actualX <= 0) {
        return;
      }
      this.amp.attack = actualX;
      const values: number[] = Object.values(this.amp);
      this.setAmpValue(values, false);
    });
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(_ => {
      this.availableHeight = this.envelopeContainer.offsetHeight;
      this.availableWidth = this.envelopeContainer.offsetWidth;
      this.svgContainer.style.width = this.availableWidth;
      this.svgContainer.style.height = this.availableHeight;

      this.renderingHeight  = this.availableHeight - (this.YPAD * 2);
      this.renderingWidth  = this.availableWidth - (this.XPAD * 2);
      this.travelUnit  = this.renderingWidth / 100;
      this.secondWidth = (this.renderingWidth / AVAILABLE_DURATION);
    });

  }

  private initEnvelope(oscillator: Oscillator): void {
    this.observeEditableState(oscillator);
    const amp = oscillator.getValue(AMP_KEY);
    this.amp = amp;
    this.setAmpValue(Object.values(this.amp) as number[], true);
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

  private setAmpValue(ampValues: number[], padSustainWidth: boolean): void {

    const sustainWidth = AVAILABLE_DURATION - (ampValues.filter((amp, i) => i !== 2).reduce((a, b) => a + b));

    let totalDuration = 0;

    ampValues.forEach((v, i) => {
      if (i !== 2) {
        totalDuration += v;
        this.cumulativePoints[i] = totalDuration * this.secondWidth;
        this.points[i] = v * this.secondWidth;
      } else {
        totalDuration += sustainWidth;
        if (padSustainWidth) {
          this.sustainWidth =  sustainWidth * this.secondWidth;
        }

        this.points[2] = this.sustainWidth;
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
        curve =  `Q ${ this.XPAD } ${ this.YPAD }, `;
        break;
      }
      case(Curves.exp): {
        curve = `Q ${ this.XPAD + this.cumulativePoints[0] } ${ this.lineBase }, `;
        break;
      }
    }

    return [
      `M ${this.XPAD} ${ this.lineBase } `,
      curve,
      `${this.XPAD + this.cumulativePoints[0]} ${ this.YPAD }`
    ].join('');
  }

  getDecayCurve(): string {
    const curveType = this.curveTypes[1];
    let curve = '';
    switch (curveType) {
        case(Curves.sin): {
          curve = `Q ${ this.XPAD + this.cumulativePoints[1] } ${ this.YPAD }, `;
          break;
        }
        case(Curves.exp): {
          curve = `Q ${ this.XPAD + this.cumulativePoints[0] } ${ this.YPAD + this.cumulativePoints[2] }, `;
        }
    }

    return [
      `M ${this.XPAD + this.cumulativePoints[0]} ${ this.YPAD } `,
      curve,
      `${this.XPAD + this.cumulativePoints[1]} ${ this.YPAD + this.cumulativePoints[2] }`
    ].join('');
  }

  getReleaseCurve(): string {
    const curveType = this.curveTypes[2];
    let curve;
    switch (curveType) {
      case(Curves.sin): {
        curve = `Q ${ this.XPAD + this.points[2] } ${ this.lineBase }, `;
        break;
      }
      case(Curves.exp): {
        curve = `Q ${ this.XPAD + this.cumulativePoints[3] } ${ this.YPAD + this.cumulativePoints[2] }, `;
      }
    }
    return [
      `M ${ this.XPAD + this.points[2] } ${ this.YPAD + this.cumulativePoints[2] } `,
      curve,
      `${ this.XPAD + this.cumulativePoints[3] } ${ this.lineBase }`
    ].join('');
  }

  @ViewChild('envelopeContainer') set envelopeContainerElem(e: any) {
    this.envelopeContainer = e.nativeElement;
  }

  @ViewChild('svgContainer') set svgContainerElem(e: any) {
    this.svgContainer = e.nativeElement;
    this.svgPositions = this.svgContainer.getBoundingClientRect();
  }

  values(obj: any): any[] {
    return Object.values(obj);
  }

}

