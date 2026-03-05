import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { DarkmodeSelector } from "../darkmode-selector/darkmode-selector";
import { RouterLink } from '@angular/router';
import { DividerModule } from "primeng/divider";

@Component({
  selector: 'his-header',
  imports: [ButtonModule, DarkmodeSelector, RouterLink, DividerModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {

}
