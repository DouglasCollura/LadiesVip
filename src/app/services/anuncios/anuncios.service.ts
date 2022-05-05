import { Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VacioU } from 'src/assets/script/general';

@Injectable({
    providedIn: 'root'
})
export class AnunciosService{

    constructor(
        private http: HttpClient,
    ) {
        if(sessionStorage.getItem('token') != undefined){
            this.token = sessionStorage.getItem('token')
        }else{
            this.token = localStorage.getItem('token')
        }
     }

    // url = environment.serverUrl;
    url = environment.serverUrl;
    token:any;
    
    
    anuncio:any;

    GetAnuncios(): Promise<any> {
        console.log(this.token)
        
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}anuncios-user?page=1`, {headers}).toPromise()
        return send;
    }

    GetMyAdd(): Promise<any>{
        console.log(this.token)


        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}mis-anuncios`, {headers}).toPromise()
        return send;
    }

    CrearAnuncio(anuncio:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}send-anuncios`, anuncio , {headers}).toPromise()
        return send;
    }

    UpdateAnuncio(anuncio:any,id:number): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}update-anuncio/${id}`, anuncio , {headers}).toPromise()
        return send;
    }
}
