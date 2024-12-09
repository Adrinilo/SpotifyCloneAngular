import { Component, OnInit } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { SpotifyService } from '../../services/spotify.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playbacksdk',
  templateUrl: './playbacksdk.component.html',
  styleUrl: './playbacksdk.component.css',
})
export class PlaybacksdkComponent implements OnInit {
  track: Track = {} as Track;
  deviceId: string = '';
  //currentTrack = 'spotify:track:4Ny1rlxyM3Lfo37Q0e7Kaj';

  constructor(
    private spotifyService: SpotifyService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener la URL actual
    const currentRoute = this.router.url;

    // Verificar si se debe ejecutar la acción, controlando error en login
    if (!currentRoute.includes('login')) {
      this.spotifyService.initializePlayer(); // Inicializa el reproductor 
    }

    // Suscribirse al observable para recibir actualizaciones
    this.dataService.currentTrack$.subscribe((track) => {
      this.track = track;
      this.track && this.playTrack();
    });
  }

  playTrack(): void {
    const trackUri = this.track.uri;
    this.spotifyService.playTrack(trackUri);
  }

  /*pause(): void {
    this.spotifyService.pause();
  }

  resume(): void {
    this.spotifyService.resume();
  }

  setVolume(volume: number): void {
    this.spotifyService.setVolume(volume);
  }*/
}
