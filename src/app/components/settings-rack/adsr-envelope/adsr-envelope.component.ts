import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-adsr-envelope',
  templateUrl: './adsr-envelope.component.html',
  styleUrls: ['./adsr-envelope.component.css']
})
export class AdsrEnvelopeComponent implements OnInit, AfterViewInit {

  constructor() { }

  private envelopeContainer: any;
  private svgContainer: any;

  availableHeight = 0;
  availableWidth = 0;


  readonly PAD = 30;

  secondDurationLabels = [0, 1, 2, 3, 4];

  secondWidth = 0;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(_ => {
      this.availableHeight =  this.envelopeContainer.offsetHeight;
      this.availableWidth =  this.envelopeContainer.offsetWidth;
      this.svgContainer.style.width = this.availableWidth;
      this.svgContainer.style.height = this.availableHeight;

      this.secondWidth = ((this.availableWidth - this.PAD * 2) / 4);
    });

  }

  @ViewChild('envelopeContainer') set envelopeContainerElem(e: any) {
    this.envelopeContainer = e.nativeElement;
  }

  @ViewChild('svgContainer') set svgContainerElem(e: any) {
    this.svgContainer = e.nativeElement;
  }

}
