import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HealthStatus, healthStatusMock } from './HealthStatus.model';

@Injectable({
  providedIn: 'root',
})
export class SystemStatus {
  #http = inject(HttpClient);
  #statoAPI = signal<HealthStatus>(healthStatusMock);

  statoAPI = this.#statoAPI.asReadonly();
}
