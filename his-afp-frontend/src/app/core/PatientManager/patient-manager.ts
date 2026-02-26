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
    this.#http.get<APIResponse<PazienteDTO[]>>('http://localhost:3000/admissions').subscribe({
      next: (res) => {
        const pz = res.data.map((p) => this.mapPazienteDTOtoPaziente(p));
        this.#listaPZ.set(pz);
      },
      error: (err) => {
        console.error('Errore nel recupero dei pazienti:', err);
      }
    }
    )
  }

    public mapPazienteDTOtoPaziente(pz: PazienteDTO):Paziente{
    return {
      id: pz.id.toString(),
      nome: pz.nome,
      cognome: pz.cognome,
      braccialetto: pz.braccialetto,
      codiceColore: pz.coloreCode,
      note: pz.noteTriage,
      patologia: pz.patologiaCode,
      eta: this.calcolaEta(pz.dataNascita)
    }
  }

  public calcolaEta (dataNascita: string): number {
    const oggi = new Date();
    const nascita = new Date(dataNascita);
    let eta = oggi.getFullYear() - nascita.getFullYear();
    const mese = oggi.getMonth() - nascita.getMonth();
    if (mese < 0 || (mese === 0 && oggi.getDate() < nascita.getDate())) {
      eta--;
    }
    return eta;
  }
}
