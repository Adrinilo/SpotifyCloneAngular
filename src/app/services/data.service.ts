import { Injectable } from '@angular/core';
import { Track } from '../interfaces/track.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // BehaviorSubject inicializado con un objeto vacío (Track por defecto)
  private currentTrackSubject = new BehaviorSubject<Track>({} as Track);

  // Observable para que los componentes se suscriban
  currentTrack$ = this.currentTrackSubject.asObservable();

  constructor() {}

  // Método para actualizar el estado de la pista actual
  setCurrentTrack(track: Track) {
    this.currentTrackSubject.next(track);
  }

  // Método para obtener el valor actual (sin necesidad de suscripción)
  getCurrentTrack(): Track {
    return this.currentTrackSubject.value;
  }
}
