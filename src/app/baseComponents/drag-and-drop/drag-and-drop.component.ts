import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit {

  constructor(public renderer: Renderer2) { }

  dragAndDrop$ = new Subject();
  private removeListener: any;

  ngOnInit(): void {
  }

  public onDrag(point: number): void {
    this.removeListener = this.renderer.listen('document', 'mousemove', event =>
      this.dragAndDrop$.next({
        point,
        mouseLocation: {
          x: event.x,
          y: event.y
        }
      })
    );
    this.renderer.listen('document', 'mouseup', _ => this.removeListener());
  }

}
