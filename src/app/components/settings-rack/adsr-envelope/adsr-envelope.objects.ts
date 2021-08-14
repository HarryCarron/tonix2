
/**
 * Holds the translated pixel location of each ADSR value.
 * ? Note: Sustain required both an X and Y value.
 */

export type Points = number[];

export class PointsHelper {

  private attack = 0;
  private decay = 0;
  private sustain = 0;
  private sustainWidth = 0;
  private release = 0;

  private get allIterable(): Points {
    return [this.attack, this.decay, this.sustain, this.sustainWidth, this.release];
  }

  constructor(points: Points) {
    this.attack = points[0];
    this.decay = points[1];
    this.sustain = points[2];
    this.sustainWidth = points[4];
    this.release = points[5];
  }

  public setPoint(index: number, value: number): void {
    this.allIterable[index] = value;
  }

  public getCumulativePoints(): number[] {
    const requiredValues = this.allIterable.filter((_, i) => i !== 2);
    // return requiredValues.map((v, i, o) => o.slice(i, requiredValues.length))
    return [];
  }

}
