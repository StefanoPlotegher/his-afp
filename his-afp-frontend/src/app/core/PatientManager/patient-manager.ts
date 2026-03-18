import { inject, Injectable, signal } from '@angular/core';
import { Paziente, PazienteDTO } from './Pazienti.model';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/Response.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PatientManager {
  #http = inject(HttpClient);
  #listaPZ = signal<Paziente[]>([]);
  #listaPzFiltered = signal<Paziente[]>(this.#listaPZ());
  listaPZ = this.#listaPzFiltered.asReadonly();

  timerID = signal(-1);
  //constructor(){
  //  this.fetchPazienti();
  //}

  /**
   * creazione timer di n secondi per il refresh
   */

  public refreshPazienti(){
    if (this.timerID() >= 0){return;}
    let id = setInterval(() => this.fetchPazienti(), 3000);
    this.timerID.set(id);
  }

  public stopRefreshPazienti(){
    clearInterval(this.timerID());
    this.timerID.set(-1);
  }


  //fetch dei pazienti http
  public fetchPazienti(){
    this.#http.get<APIResponse<PazienteDTO[]>>(`${environment.apiUrl}/admissions`).subscribe({
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

  //mapping da DTO a Paziente
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


  //calcolo dell'età partendo dalla data
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


  //filtro per nome o cognome
  public filterByName(name: string){
    //filtro per nome della lista pazienti
    const filtered = this.#listaPZ().filter((p) => {
      const fullName = `${p.nome} ${p.cognome}`;
      return fullName.toLowerCase().includes(name.toLowerCase())});

    this.#listaPzFiltered.set(filtered);
  }
}
