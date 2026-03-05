import { Routes } from '@angular/router';
import { ListaPz } from './features/lista-pz/lista-pz';
import { AccettazionePz } from './features/accettazione-pz/accettazione-pz';
import { ModificaPz } from './features/modifica-pz/modifica-pz';
import { StatoServizi } from './features/stato-servizi/stato-servizi';

export const routes: Routes = [
    {
        path: 'lista-pz',
        loadComponent: () => import('./features/lista-pz/lista-pz').then(m => m.ListaPz)
    },
    {
        path: 'accettazione-pz',
        loadComponent: () => import('./features/accettazione-pz/accettazione-pz').then(m => m.AccettazionePz)
    },
    {
        path: 'modifica-pz',
        //component: ModificaPz
        //sta roba qui sotto fa il lazy loading del componente, letteralmente lazy perché carica il componente solo quando si accede alla rotta non prima (ceh stra pigro in poche parole, low key gasa parecchio)
        loadComponent: () => import('./features/modifica-pz/modifica-pz').then(m => m.ModificaPz)
    },
    {
        path: 'modifica-pz:patientId',
        loadComponent: () => import('./features/modifica-pz/modifica-pz').then(m => m.ModificaPz)
    },
    {
        path: 'stato-servizi',
        loadComponent: () => import('./features/stato-servizi/stato-servizi').then(m => m.StatoServizi)
    },
    {
        path: '',
        redirectTo: 'lista-pz',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'lista-pz',
        pathMatch: 'full'
    },
];