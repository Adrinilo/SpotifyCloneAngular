import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { SpotifyService } from '../../services/spotify.service';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '../../interfaces/playlist.interface';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.css',
})
export class TracksComponent implements OnInit, AfterViewInit {
  playlist!: Playlist;
  tracks: Track[] = [];
  private scrollTimeout: any;
  @ViewChild('titleRef') titleElement!: ElementRef;

  constructor(
    private spotifyService: SpotifyService,
    private formatService: FormatService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.suscribeRoute();

    const scrollContainer =
      this.elRef.nativeElement.querySelector('.contenedor-scroll');

    // Agregar el listener de scroll
    this.renderer.listen(scrollContainer, 'scroll', () => {
      this.showScrollbar(scrollContainer);
    });
  }

  ngAfterViewInit() {
    this.suscribeRoute();
  }

  suscribeRoute() {
    this.route.params.subscribe((params) => {
      const playlistId = params['id'];
      if (playlistId) {
        this.getPlaylist(playlistId);
      } else {
        console.error('ID de playlist no encontrado en la ruta');
      }
      // Aseguramos que Angular detecte los cambios
      this.cdRef.detectChanges();
    });
  }

  getPlaylist(playlistId: string) {
    this.spotifyService
      .getPlaylistsId(playlistId)
      .then((data) => {
        this.playlist = this.formatService.formatPlaylistItem(data);
        this.tracks = this.playlist.tracks;
        if (this.titleElement) {
          setTimeout(() => {
            this.adjustFontSize(); // Este código se ejecuta después de que el DOM esté listo
          }, 0);
        }
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

  adjustFontSize() {
    let element = this.titleElement.nativeElement;
    let elementContainer = element.parentElement;
    let fontSize = 86; // 96px, tamaño ideal si es posible
    let elementHeight = element.offsetHeight;
    let containerHeight = elementContainer.offsetHeight;
    
    if (elementHeight > containerHeight) {
      // calculamos por regla de 3 una medida que encage dentro del alto máximo del contenedor
      // Realizamos la operación directamente ya que si usamos una variable puede no modificarse sincronizado
      element.style.fontSize = `${(containerHeight * fontSize) / elementHeight}px`;
    } else {
      // Solo si el tamaño es más grande del limite
      // Ajustamos el tamaño al original
      element.style.fontSize = `${fontSize}px`;
    }
  }

  ngOnDestroy() {
    // Limpiar el timeout cuando el componente sea destruido
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}
