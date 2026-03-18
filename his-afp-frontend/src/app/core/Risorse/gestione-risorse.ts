import { Injectable, signal } from '@angular/core';
import { ArrivalMode, Pathology, TriageColor } from './risorse.models';

@Injectable({
  providedIn: 'root',
})
export class GestioneRisorse {
  readonly #triageColor = signal<TriageColor[]>([]);
  readonly #pathologies = signal<Pathology[]>([]);
  readonly #arrivalModes = signal<ArrivalMode[]>([]);


  public fetchRisorse(){
    this.fetchArrivalModes();
    this.fetchTriageColors();
    this.fetchPathology();
}

  private fetchTriageColors(){};
  private fetchPathology(){};
  private fetchArrivalModes(){};
}
