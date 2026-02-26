import { Component, computed, inject, model, signal } from '@angular/core';
import { CardPz } from '../card-pz/card-pz';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { HttpClient } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { SystemStatus } from '../core/SystemStatus/system-status';
import { HealthStatus } from '../core/SystemStatus/HealthStatus.model';
import { StatoAPI } from "../ui/stato-api/stato-api";
import { Paziente } from '../core/PatientManager/Pazienti.model';
import { PatientManager } from '../core/PatientManager/patient-manager';



@Component({
  selector: 'his-lista-pz',
  imports: [CardPz, InputTextModule, FormsModule, Button, TagModule, StatoAPI],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
})
export class ListaPz {

  nomePaziente = model<string>('');

  readonly PatientManager = inject(PatientManager)
  listaPz = this.PatientManager.listaPZ;

  healthStatus = inject(SystemStatus).statoAPI;

  editNomePaziente(nomePZ: string){
    this.nomePaziente.set(nomePZ);
  }
  // come filtrare le liste
  //filtraggio per nome (filtrade in base se la stringa nel'input è presente  nel nome del Paziente)
  filteredList = computed(() => {
    return this.listaPz().filter((pz: Paziente) => pz.nome.toLowerCase().includes(this.nomePaziente().toLowerCase()))
  });


  readonly #http = inject(HttpClient);
  

}
