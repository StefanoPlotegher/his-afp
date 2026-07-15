import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { Anagrafica } from '../../core/Pazienti/Pazienti.model';
import { Router } from '@angular/router';

@Component({
  selector: 'his-ricerca-pz',
  imports: [InputText, ReactiveFormsModule, Button, Message, DatePickerModule, FieldsetModule],
  templateUrl: './ricerca-pz.html',
  styleUrl: './ricerca-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RicercaPz { 
  readonly #fb = inject(FormBuilder);
  searchMode = signal<'cf' | 'advanced'>('cf');
  readonly maxDate = new Date();
  readonly patientManager = inject(PatientManager);
  pz = signal<Anagrafica[]>([]);
  readonly #router = inject(Router);
  submitted = signal(false);

  ricerca = this.#fb.group({
    cf: ['', [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')]],
    nome: [{ value: '', disabled: true }],
    cognome: [{ value: '', disabled: true }],
    dataNascita: [{ value: '', disabled: true }],
  });

  toggleSearchMode() {
    if (this.searchMode() === 'cf') {
      this.searchMode.set('advanced');
      this.ricerca.get('cf')?.disable();
      this.ricerca.get('nome')?.enable();
      this.ricerca.get('cognome')?.enable();
      this.ricerca.get('dataNascita')?.enable();
      this.ricerca.get('nome')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.ricerca.get('cognome')?.setValidators([Validators.required]);
      this.ricerca.get('dataNascita')?.setValidators([Validators.required]);
    } else {
      this.searchMode.set('cf');
      this.ricerca.get('cf')?.enable();
      this.ricerca.get('nome')?.disable();
      this.ricerca.get('cognome')?.disable();
      this.ricerca.get('dataNascita')?.disable();
      this.ricerca.get('nome')?.clearValidators();
      this.ricerca.get('cognome')?.clearValidators();
      this.ricerca.get('dataNascita')?.clearValidators();
    }
    Object.keys(this.ricerca.controls).forEach((key) =>
      this.ricerca.get(key)?.updateValueAndValidity()
    );
  }

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
    if (this.searchMode() === 'advanced') {
      this.searchMode.set('cf');
      this.ricerca.get('cf')?.enable();
      this.ricerca.get('nome')?.disable();
      this.ricerca.get('cognome')?.disable();
      this.ricerca.get('dataNascita')?.disable();
      this.ricerca.get('nome')?.clearValidators();
      this.ricerca.get('cognome')?.clearValidators();
      this.ricerca.get('dataNascita')?.clearValidators();
      Object.keys(this.ricerca.controls).forEach((key) =>
        this.ricerca.get(key)?.updateValueAndValidity()
      );
    }
    this.ricerca.reset();
    this.pz.set([]);
    this.submitted.set(false);
  }

  private toLocalDateTimeString(date?: Date | string | null): string {
  if (!date || typeof date === 'string') return '';
  const anno = date.getFullYear();
  const mese = String(date.getMonth() + 1).padStart(2, '0');
  const giorno = String(date.getDate()).padStart(2, '0'); 

  return `${anno}-${mese}-${giorno}T00:00:00`;
  // es. "2026-07-14T00:00:00"
}

  onSubmit() {
    if (this.ricerca.valid) {
      this.patientManager.ricefcaPaziente(
        this.ricerca.get('cf')?.value,
        this.ricerca.get('nome')?.value,
        this.ricerca.get('cognome')?.value,
        this.toLocalDateTimeString(this.ricerca.get('dataNascita')?.value),
        (pazienti) => {
          this.pz.set(pazienti);
          console.log('Pazienti trovati:', pazienti);
        }
      );
      this.submitted.set(true);
    } else {
      this.ricerca.markAllAsTouched();
    }
  }

  public addNewPatient() {
    this.#router.navigate([`/accettazione-pz`]);
  }
}