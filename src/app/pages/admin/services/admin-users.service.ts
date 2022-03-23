import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminUsersService {

    constructor(
        private http: HttpClient,

    ) { }

    url = environment.serverUrl;
    token = sessionStorage.getItem('token');


    GetUsersAll(pages:number): Promise<any>{
        const send = this.http.get(`${this.url}users-all?pages=${pages}`).toPromise()
        return send;
    }

    GetCountData(): Promise<any>{
        const send = this.http.get(`${this.url}count-data`).toPromise()
        return send;
    }

    FindUser(query:any): Promise<any>{
        const send = this.http.get(`${this.url}search-users/${query}`).toPromise()
        return send;
    }

    BlockUser(id:number,data:any): Promise<any>{
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}lock-user/${id}`, data, {headers}).toPromise()
        return send;
    }

    ValPass(data:any): Promise<any>{
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}compare-password`, data, {headers}).toPromise()
        return send;
    }

    RemoveUser(id:number): Promise<any>{
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}remove-user/${id}`, {headers}).toPromise()
        return send;
    }
}
