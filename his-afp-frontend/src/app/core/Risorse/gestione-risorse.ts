import { inject, Injectable, signal } from '@angular/core';
import { ArrivalMode, Pathology, TriageColor } from './risorse.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../models/Response.model';

@Injectable({
  providedIn: 'root',
})
export class GestioneRisorse {
  readonly #triageColor = signal<TriageColor[]>([]);
  triageColors = this.#triageColor.asReadonly();
  readonly #pathologies = signal<Pathology[]>([]);
  pathology = this.#pathologies.asReadonly();
  readonly #arrivalModes = signal<ArrivalMode[]>([]);
  arrivalModes = this.#arrivalModes.asReadonly();
  readonly #http = inject(HttpClient);


  public fetchRisorse(){
    this.fetchArrivalModes();
    this.fetchTriageColors();
    this.fetchPathology();
}

  private fetchTriageColors(){
    this.#http.get<APIResponse<TriageColor[]>>(`/api/resources/triage-colors`).subscribe({
      next: (res)=>{
        this.#triageColor.set(res.data);
      },
      error: (err) => {
        console.error(err);
        
      },
      
    });

  };
  private fetchPathology(){
    this.#http.get<APIResponse<Pathology[]>>(`/api/resources/pathologies`).subscribe({
      next: (res)=>{
        this.#pathologies.set(res.data);
      },
      error: (err) => {
        console.error(err);
        
      },
      
    });};
  private fetchArrivalModes(){
    this.#http.get<APIResponse<ArrivalMode[]>>(`/api/resources/arrival-modes`).subscribe({
      next: (res)=>{
        this.#arrivalModes.set(res.data);
      },
      error: (err) => {
        console.error(err);
        
      },
      
    });};
}
