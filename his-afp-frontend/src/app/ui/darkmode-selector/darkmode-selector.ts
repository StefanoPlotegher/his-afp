import { Component, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'his-darkmode-selector',
  imports: [ButtonModule],
  templateUrl: './darkmode-selector.html',
  styleUrl: './darkmode-selector.scss',
})
export class DarkmodeSelector implements OnInit {

  isDarkMode = false;

  //eseguito all'avvio
  ngOnInit() {
    //  Carico (non con il caricabatterie) la preferenza sul tema della pagina e lo eseguo (tipo com si eseguivano gli ordini nel '45)
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      this.isDarkMode = true;
      document.querySelector('html')?.classList.add('my-app-dark');
    }
  }

  //eseguito con il bottone
  toggleDarkMode(){
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
    this.isDarkMode = !this.isDarkMode;
    // Save preference to local storage
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
  }
}
