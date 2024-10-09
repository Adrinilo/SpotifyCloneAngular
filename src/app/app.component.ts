import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'platinas';
  onLogin = false; // Controla la visibilidad del navbar

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { // NavigationEnd indica que la navegación ha llegado a su fin
        this.onLogin = event.url === '/login';
      }
    });
  }
}
