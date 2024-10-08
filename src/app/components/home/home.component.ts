import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  user: any;

  constructor(private spotifyService: SpotifyService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      this.spotifyService.getUserProfile().then(data => {
        this.user = data;
      }).catch(error => {
        console.error('Error fetching profile:', error);
      });
    }
    this.authService.isLoggedIn()
    ? '' // Si está logueado no hacemos nada
    : this.router.navigate(['/login']); // Si no está logueado redirigimos a login 
  }

  logout() {
    this.authService.logout();
  }
}
