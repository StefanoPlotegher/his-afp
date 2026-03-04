import { Component, signal } from '@angular/core';
import { DarkmodeSelector } from './ui/darkmode-selector/darkmode-selector';
import { ListaPz } from './pattern/lista-pz/lista-pz';

@Component({
  selector: 'his-root',
  imports: [DarkmodeSelector, ListaPz],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('his-afp-frontend');
}
