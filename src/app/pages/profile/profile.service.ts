import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  @Output() change: EventEmitter<any> = new EventEmitter();


  toggle() {
    this.change.emit(true);
  }
}
