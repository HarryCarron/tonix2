import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnChanges } from '@angular/core';
import { CoOrds, OscillatorData } from '../../app.objects';
import { OscillatorService } from '../../components/oscillator/services/oscillator.service';

type degree = number;

const DISCONNECTED_PLACEHOLDER = '--';

interface KnobMetric {
  upperLimit: number;
  lowerLimit: number;
  scaleUnit: number;
}

interface KnobMetrics {
  [output: string]: KnobMetric;
  rotation: KnobMetric;
}

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css'],
})
export class KnobComponent implements AfterViewInit, OnChanges {
  private mouseDownAt = 0;
  private mouseDroppedAt = 0;
  private yTopLimit = 0;
  private yBottomLimit = 0;

  private outputCache = 0;

  @Input() oscillator: OscillatorData | undefined;

  readonly inputRange = 100;

  output: number | string = 0;

  private readonly metrics: KnobMetrics = {
    output: {
      upperLimit: 1,
      lowerLimit: 0,
      scaleUnit: 0,
    },
    rotation: {
      upperLimit: 330,
      lowerLimit: 30,
      scaleUnit: 0,
    },
  };

  readonly rotationLowerLimit = 30;
  readonly rotationUpperLimit = 330;

  readonly scaleUnit: number = 0;


  private arc: any = {};
  private knob: any = {};
  onState$: any;

  @ViewChild('arc', {static: false}) set Arc(nElement: ElementRef) {
      if (nElement?.nativeElement) {
          this.arc = nElement.nativeElement;
      }
  }

  @ViewChild('top', { static: true })
  set Knob(nElement: any) {
    if (nElement?.nativeElement) {
      this.knob = nElement.nativeElement;
    }
  }


  private relativeTravel = 0;

  private startKnob = 0.7 * Math.PI;

  ngOnChanges(): void {
    if (this.oscillator) {
      if (this.oscillator.connected) {
        this.output = this.outputCache;
      } else {
        this.output = DISCONNECTED_PLACEHOLDER;
      }
    }
  }

  private setRotation(amm: number): void {
    const calculatedDegree = Math.floor(this.metrics.rotation.scaleUnit * amm);
    if (calculatedDegree > this.rotationUpperLimit) {
      return;
    }
    if (calculatedDegree < this.rotationLowerLimit) {
      return;
    }
    (this.knob as any).setAttribute('transform', `rotate(${calculatedDegree})`);
  }

  private killBrowserMouseMove(ev: any): void {
    (window as any).onmousemove = null;
    (window as any).onmouseup = null;
    this.mouseDroppedAt = ev.clientY;
  }

  private produceOutput(amm: number): void {
    const m = this.metrics.output;
    const calculatedDegree = m.scaleUnit * amm;
    if (calculatedDegree > m.upperLimit) {
      return;
    }
    if (calculatedDegree < m.lowerLimit) {
      return;
    }
    const value = Math.round(calculatedDegree * 100);
    this.output = value;
    this.outputCache = value;
  }

  initiateDrag(e: any): void { // todo: use angular renderer2 to attach event listeners!

    (window as any).onmousemove = (ev: any) => {
      const travel = ev.clientY - this.yBottomLimit;
      this.setRotation(travel);
      this.produceOutput(travel);
      this.drawArc(travel);
    };
    (window as any).onmouseup = (ev: any) =>
      this.killBrowserMouseMove(ev)
    ;
  }

  constructor(public oscillatorService: OscillatorService) {}

  private drawArc(travel: number): void {
    const a = this.describeArc(30, 30, 15, 0, travel);
    this.arc.setAttribute('d', a);
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): CoOrds {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  }

  private calculateScaleUnits(): void {
    Object.keys(this.metrics).forEach((m: string) => {
      (this.metrics[m] as KnobMetric).scaleUnit = this.metrics[m].upperLimit / this.inputRange;
    });
  }

  ngAfterViewInit(): void {
    this.yBottomLimit = Math.floor(
      (this.knob as any).getBoundingClientRect().top
    );
    this.yTopLimit =
      Math.floor((this.knob as any).getBoundingClientRect().top) + 100;
    this.calculateScaleUnits();
    this.setRotation(10);

    // this.drawArc(this.startKnob);
  }
}
