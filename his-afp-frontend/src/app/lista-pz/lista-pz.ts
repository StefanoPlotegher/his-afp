import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { CardPz } from '../card-pz/card-pz';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { TagModule } from 'primeng/tag';
import { SystemStatus } from '../core/SystemStatus/system-status';
import { StatoAPI } from "../ui/stato-api/stato-api";
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

  constructor(){
    effect(() => {
      this.PatientManager.filterByName(this.nomePaziente());
    });
  }

  editNomePaziente(nomePZ: string){
    this.nomePaziente.set(nomePZ);
    this.PatientManager.filterByName(this.nomePaziente());
  }
  

}
