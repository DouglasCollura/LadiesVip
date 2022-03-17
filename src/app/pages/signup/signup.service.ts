import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SignupService {
    
    @Output() change: EventEmitter<any> = new EventEmitter();

    isOpen = false;
    blur:boolean=false;
  
    constructor() { }
  
    toggle() {
      this.isOpen = !this.isOpen;
      this.blur = !this.blur;
      this.change.emit({isOpen:this.isOpen, blur:this.blur});
    }

    
}
