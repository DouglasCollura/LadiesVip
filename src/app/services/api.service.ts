import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private http: HttpClient) {
    }

    url:string = 'https://backalimas.calimas.pe/api/';

    async getUsers(): Promise<any> {
        // const headers = new HttpHeaders({
        //   Authorization: 'Bearer ' + this.token
        // });
        const serv = this.http.get(`${this.url}GetUsuario`).toPromise()
        return serv;
    }
}
