import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn(); // Llama al servicio para comprobar autenticación

    if (!isLoggedIn) {
      // Redirige al usuario si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
