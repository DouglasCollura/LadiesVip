import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

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


    // ! ANUNCIOS =========================================
    GetAnuncios(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}get-anuncios-admin`, {headers}).toPromise()
        return send;
    }

    DelAnuncio(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}rechazar-anuncio/${id}`, {headers}).toPromise()
        return send;
    }


    RemoveAnuncio(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}eliminar-anuncio/${id}`, {headers}).toPromise()
        return send;
    }


    AccAnuncio(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}aprobar-anuncio/${id}`, {headers}).toPromise()
        return send;
    }

    FiltrarAnuncios(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}filter-anuncios-admin`, filtro, {headers}).toPromise()
        return send;
    }

    SearchAnuncios(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}search-anuncios/${filtro}`, {headers}).toPromise()
        return send;
    }

    // ! CUENTAS =========================================

    DeleteAccount(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}user-banned/${id}`, {headers}).toPromise()
        return send;
    }

    BlockAccount(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}user-block/${id}`, {headers}).toPromise()
        return send;
    }

    DesBlockUser(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}user-unlock/${id}`, {headers}).toPromise()
        return send;
    }

    FiltrarUser(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}filter-user-admin`, filtro, {headers}).toPromise()
        return send;
    }

    // ! NEGOCIOS =========================================

    GetNegocios(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}negocios-admin`, {headers}).toPromise()
        return send;
    }

    CreateNegocios(negocio:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}negocios-admin-crear`, negocio, {headers}).toPromise()
        return send;
    }

    EditarNegocios(negocio:any, id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}negocios-admin-editar/${id}`, negocio, {headers}).toPromise()
        return send;
    }

    BlockNegocios(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}bloquear-negocio/${id}`, {headers}).toPromise()
        return send;
    }

    DesBlockNegocio(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}desbloquear-negocio/${id}`, {headers}).toPromise()
        return send;
    }

    GetBlockNegocios(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}negocios-bloqueados`, {headers}).toPromise()
        return send;
    }

    FiltrarNegocio(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}filter-negocios-admin`, filtro, {headers}).toPromise()
        return send;
    }

    SearchNegocio(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}search-negocios-admin/${filtro}`, {headers}).toPromise()
        return send;
    }
    
    SearchNegocioBlock(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}search-negocios-block-admin/${filtro}`, {headers}).toPromise()
        return send;
    }


    FiltrarNegocioBlock(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}filter-negocios-block-admin`, filtro, {headers}).toPromise()
        return send;
    }
    
    

    // ! SOLICITUDES=====================================================
    GetSolicitudes(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}get-promocionados`, {headers}).toPromise()
        return send;
    }

    DissSolicitud(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}rechazar-promocion/${id}`, {headers}).toPromise()
        return send;
    }

    AccSolicitud(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}aprobar-promocion/${id}`, {headers}).toPromise()
        return send;
    }


    FiltrarSolicitud(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}filter-negocios-promocionados-admin`, filtro, {headers}).toPromise()
        return send;
    }

    SearchSolicitud(filtro:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}search-promocionados-admin/${filtro}`, {headers}).toPromise()
        return send;
    }
    
    
    ValPass(pass:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.post(`${this.url}validate-password`, pass, {headers}).toPromise()
        return send;
    }
}
