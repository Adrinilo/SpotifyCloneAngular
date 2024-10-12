import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { SpotifyService } from '../../services/spotify.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Playlist } from '../../interfaces/playlist.interface';
import { FormatService } from '../../services/format.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.css',
})
export class TracksComponent implements OnInit, AfterViewInit {
  playlist!: Playlist;
  tracks: Track[] = [];
  private scrollTimeout: any;
  @ViewChild('textContent') textContent!: ElementRef;
  private routerSubscription!: Subscription;

  constructor(
    private spotifyService: SpotifyService,
    private formatService: FormatService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const playlistId = params['id'];
      if (playlistId) {
        this.getPlaylist(playlistId);
      } else {
        console.error('ID de playlist no encontrado en la ruta');
      }
    });

    const scrollContainer =
      this.elRef.nativeElement.querySelector('.contenedor-scroll');

    // Agregar el listener de scroll
    this.renderer.listen(scrollContainer, 'scroll', () => {
      this.showScrollbar(scrollContainer);
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Ejecuta el ajuste del tamaño de texto al cambiar de ruta
        setTimeout(() => this.adjustFontSize(), 0);
      }
    });
  }

  getPlaylist(playlistId: string) {
    this.spotifyService
      .getPlaylistsId(playlistId)
      .then((data) => {
        this.playlist = this.formatService.formatPlaylistItem(data);
        this.tracks = this.playlist.tracks;
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
      });
  }

  showScrollbar(container: HTMLElement): void {
    // Consultar componente 'Library' para anotaciones
    this.renderer.addClass(container, 'scrolling');

    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      this.renderer.removeClass(container, 'scrolling');
    }, 1000);
  }

  ngAfterViewInit() {
    // Ajusta el tamaño del texto inicialmente
    this.adjustFontSize();
    
    // Escucha los cambios de ruta
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Ejecuta el ajuste del tamaño de texto al cambiar de ruta
        setTimeout(() => this.adjustFontSize(), 0);
      }
    });
  }

  adjustFontSize() {
    const textElement = this.textContent.nativeElement;
    let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);

    // Mientras el texto esté clamped (ocupando más de 1 línea), reducimos el tamaño de la fuente
    while (this.checkNumberLines(textElement)) {
      fontSize--;
      this.renderer.setStyle(textElement, 'font-size', `${fontSize}px`);
    }
  }

  checkNumberLines(element: HTMLElement): boolean {
    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const height = element.scrollHeight;
    const numberOfLines = Math.round(height / lineHeight);
    return numberOfLines > 1;
  }

  ngOnDestroy() {
     // Limpiar el timeout cuando el componente sea destruido
     if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Asegúrate de limpiar la suscripción cuando el componente se destruya
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
