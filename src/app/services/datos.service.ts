import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private dato = new BehaviorSubject<string>('ipsum');
  datoActual = this.dato.asObservable();

  enviarDato(nuevoDato: string) {
    this.dato.next(nuevoDato);
  }
}
