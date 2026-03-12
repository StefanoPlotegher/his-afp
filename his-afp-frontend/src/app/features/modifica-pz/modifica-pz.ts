import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { PazienteDTO } from '../../core/PatientManager/Pazienti.model';
import { APIResponse } from '../../core/models/Response.model';
import { JsonPipe } from '@angular/common';
import { Button } from "primeng/button";

@Component({
  selector: 'his-modifica-pz',
  imports: [JsonPipe, Button],
  templateUrl: './modifica-pz.html',
  styleUrl: './modifica-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaPz {
  //Dobbiamo irgli di accettare (nel senso di accogliere non di usare un'accetta) il valore dell'id del paziente
  patientId = input<string>();

  patient = httpResource<APIResponse<PazienteDTO[]>>(() => `http://localhost:3000/admissions/${this.patientId()}`)

  constructor(){
    effect(() =>{
      if (this.patientId() === undefined){
        console.warn("PatientID is undefined, this is probably not what you want");
      }
    })
  }
}
