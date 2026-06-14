import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StaffManager } from '../../core/Staff/staff-manager';
import { CardStaff } from '../../ui/card-staff/card-staff';

@Component({
  selector: 'his-tabella-staff',
  imports: [CardStaff],
  templateUrl: './tabella-staff.html',
  styleUrl: './tabella-staff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabellaStaff {
  readonly StaffManager = inject(StaffManager);

  constructor() {
    this.StaffManager.fetchStaff();
  }
}
