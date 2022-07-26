import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService {

    url: string = 'https://www.universal-tutorial.com/api/';
    urln = environment.serverUrl;
    token: string = "kO763mtM9Ajx650BZAnv6mL7s5DKULyF6S2jFxhe7yOkwh_SRvuwe51bu2-ULOipEyM";
    tokenAuthorization:string = "";

    constructor(private http: HttpClient) {
    }


    async getToken(): Promise<any> {
        const headers = new HttpHeaders({
            'api-token': this.token,
            'user-email': 'douglascollura@gmail.com',
        });
        const data = this.http.get(`${this.url}getaccesstoken`, { headers }).toPromise()
        return data;

    }

    async getCountries(){
        return this.getToken()
        .then(res=>{
            this.tokenAuthorization = res.auth_token;

            const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.tokenAuthorization,
            "Accept": "application/json"
            });
            return this.http.get<any>(`${this.url}countries/`, {headers}).toPromise()
        })
    }

    async getStates(pais:any){
        return this.getToken()
        .then(res=>{
            this.tokenAuthorization = res.auth_token;

            const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.tokenAuthorization,
            "Accept": "application/json"
            });
            return this.http.get<any>(`${this.url}states/${pais}`, {headers}).toPromise()
        })
    }

    async getCities(estado:any){
        return this.getToken()
        .then(res=>{
            this.tokenAuthorization = res.auth_token;

            const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.tokenAuthorization,
            "Accept": "application/json"
            });
            return this.http.get<any>(`${this.url}cities/${estado}`, {headers}).toPromise()
        })
    }

    GetEstados(){
        const data = this.http.get(`${this.urln}estados`).toPromise()
        return data;
    }

    GetCiudades(estado:any){
        const data = this.http.get(`${this.urln}ciudades/${estado}`).toPromise()
        return data;
    }


}
