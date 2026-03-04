import { Component, signal } from '@angular/core';
import { Button } from "primeng/button";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'his-root',
  imports: [Button, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('his-afp-frontend');
}
