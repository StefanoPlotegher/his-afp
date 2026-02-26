import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { HealthStatus, healthStatusMock } from './HealthStatus.model';  

interface APIResponse <T> {
  status: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})

export class SystemStatus {
  #http: HttpClient = inject(HttpClient);
  #statoAPI = signal<HealthStatus>(healthStatusMock);

  statoAPI = this.#statoAPI.asReadonly();

  constructor() {
    this.fetchStatoAPI();
   }

  public fetchStatoAPI(){
    //chiamata http
    this.#http.get<APIResponse<HealthStatus>>("http://localhost:3000/health").subscribe({
      //risposta positiva
      next:(res) => {
        this.#statoAPI.set(res.data);
      },
      //risposta di errore
      error: (err) => {},
    })
  }
}
