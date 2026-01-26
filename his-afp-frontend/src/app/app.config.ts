import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura, //tema di default di PrimeNG
        options : {
          ripple: true, //animazione grafica
          darkModeSelector: '.my-app-dark', //selettore per la modalità scura
        }
      }
    }),
  ]
};
