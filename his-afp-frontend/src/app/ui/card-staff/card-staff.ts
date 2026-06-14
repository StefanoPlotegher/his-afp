import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Staff } from '../../core/Staff/Staff.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { StaffManager } from '../../core/Staff/staff-manager';

@Component({
  selector: 'his-card-staff',
  imports: [CardModule, ButtonModule],
  templateUrl: './card-staff.html',
  styleUrl: './card-staff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStaff {

  staff = input.required<Staff>();
  readonly StaffManager = inject(StaffManager);
}
