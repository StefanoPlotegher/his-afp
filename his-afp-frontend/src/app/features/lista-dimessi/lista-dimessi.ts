import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabellaDimessi } from "../../pattern/tabella-dimessi/tabella-dimessi";

@Component({
  selector: 'his-lista-dimessi',
  imports: [TabellaDimessi],
  templateUrl: './lista-dimessi.html',
  styleUrl: './lista-dimessi.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaDimessi {

}
