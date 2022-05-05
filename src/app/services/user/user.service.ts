import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient,
    ) {
        if(sessionStorage.getItem('token') != undefined ){
            this.token = sessionStorage.getItem('token')
        }else{
            this.token = localStorage.getItem('token')
        }
    }

    url = environment.serverUrl;
    token:any;


    UpdateUser(datos:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}update-user`, datos , {headers}).toPromise()
        return send;
    }

    UpdateInfo(datos:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}update-info`, datos , {headers}).toPromise()
        return send;
    }
}
