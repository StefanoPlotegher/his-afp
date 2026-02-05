import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { JsonPipe } from '@angular/common';

export interface Paziente {
  id: string;
  nome: string;
  cognome: string;
  braccialetto: string;
  eta: number;
  codiceColore: string;
  note: string;
  patologia: string;
}

@Component({
  selector: 'his-card-pz',
  imports: [CardModule, ButtonModule],
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
})
export class CardPz {
  nome: string = 'pietro';
  paziente = signal<Paziente>({
    id: '23',
    nome: 'Stefano',
    cognome: 'Plotegher',
    braccialetto: '123',
    eta: 20,
    codiceColore: 'ROSSO',
    note: 'Trauma',
    patologia: 'C19'
  });

  cambiaNome(){
    this.nome = "Gian";

    
  }
}
