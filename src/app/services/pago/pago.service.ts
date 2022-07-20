import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PagoService {

    constructor(
        private http: HttpClient,
    ) { 
        if(sessionStorage.getItem('token') != undefined){
            this.token = sessionStorage.getItem('token')
        }else{
            this.token = localStorage.getItem('token')
        }
    }

    url = environment.serverUrl;
    token:any;

    @Output() change: EventEmitter<any> = new EventEmitter();

    
    tipo:number=0;

    titulo=[
        "Promoción Standard",
        "Promoción Plus",
        "Promoción Extra Plus",
        "Promoción Standard",
        "Renovación por separado"
    ];

    precio=[

    ]

    SetTitle(tipo:number){
        this.tipo = tipo;
        this.change.emit({tipo:this.tipo});
    }

    Pagar(data:any){
        const send = this.http.post(`https://ladies-vip.herokuapp.com/pay`,  data ).toPromise()
        return send;
    }

    UpdatePack(data:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}update-paquete`,  data , {headers}).toPromise()
        return send;
    }

    UpdatePackPaypal(data:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}update-paquete-paypal`,  data , {headers}).toPromise()
        return send;
    }
}
