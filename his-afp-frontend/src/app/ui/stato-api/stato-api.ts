import { Component, inject } from '@angular/core';
import { SystemStatus } from '../../core/SystemStatus/system-status';
import { Tag } from "primeng/tag";

@Component({
  selector: 'his-stato-api',
  imports: [Tag],
  templateUrl: './stato-api.html',
  styleUrl: './stato-api.scss',
})
export class StatoAPI {

  //inject dell'intero servizio systemStatus in readonly perchè non devo modificare i dati quindi non serve una veriabile locale
  readonly systemStatus = inject(SystemStatus);
  //inject dello stato API (componente core) in una variabile locale
  healthStatus = inject(SystemStatus).statoAPI;
}
