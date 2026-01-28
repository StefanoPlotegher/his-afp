import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'his-card-pz',
  imports: [CardModule, ButtonModule],
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
})
export class CardPz {
  nome: string = 'pietro';
  paziente = signal('');

  cambiaNome(){
    this.nome = "Gian";

    this.paziente.set("Lucio");
  }
}
