import { Component, inject, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { JsonPipe } from '@angular/common';
import { Paziente } from '../../core/PatientManager/Pazienti.model';
import { Router } from '@angular/router';

@Component({
  selector: 'his-card-pz',
  imports: [CardModule, ButtonModule],
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
})
export class CardPz {

  squareColoring = true;

  readonly #router = inject(Router);
  paziente = input.required<Paziente>();

  //Lo usiamo per navigare (sempre non in mare) verso la modifica del paziente passando l'id come pramatero per l'url (kind of crazy btw)

  public navigateToSchedaPaziente(){
    this.#router.navigate(['/modifica-pz'], {
      queryParams:{
        patientId: this.paziente().id
      }
    })
  }

  //Qui si colore il bordo della card in base al codice colore e viene fuori un arcobaleno (solo se i vari codici sono diversi se no è tinta nita ovviamente)
  setColoreDiStato(){

    if (!this.squareColoring) {
      let border = "border-l-8 ";
      switch (this.paziente().codiceColore){
        case 'ROSSO':
          return border + 'border-red-600';
        case 'ARANCIONE':
          return border + 'border-orange-600';
        case 'AZZURRO':
          return border + 'border-blue-600';
        case 'VERDE':
          return border + 'border-green-600';
        case 'BIANCO':
          return border + 'border-gray-600';
        default:
          return '';
      }
    }else{
      return '';
    }
  }


  getBgColorClass(){
    if (this.squareColoring) {
      let square = "w-8 h-8 rounded-sm border border-gray-300 ";
      switch (this.paziente().codiceColore){
        case 'ROSSO':
          return square + 'bg-red-500';
        case 'ARANCIONE':
          return square + 'bg-orange-500';
        case 'AZZURRO':
          return square + 'bg-blue-500';
        case 'VERDE':
          return square + 'bg-green-500';
        case 'BIANCO':
          return square + 'bg-gray-500';
        default:
          return '';
      }
    }else{
      return '';
    }
  }
}
