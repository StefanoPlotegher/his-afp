import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'his-tabella-dimessi',
  imports: [TableModule, DatePipe, ButtonModule, ToggleSwitchModule, FormsModule],
  templateUrl: './tabella-dimessi.html',
  styleUrl: './tabella-dimessi.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabellaDimessi {
  readonly PatientManager = inject(PatientManager)
  enableRefresh = model<boolean>(true);

  constructor(){
    effect(() => {

      if(this.enableRefresh()){
        this.PatientManager.refreshDimessi();
      }else{
        this.PatientManager.stopRefreshDim();
      }
    });
  }
}
