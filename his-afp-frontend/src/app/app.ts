import { Component, signal } from '@angular/core';
import { DarkmodeSelector } from './darkmode-selector/darkmode-selector';
import { CardPz } from './card-pz/card-pz';

@Component({
  selector: 'his-root',
  imports: [DarkmodeSelector, CardPz],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('his-afp-frontend');
}
