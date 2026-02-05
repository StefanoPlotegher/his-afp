import { Component, computed, signal } from '@angular/core';
import { CardPz, Paziente } from '../card-pz/card-pz';

@Component({
  selector: 'his-lista-pz',
  imports: [CardPz],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
})
export class ListaPz {
  listaPz = signal<Paziente[]>([
    {id: '23',
    nome: 'Stefano',
    cognome: 'Plotegher',
    braccialetto: '123',
    eta: 20,
    codiceColore: 'VERDE',
    note: 'Trauma',
    patologia: 'C19'},
    {id: '22',
    nome: 'Arkadiusz',
    cognome: 'Milik',
    braccialetto: '124',
    eta: 31,
    codiceColore: 'ROSSO',
    note: 'Tutte la patoologie',
    patologia: 'C19'},
    {id: '21',
    nome: 'Anna',
    cognome: 'Frank',
    braccialetto: '145',
    eta: 97,
    codiceColore: 'ROSSO',
    note: 'Cenere',
    patologia: 'C19'},
    {id: '20',
    nome: 'Diego',
    cognome: 'Maradona',
    braccialetto: '168',
    eta: 97,
    codiceColore: 'BIANCO',
    note: 'Napoli',
    patologia: 'C19'}
  ]);


  // come filtrare le liste
  filteredList = computed(() => {
    return this.listaPz().filter(p => p.codiceColore === 'ROSSO')})

}
