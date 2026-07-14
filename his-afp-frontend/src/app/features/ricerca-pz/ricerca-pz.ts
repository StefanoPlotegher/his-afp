import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'his-ricerca-pz',
  imports: [InputText, ReactiveFormsModule, Button, Message, DatePickerModule, FieldsetModule],
  templateUrl: './ricerca-pz.html',
  styleUrl: './ricerca-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RicercaPz {
  readonly #fb = inject(FormBuilder);

  ricerca = this.#fb.control({
    cf: ['', [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')]]
  });

  checkFormControl(control: string) {
    const fc = this.ricerca.get(control);
    return fc?.invalid && (fc.touched || fc.dirty);
  }

  checkFormControlError(control: string, err: string) {
    const fc = this.ricerca.get(control);
    if (fc && fc.hasError(err)) {
      return fc.getError(err);
    }
    return null;
  }

  resetForm() {
    this.ricerca.reset();
  }

  onSubmit() {
    if (this.ricerca.valid) {
      console.log(this.ricerca.value);
    } else {
      this.ricerca.markAllAsTouched();
    }
  }
}
