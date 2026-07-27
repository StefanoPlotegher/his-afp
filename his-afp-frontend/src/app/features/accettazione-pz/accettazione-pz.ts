import { ChangeDetectionStrategy, Component, effect, inject, input, untracked } from '@angular/core';
import { GestioneRisorse } from '../../core/Risorse/gestione-risorse';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message'
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FieldsetModule } from 'primeng/fieldset';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { PatientAdmission, PazienteDTO } from '../../core/Pazienti/Pazienti.model';
import { AsyncCFCheck } from '../../core/Pazienti/asyncCFCheck';
import { APIResponse } from '../../core/models/Response.model';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'his-accettazione-pz',
  imports: [InputText, ReactiveFormsModule, Button, Message, DatePickerModule, SelectModule, TextareaModule, FieldsetModule],
  templateUrl: './accettazione-pz.html',
  styleUrl: './accettazione-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  gestioneRisorse = inject(GestioneRisorse);
  patientId = input<string>();
  existing = input<string>();
  patientManager = inject(PatientManager);
  readonly #route = inject(ActivatedRoute);

  patientReq = httpResource<APIResponse<PazienteDTO>>(() => `/api/admissions/${this.patientId()}`, {
    debugName: 'PatientInfo',
  })

  constructor(){
    effect(() =>{
      if (this.patientId() === undefined && this.existing() === 'true'){
        console.warn("PatientID is undefined, this is probably not what you want dumbass");
      }

      const queryParams = this.#route.snapshot.queryParamMap;
      const nome = queryParams.get('nome');
      const cognome = queryParams.get('cognome');
      const dataNascita = queryParams.get('dataNascita');
      const codiceFiscale = queryParams.get('codiceFiscale');

      const hasCfSearch = Boolean(codiceFiscale && !nome && !cognome && !dataNascita);
      const hasAdvancedSearch = Boolean(nome && cognome && dataNascita && !codiceFiscale);
      const hasSearchPrefill = hasCfSearch || hasAdvancedSearch;
      const hasExistingPatient = this.existing() === 'true' && this.patientId() !== undefined && this.patientReq.hasValue();

      if (hasExistingPatient) {
        const data = this.patientReq.value()!.data;
        untracked(() => {
          this.paziente.patchValue({
            anagrafica: {
              nome: data.nome,
              cognome: data.cognome,
              dataNascita: new Date(data.dataNascita),
              sesso: data.sex,
              codiceFiscale: data.codiceFiscale,
            },
            sanitaria: {
              patologia: data.patologiaCode,
              modArrivo: data.modalitaArrivoCode,
              noteTriage: data.noteTriage,
              codiceColore: data.coloreCode,
            },
            residenza: {
              via: data.indirizzoVia,
              civico: data.indirizzoCivico,
              comune: data.comune,
              provincia: data.provincia,
            },
          });
        });
        this.paziente.get('anagrafica')?.disable();
        return;
      }

      if (hasSearchPrefill && !hasExistingPatient) {
        untracked(() => {
          this.paziente.patchValue({
            anagrafica: {
              nome: nome ?? '',
              cognome: cognome ?? '',
              dataNascita: dataNascita ? new Date(dataNascita) : '',
              codiceFiscale: codiceFiscale ?? '',
            },
          });
          this.paziente.get('residenza.via')?.clearValidators();
          this.paziente.get('residenza.civico')?.clearValidators();
          this.paziente.get('residenza.comune')?.clearValidators();
          this.paziente.get('residenza.provincia')?.clearValidators();
          this.paziente.get('residenza')?.updateValueAndValidity();
        });
      }
    });
  }


  readonly maxDate = new Date();
  readonly sexOption = [
    {
      code: 'M',
      desc: 'Maschio',
    },
    {
      code: 'F',
      desc: 'Femmina',      
    }
  ]
  readonly #fb = inject(FormBuilder);

  paziente = this.#fb.group({
    anagrafica: this.#fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required]],
      dataNascita: ['' as string | Date, [Validators.required]],
      codiceFiscale: ['', [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')],
        [AsyncCFCheck.check(this.patientManager)]],
      sesso: ['', [Validators.required]],
    }),
    sanitaria: this.#fb.group({
      patologia: ['', [Validators.required]],
      codiceColore: ['', [Validators.required]],
      modArrivo: ['', [Validators.required]],
      noteTriage: ['', [Validators.required, Validators.maxLength(500)]],
    }),
    residenza: this.#fb.group({
      via: ['', [Validators.required]],
      civico: ['', [Validators.required]],
      comune: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
    })
  });

  checkFormControl(control: string) {
    const fc = this.paziente.get(control);
    // nome.invalid && (nome.touched || nome.dirty)
    return fc?.invalid && (fc.touched || fc.dirty);
  }

  checkFormControlError(control: string, err: string) {
    const fc = this.paziente.get(control);

    if (fc && fc.hasError(err)) {
      return fc.getError(err);
    } else {
      return null;
    }
  }

  onSubmit() {
      console.log(this.paziente.valid);

    if (this.paziente.valid) {
      console.log(this.paziente.getRawValue());
      this.patientManager.admitPatient(
        this.paziente.getRawValue() as PatientAdmission
      );
    } else {
      this.paziente.markAllAsTouched();
    }
  }
}
