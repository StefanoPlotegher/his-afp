import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Staff } from './Staff.model';
import { APIResponse } from '../models/Response.model';

@Injectable({
  providedIn: 'root',
})
export class StaffManager {
  #http = inject(HttpClient);
  #staff = signal<Staff[]>([]);
  staff = this.#staff.asReadonly();


  public fetchStaff(){
    this.#http.get<APIResponse<Staff[]>>("/api/users").subscribe({
      next: (res) => {
        this.#staff.set(res.data);
      },
      error: (err) => {
        console.error('Errore nel recupero dello staff:', err);
      }
    })
  }
}
