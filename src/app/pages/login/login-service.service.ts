import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginServiceService {

    @Output() change: EventEmitter<any> = new EventEmitter();

    isOpen = false;
    blur: boolean = false;
    url = environment.serverUrl;
    token=sessionStorage.getItem('token');
    
    constructor(
        private http: HttpClient,
    ) { }

    toggle() {
        this.isOpen = !this.isOpen;
        this.blur = !this.blur;
        this.change.emit({ isOpen: this.isOpen, blur: this.blur });
    }


}
