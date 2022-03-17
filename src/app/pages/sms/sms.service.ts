import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SmsService {

    constructor() { }
    @Output() change: EventEmitter<any> = new EventEmitter();
    isOpen = false;

    code_phone: string = "";
    country_short_name: string = "";
    telefono: string = "";


    toggle() {
        this.isOpen = !this.isOpen;
        this.change.emit({isOpen:this.isOpen});
    }
}
