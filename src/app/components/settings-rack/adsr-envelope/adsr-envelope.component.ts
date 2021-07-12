import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-adsr-envelope',
  templateUrl: './adsr-envelope.component.html',
  styleUrls: ['./adsr-envelope.component.css']
})
export class AdsrEnvelopeComponent implements OnInit, AfterViewInit {

  constructor() { }

  private envelopeContainer: any;
  private svgContainer: any;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.svgContainer.style.width =  this.envelopeContainer.offsetWidth;
    this.svgContainer.style.height =  this.envelopeContainer.offsetHeight;
  }

  @ViewChild('envelopeContainer') set envelopeContainerElem(e: any) {
    this.envelopeContainer = e.nativeElement;
  }

  @ViewChild('svgContainer') set svgContainerElem(e: any) {
    this.svgContainer = e.nativeElement;
  }

}
