import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SmsService {

    constructor(
        private http: HttpClient,
    ) { }

    @Output() change: EventEmitter<any> = new EventEmitter();
    isOpen = false;

    url = environment.serverUrl;
    token=sessionStorage.getItem('token');
    
    sms:any={
        code_phone:null,
        country_short_name:null,
        telefono:null,
        codigo:null
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.change.emit({isOpen:this.isOpen});
    }

    Login(): Promise<any>{
        const send = this.http.post(`${this.url}login-data-sms`, this.sms).toPromise()
        return send;
    }

    SignUp(): Promise<any>{
        const send = this.http.post(`${this.url}signup-data-sms`, this.sms).toPromise()
        return send;
    }

    ValCode(tipo:number): Promise<any>{
        this.sms.tipo=tipo;
        const send = this.http.post(`${this.url}valid-data-sms`, this.sms).toPromise()
        return send;
    }

    /// SEND DATA
    async ValNumero(data:any): Promise<any> {
        const send = this.http.post(`${this.url}valid-data-sms`, data).toPromise()
        return send;
    }

 
}
