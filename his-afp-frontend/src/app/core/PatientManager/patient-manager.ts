import { inject, Injectable, signal } from '@angular/core';
import { Paziente, PazienteDTO } from './Pazienti.model';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/Response.model';

@Injectable({
  providedIn: 'root',
})
export class PatientManager {
  #http = inject(HttpClient);
  #listaPZ = signal<Paziente[]>([]);
  listaPZ = this.#listaPZ.asReadonly();

  constructor(){
    this.fetchPazienti();
  }

  public fetchPazienti(){
    this.#http.get<APIResponse<PazienteDTO>>('http://localhost:3000/admissions').subscribe({
      next: (res) => {
        this.#listaPZ.set(res.data);
      },
      error: (err) => {}
    }
    )
  }
}
