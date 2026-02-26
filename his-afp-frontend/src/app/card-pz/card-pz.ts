import { Component, input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { JsonPipe } from '@angular/common';
import { Paziente } from '../core/PatientManager/Pazienti.model';

@Component({
  selector: 'his-card-pz',
  imports: [CardModule, ButtonModule],
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
})
export class CardPz {

  paziente = input.required<Paziente>();

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
