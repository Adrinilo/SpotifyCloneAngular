import { Component, OnInit } from '@angular/core';
import { Track, TrackPlaying } from '../../interfaces/track.interface';
import { SpotifyService } from '../../services/spotify.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-playbacksdk',
  templateUrl: './playbacksdk.component.html',
  styleUrl: './playbacksdk.component.css',
})
export class PlaybacksdkComponent implements OnInit {
  track: TrackPlaying = {} as TrackPlaying;
  deviceId: string = '';
  isPlaying: boolean = false;
  //currentTrack = 'spotify:track:4Ny1rlxyM3Lfo37Q0e7Kaj';

  constructor(
    private spotifyService: SpotifyService,
    private formatService: FormatService,
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
    this.spotifyService.currentTrack$.subscribe((track) => {
      this.track = this.formatService.formatTrackPlaying(track);
    });

    // Suscribirse al observable para recibir actualizaciones
    this.spotifyService.isPlaying$.subscribe((isPlaying) => {
      this.isPlaying = isPlaying;
    });

    //this.checkPlaybackState();
  }
  
  /*checkPlaybackState() {
    this.spotifyService.getPlaybackState().then((data) => {
      const state: any = data;
      console.log(data);
      
      if(state.is_playing) {
        this.isPlaying = true;
        this.track = this.formatService.formatTrackItem(state.item);
      }
    });
  }*/

  togglePlay() {
    this.isPlaying
      ? this.spotifyService.pauseTrack()
      : this.spotifyService.playTrack(this.track.uri);
  }
}
