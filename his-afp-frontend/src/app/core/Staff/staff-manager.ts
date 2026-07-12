import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Role, Staff, UsernameCheckResponse } from './Staff.model';
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
  #orderedStaff = signal<Staff[]>([]);
  orderedStaff = this.#orderedStaff.asReadonly();


  public fetchStaff(){
    this.#http.get<APIResponse<Staff[]>>("/api/users").subscribe({
      next: (res) => {
        this.#staff.set(res.data);
        this.orderStaff();
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
          this.orderStaff();
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
          this.orderStaff();
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

  public changeStaffRole(staffId: number, newRole: Role){
    this.#http.patch(`/api/users/${staffId}/editRole`, { role: newRole }).subscribe({
      next: (res) => {
        this.#staff.update((staff) => {
          return staff.map((s) => s.id === staffId ? { ...s, role: newRole } : s);
        });
        this.orderStaff();
      },
      error: (err) => {
        console.error('Errore nella modifica del ruolo dello staff:', err);
      }
    });
  }

  public orderStaff(){
    const staff = [...this.#staff()];
    const getName = (s: Staff) => (s as any).name ?? (s as any).username ?? (s as any).email ?? '';

    staff.sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;

      const roleA = String(a.role ?? '').toLowerCase();
      const roleB = String(b.role ?? '').toLowerCase();
      if (roleA !== roleB) return roleA < roleB ? -1 : 1;

      const nameA = getName(a).toLowerCase();
      const nameB = getName(b).toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    this.#orderedStaff.set(staff);
  }
}
