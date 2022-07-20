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
    private premium:boolean=false;
    private actual_pack:any=null;
    notifys:any;

    getPremium(){
        return this.premium;
    }
    setPremium(is:boolean){
        this.premium = is;
    }

    getPack(){
        return this.actual_pack;
    }
    setPack(){
        this.ValidatePremium().then(res=>{
            this.actual_pack =res;
        })
    }

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

    ValidatePremium(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}validate-premium`,{headers}).toPromise()
        return send;
    }

    DeleteAccount(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}eliminar-cuenta`, {headers}).toPromise().then(res=>{
            this.actual_pack = res;
            return res
        })
        return send;
        
    }


    ValidatePack(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}validate-pack`, {headers}).toPromise().then(res=>{
            this.actual_pack = res;
            return res
        })
        return send;
    }

    GetNotifys(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}mis-notificaciones`,{headers}).toPromise().then(res=>{
            return res
        })
        return send;
    }

    ChangeAlertPay(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}active-alert-pay`,{headers}).toPromise().then(res=>{
            return res
        })
        return send;
    }

    MaxAds(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}save-max`, {headers}).toPromise().then(res=>{
            return res
        })
        return send;
    }

    ValMaxAds(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}get-max`, {headers}).toPromise().then(res=>{
            return res
        })
        return send;
    }

    ValRole(token:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + token
        });
        const send = this.http.get(`${this.url}validate-role`, {headers}).toPromise().then(res=>{
            return res
        })
        return send;
    }

}
