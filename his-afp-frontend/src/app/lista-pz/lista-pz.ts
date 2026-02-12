import { Component, computed, inject, model, signal } from '@angular/core';
import { CardPz, Paziente } from '../card-pz/card-pz';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'his-lista-pz',
  imports: [CardPz, InputTextModule, FormsModule, Button],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
})
export class ListaPz {

  nomePaziente = model<string>('');

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
    codiceColore: 'AZZURRO',
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

  editNomePaziente(nomePZ: string){
    this.nomePaziente.set(nomePZ);
  }
  // come filtrare le liste
  //filtraggio per nome (filtrade in base se la stringa nel'input è presente  nel nome del Paziente)
  filteredList = computed(() => {
    return this.listaPz().filter((pz: Paziente) => pz.nome.toLowerCase().includes(this.nomePaziente().toLowerCase())
    )});


  readonly #http = inject(HttpClient);

  constructor(){
    this.getHealthStatus();
  }
  
  getHealthStatus(){
    this.#http.get('http://localhost:3000/health').subscribe((res) => {
      console.log(res);
    });
  };
}
