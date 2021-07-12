import { Component, Input, OnInit } from '@angular/core';

enum settingsRackMenuItem {
  overview,
  envelope,
  partials
}


@Component({
  selector: 'app-settings-rack',
  templateUrl: './settings-rack.component.html',
  styleUrls: ['./settings-rack.component.css']
})
export class SettingsRackComponent {

  constructor() { }

  @Input() data: any;

  selectedMenuItem = 1;

  menu = [
      {
          label: 'Overview',
          id: settingsRackMenuItem.overview
      },
      {
        label: 'Envelope',
        id: settingsRackMenuItem.envelope
    },
    {
        label: 'Partials',
        id: settingsRackMenuItem.partials
    },
  ];

  get overviewSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.overview;
  }

  get envelopeSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.envelope;
  }

  get partialsSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.partials;
  }

  selectMenuItem(menuItem: settingsRackMenuItem): void {
    this.selectedMenuItem = menuItem;
  }

}
