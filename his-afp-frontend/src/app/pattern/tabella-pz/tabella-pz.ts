import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { PatientManager } from '../../core/PatientManager/patient-manager';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardPz } from "../../ui/card-pz/card-pz";
import { Button } from "primeng/button";

@Component({
  selector: 'his-tabella-pz',
  imports: [FormsModule, InputTextModule, CardPz, Button],
  templateUrl: './tabella-pz.html',
  styleUrl: './tabella-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabellaPz {
  readonly PatientManager = inject(PatientManager)
  nomePaziente = model<string>('');

  constructor(){
    effect(() => {
      this.PatientManager.filterByName(this.nomePaziente());
    });
  }
}
