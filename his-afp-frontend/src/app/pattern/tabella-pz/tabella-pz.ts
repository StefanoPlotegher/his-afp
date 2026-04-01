import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from "primeng/button";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CardPz } from '../../ui/card-pz/card-pz';

@Component({
  selector: 'his-tabella-pz',
  imports: [FormsModule, InputTextModule, Button, ToggleSwitchModule, CardPz],
  templateUrl: './tabella-pz.html',
  styleUrl: './tabella-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabellaPz {
  readonly PatientManager = inject(PatientManager)
  nomePaziente = model<string>('');
  enableRefreshPz= model<boolean>(false);

  constructor(){
    effect(() => {
      this.PatientManager.filterByName(this.nomePaziente());

      if(this.enableRefreshPz()){
        this.PatientManager.refreshPazienti();
      }else{
        this.PatientManager.stopRefreshPazienti();
      }
    });
  }
}
