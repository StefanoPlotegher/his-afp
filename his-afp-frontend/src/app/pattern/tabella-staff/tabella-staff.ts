import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { StaffManager } from '../../core/Staff/staff-manager';
import { CardStaff } from '../../ui/card-staff/card-staff';
import { ButtonModule } from "primeng/button";
import { Router } from '@angular/router';

@Component({
  selector: 'his-tabella-staff',
  imports: [CardStaff, ButtonModule],
  templateUrl: './tabella-staff.html',
  styleUrl: './tabella-staff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabellaStaff {
  readonly #router = inject(Router);
  readonly StaffManager = inject(StaffManager);
  editingStaffId = signal<number | null>(null);

  constructor() {
    this.StaffManager.fetchStaff();
  }

  public newStaff() {
    this.#router.navigate(['/add-staff']);
  }
}
