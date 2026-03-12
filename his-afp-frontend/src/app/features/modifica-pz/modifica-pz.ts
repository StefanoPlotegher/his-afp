import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';

@Component({
  selector: 'his-modifica-pz',
  imports: [],
  templateUrl: './modifica-pz.html',
  styleUrl: './modifica-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaPz {
  //Dobbiamo irgli di accettare (nel senso di accogliere non di usare un'accetta) il valore dell'id del paziente
  patientId = input<string>();

  constructor(){
    effect(() =>{
      if (this.patientId() === undefined){
        console.warn("PatientID is undefined, this is probably not what you want");
      }
    })
  }
}
