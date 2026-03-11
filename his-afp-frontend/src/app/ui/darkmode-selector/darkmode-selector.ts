import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'his-darkmode-selector',
  imports: [ButtonModule],
  templateUrl: './darkmode-selector.html',
  styleUrl: './darkmode-selector.scss',
})
export class DarkmodeSelector {

  isDarkMode = signal(false);

  toggleDarkMode(){
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
    this.isDarkMode.update(value => !value);
  }
}
