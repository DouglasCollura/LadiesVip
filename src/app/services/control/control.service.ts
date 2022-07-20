import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
@Injectable({
    providedIn: 'root'
})
export class ControlService {

    constructor(
        private http: HttpClient,
        private translate: TranslateService 
    ) { 
        
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang') || 'es');
        // translate.use('en');
        

        this.generos=[]
        this.servicios=[]
        console.log("ctrl")
        this.translate.get('identidad.upt_0').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_1').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_2').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_3').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_4').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_5').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_6').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_7').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })
        this.translate.get('identidad.upt_8').subscribe((res: any) => {
            this.generos.push(this.translate.instant(res))
        })

        this.translate.get('servicios.upt_0').subscribe((res: any) => {
            this.servicios.push(this.translate.instant(res))
        })
        this.translate.get('servicios.upt_1').subscribe((res: any) => {
            this.servicios.push(this.translate.instant(res))
        })
        this.translate.get('servicios.upt_2').subscribe((res: any) => {
            this.servicios.push(this.translate.instant(res))
        })
        this.translate.get('servicios.upt_3').subscribe((res: any) => {
            this.servicios.push(this.translate.instant(res))
        })
        this.translate.get('servicios.upt_4').subscribe((res: any) => {
            this.servicios.push(this.translate.instant(res))
        })
        console.log(this.translate.instant(`identidad.upt_0`))

    }

    public signupsms = {
        code_phone: null,
        telefono: null,
        tipo: null
    }

    public generos:any=[

    ];

    public servicios:any=[

    ];
}
