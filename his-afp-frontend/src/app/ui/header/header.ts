import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { DarkmodeSelector } from "../darkmode-selector/darkmode-selector";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'his-header',
  imports: [ButtonModule, DarkmodeSelector, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {

}
