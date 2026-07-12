import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Role, Staff } from '../../core/Staff/Staff.model';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StaffManager } from '../../core/Staff/staff-manager';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'his-card-staff',
  imports: [CardModule, SelectModule, ToggleSwitchModule, FormsModule, ButtonModule],
  templateUrl: './card-staff.html',
  styleUrl: './card-staff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStaff {
  staff = input.required<Staff>();
  editMode = input(false);
  edit = output<number>();
  close = output<void>();

  staffManager = inject(StaffManager);

  roleOptions = [
    { code: 'DOC', desc: 'Medico' },
    { code: 'INF', desc: 'Infermiere' },
    { code: 'AMM', desc: 'Amministrativo' },
  ];

  selectedRole = signal<Role>('');
  isActive = signal(false);

  startEdit() {
    const s = this.staff();
    this.selectedRole.set(s.role);
    this.isActive.set(s.isActive);
    this.edit.emit(s.id);
  }

  save() {
    const s = this.staff();
    if (this.selectedRole() !== s.role) {
      this.staffManager.changeStaffRole(s.id, this.selectedRole());
    }
    if (this.isActive() !== s.isActive) {
      this.staffManager.changeStaffStatus(s.id);
    }
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }
}
