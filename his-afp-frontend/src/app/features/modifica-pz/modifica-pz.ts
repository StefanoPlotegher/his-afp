import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, input, untracked } from '@angular/core';
import { PatientAdmission, PazienteDTO } from '../../core/Pazienti/Pazienti.model';
import { APIResponse } from '../../core/models/Response.model';
import { Button } from "primeng/button";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GestioneRisorse } from '../../core/Risorse/gestione-risorse';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { formatDate } from '@angular/common';
import { PatientManager } from '../../core/Pazienti/patient-manager';

@Component({
  selector: 'his-modifica-pz',
  imports: [InputText, ReactiveFormsModule, Button, Message, DatePickerModule, SelectModule, TextareaModule, FieldsetModule],
  templateUrl: './modifica-pz.html',
  styleUrl: './modifica-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaPz {
  gestioneRisorse = inject(GestioneRisorse);
  //Dobbiamo dirgli di accettare (nel senso di accogliere non di usare un'accetta) il valore dell'id del paziente
  patientId = input<string>();
  patientInfo = input.required<APIResponse<PazienteDTO>>();
  patientManager = inject(PatientManager);

  patientReq = httpResource<APIResponse<PazienteDTO>>(() => `http://localhost:3000/admissions/${this.patientId()}`)

  constructor(){
    effect(() =>{
      if (this.patientId() === undefined){
        console.warn("PatientID is undefined, this is probably not what you want dumbass");
      }

      const data = this.patientInfo().data;
      if (this.patientReq.hasValue()){
         untracked(() => {
          this.paziente.patchValue({
            anagrafica: {
              nome: data.nome,
              cognome: data.cognome,
              dataNascita: formatDate(data.dataNascita, 'dd/MM/yyyy', 'en'),
              sesso: data.sex,
              codiceFiscale: data.codiceFiscale,
            },
            sanitaria: {
              patologia: data.patologiaCode,
              modArrivo: data.modalitaArrivoCode,
              noteTriage: data.noteTriage,
              codiceColore: data.coloreCode,
            },
            residenza:{
                via: data.indirizzoVia,
                civico: data.indirizzoCivico,
                comune: data.comune,
                provincia: data.provincia,
            }
          });

          this.paziente.get('anagrafica')?.disable();
          this.paziente.get('sanitaria')?.disable();
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
      dataNascita: ['', [Validators.required]],
      codiceFiscale: ['', [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')]],
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
      if (this.paziente.valid) {
        console.log(this.paziente.value);
        this.patientManager.updatePatientInfo(Number(this.patientId()) || -1, this.paziente.value.residenza as Pick<PatientAdmission,'residenza'>);
      } else {
        this.paziente.markAllAsTouched();
      }
    }
}
