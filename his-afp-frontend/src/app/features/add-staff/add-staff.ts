import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message'
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FieldsetModule } from 'primeng/fieldset';
import { PasswordModule } from 'primeng/password';
import { AsyncUserCheck } from '../../core/Staff/asyncUserCheck';
import { Role, StaffAdd } from '../../core/Staff/Staff.model';
import { StaffManager } from '../../core/Staff/staff-manager';

@Component({
  selector: 'his-addStaff-pz',
  imports: [InputText, ReactiveFormsModule, Button, Message, DatePickerModule, SelectModule, TextareaModule, FieldsetModule, PasswordModule],
  templateUrl: './add-staff.html',
  styleUrl: './add-staff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class addStaff {
  // paziente = new FormGroup({
  //   nome: new FormControl('', [Validators.required]),
  //   cognome: new FormControl('', [Validators.required]),
  // });
  staffManager = inject(StaffManager)
  readonly #fb = inject(FormBuilder);
  readonly roleOptions = [
    {
      code : 'DOC',
      desc: 'Medico'
    },
    {
      code : 'INF',
      desc: 'Infermiere'
    },
    {
      code: 'AMM',
      desc: 'Amministrativo'
    }
  ]

  staff = this.#fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ],
      [AsyncUserCheck.check(this.staffManager)]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        passwordRequirementsValidator()
      ]
    ],
    passwordConfirm: ['', [Validators.required]],
    role: ['', [Validators.required]],
  },
  { validators: passwordsMatchValidator() }
);

  checkFormControl(control: string) {
    const fc = this.staff.get(control);
    // nome.invalid && (nome.touched || nome.dirty)
    return fc?.invalid && (fc.touched || fc.dirty);
  }

  checkFormControlError(control: string, err: string) {
    const fc = this.staff.get(control);

    if (fc && fc.hasError(err)) {
      return fc.getError(err);
    } else {
      return null;
    }
  }

  mapFormToStaffAdd(): StaffAdd {
    return {
      username: this.staff.get('username')?.value ?? '',
      password: this.staff.get('password')?.value ?? '',
      role: this.staff.get('role')?.value as Role ?? ''
    };
  }

  onSubmit() {
    if (this.staff.valid) {
      const staffToAdd = this.mapFormToStaffAdd();
      this.staffManager.addStaff(staffToAdd);
    } else {
      this.staff.markAllAsTouched();
    }
  }
}

export function passwordRequirementsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ?? '';
    const errors: ValidationErrors = {};

    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }
    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = true;
    }
    if (!/\d/.test(value)) {
      errors['number'] = true;
    }
    if (!/[^A-Za-z\d]/.test(value)) {
      errors['special'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}

export function passwordsMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('passwordConfirm')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}
