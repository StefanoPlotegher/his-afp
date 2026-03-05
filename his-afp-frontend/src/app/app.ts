import { Component, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Header } from "./ui/header/header";

@Component({
  selector: 'his-root',
  imports: [ RouterModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('his-afp-frontend');
}
