import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OscillatorComponent } from './components/oscillator/oscillator.component';
import { KnobComponent } from './components/knob/knob.component';
import { LedComponent } from './components/led/led.component';
import { SettingsRackComponent } from './components/settings-rack/settings-rack.component';
import { AdsrEnvelopeComponent } from './components/settings-rack/adsr-envelope/adsr-envelope.component';

@NgModule({
  declarations: [
    AppComponent,
    OscillatorComponent,
    KnobComponent,
    LedComponent,
    SettingsRackComponent,
    AdsrEnvelopeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
