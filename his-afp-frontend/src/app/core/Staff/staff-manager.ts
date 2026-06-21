import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Staff, UsernameCheckResponse } from './Staff.model';
import { APIResponse } from '../models/Response.model';
import { StaffAdd } from './Staff.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StaffManager {
  #http = inject(HttpClient);
  #staff = signal<Staff[]>([]);
  staff = this.#staff.asReadonly();
  #router = inject(Router);


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

  public changeStaffStatus(staffId: number){
    if (this.#staff().find(s => s.id === staffId)?.isActive) {
      this.#http.patch(`/api/users/${staffId}/deactivate`, { id: staffId }).subscribe({
        next: (res) => {
          this.#staff.update((staff) => {
            return staff.map((s) => s.id === staffId ? { ...s, isActive: !s.isActive } : s);
          });
        },
        error: (err) => {
          console.error('Errore nella modifica dello stato dello staff:', err);
        }
      });
    }else{
      this.#http.patch(`/api/users/${staffId}/activate`, { id: staffId }).subscribe({
        next: (res) => {
          this.#staff.update((staff) => {
            return staff.map((s) => s.id === staffId ? { ...s, isActive: !s.isActive } : s);
          });
        },
        error: (err) => {
          console.error('Errore nella modifica dello stato dello staff:', err);
        }
      });
    }
  }


  public addStaff(staff: StaffAdd){
    this.#http.post("/api/users", staff).subscribe({
      next: (res) => {
        this.#router.navigate([`/staff`]);
      },
      error: (err) => {
        console.error('Errore nell\'aggiunta dello staff:', err);
      }
    });
  }

    public ricercaStaff(st: string){
      return this.#http.get<APIResponse<UsernameCheckResponse>>(`api/users/check/${st}`);
    }
}
