import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MarketService {

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

    SearchNegocio(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}search-negocios-categorias/${id}`, {headers}).toPromise()
        return send;
    }

    SearchNegocioInv(id:any): Promise<any> {
        const send = this.http.get(`${this.url}negocios-invitado/${id}`).toPromise()
        return send;
    }

    Destacados(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}negocios-destacados`, {headers} ).toPromise()
        return send;
    }

    Fitrar(filtro:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}filter-market`, filtro, {headers} ).toPromise()
        return send;
    }

    FitrarInv(filtro:any){
       
        const send = this.http.post(`${this.url}filter-market-invitado`, filtro).toPromise()
        return send;
    }

    Search(filtro:any){
        const send = this.http.get(`${this.url}search-negocios/${filtro}`).toPromise()
        return send;
    }
}
