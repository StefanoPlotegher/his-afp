import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: Aura, //tema di default di PrimeNG
        options : {
          ripple: true, //animazione grafica
          darkModeSelector: '.my-app-dark', //selettore per la modalità scura (che non è un modo simpatico per dire che è africana)
        }
      }
    }),
  ]
};
