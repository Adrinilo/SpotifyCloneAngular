import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css',
})
export class CallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  async ngOnInit() {
    const token = this.authService.getAccessToken();
    if (token) {
      // Almacenar el token de acceso de manera segura
      localStorage.setItem('spotify_access_token', token);
      // Obtener y almacenar el id del usuario actual
      const userid = await this.spotifyService.getUserId();
      localStorage.setItem('user_id', userid);
      // Redirigir al usuario a la página principal tras loguearse
      window.location.href = '/home';
    } else {
      console.error('Error al obtener el token de acceso');
      // Se ha realizado la llamada sin token, por tanto puede no ser un login
      // Puede haberse escrito a mano la ruta, lo comprobamos
      this.authService.isLoggedIn()
        ? this.router.navigate(['/home']) // Si está logueado redirigimos a home
        : this.router.navigate(['/login']); // Si no está logueado redirigimos a login 
      }
  }
}
