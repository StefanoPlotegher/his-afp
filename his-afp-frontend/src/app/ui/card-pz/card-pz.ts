import { Component, inject, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { JsonPipe } from '@angular/common';
import { Paziente } from '../../core/Pazienti/Pazienti.model';
import { Router } from '@angular/router';

@Component({
  selector: 'his-card-pz',
  imports: [CardModule, ButtonModule],
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
})
export class CardPz {

  readonly #router = inject(Router);
  paziente = input.required<Paziente>();

  //Lo usiamo per navigare (sempre non in mare) verso la modifica del paziente passando l'id come pramatero per l'url (kind of crazy btw)

  public navigateToSchedaPaziente(){
    this.#router.navigate([`/modifica-pz/${this.paziente().id}`]);
  }

  //Qui si colore il bordo della card in base al codice colore e viene fuori un arcobaleno (solo se i vari codici sono diversi se no è tinta nita ovviamente)
  setColoreDiStato(){
    switch (this.paziente().codiceColore){
      case 'ROSSO':
        return 'border-red-600';
      case 'ARANCIONE':
        return 'border-orange-600';
      case 'AZZURRO':
        return 'border-blue-600';
      case 'VERDE':
        return 'border-green-600';
      case 'BIANCO':
        return 'border-gray-600';
      default:
        return '';
    }
  }
}
