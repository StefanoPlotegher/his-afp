import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { DarkmodeSelector } from "../darkmode-selector/darkmode-selector";
import { RouterLink } from '@angular/router';
import { DividerModule } from "primeng/divider";
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'his-header',
  imports: [ButtonModule, DarkmodeSelector, RouterLink, DividerModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  
  //ci passiamo le variabli dell'evironment così è tutto più bello
  reparto = environment.reparto;
  struttura = environment.struttura;
}
