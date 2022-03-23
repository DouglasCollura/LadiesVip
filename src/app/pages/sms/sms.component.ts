import { Component, Input, OnInit,  Output, EventEmitter } from '@angular/core';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { SoloNumero, Vacio } from 'src/assets/script/general';
import { SmsService } from './sms.service';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit {

    @Input() importTipo:number=0;
    @Output() exportRes: EventEmitter<any> = new EventEmitter();

    constructor(
        private GeoLocationService: GeoLocationService,
        private SmsService:SmsService,
    ) {

     }

    ngOnInit(): void {
        this.ctrl_tipo = this.importTipo;
        
        this.GeoLocationService.getCountries().then(res => {
            this.locaciones = res;
        });

        this.SmsService.change.subscribe(res=>{
            this.isOpen = res.isOpen;
        })
    }

    //!DATA=====================================================================

    //?CARGA===================================================================================
    locaciones: any = null;

    //?GESTION===================================================================================

    sms:any={
        code_phone:null,
        country_short_name:null,
        telefono:null,
        codigo:null
    }

    filtro:string="";
    locaciones_filtro:any=[];
    //?CONTROL===================================================================================
    ctrl_tipo=0;
    isOpen: boolean = false;
    fase_modal_sms: number = 1;
    ctrl_modal_sms_tlf: boolean = false;

    code_1:string="";
    code_2:string="";
    code_3:string="";
    code_4:string="";
    code_5:string="";
    loading:boolean=false;
    error:number=0;
    re_code:boolean=false;

    //!FUNCIONES=====================================================================

    //?GESTION===================================================================================

    Continuar(){

        this.code_1="";
        this.code_2="";
        this.code_3="";
        this.code_4="";
        this.code_5="";

        this.loading = true;
        this.SmsService.sms = this.sms;
        this.re_code = false;
        this.error = 0;
        if(Vacio({code_phone:this.sms.code_phone, telefono:this.sms.telefono})){
            this.error =2;
            this.loading = false;
            return
        }
        if(this.ctrl_tipo == 1){
            this.SmsService.Login()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase_modal_sms = 2;
                    this.loading = false;
                    setTimeout(()=>{
                        this.re_code =true;
                    }, 120000);
                }else{
                    this.error = 1;
                    this.loading = false;
                }
            })
            .catch(error=>{
                if(error.status == "200"){
                    this.error = 3;
                    this.loading = false;

                }
                if(error.status == "429" || error.status == "503"){
                    this.error = 4;
                    this.loading = false;
                }
            })
        }else{
            this.SmsService.SignUp()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase_modal_sms = 2;
                    this.loading = false;
                    setTimeout(()=>{
                        this.re_code =true;
                    }, 120000);
                }else{
                    this.error = 1;
                    this.loading = false;
                }
            })
            .catch(error=>{
               if(error.status == "200"){
                   this.error = 3;
                   this.loading = false;
               }
               if(error.status == "429" || error.status == "503"){
                this.error = 4;
                this.loading = false;
            }
            })
        }
    }
    //?CONTROL===================================================================================
    
    VerificarCodigoSMS() {
        this.sms.codigo = this.code_1 + this.code_2 + this.code_3 + this.code_4 + this.code_5;
        this.SmsService.sms = this.sms;
        this.SmsService.ValCode(this.ctrl_tipo).then(res=>{
            console.log(res);
            if(!res.error){
                this.exportRes.emit(res);   
                this.Close()
            }else{
                this.error = 1;
            }
        });
    }

    SelectTlf() {
        this.ctrl_modal_sms_tlf = true;
    }

    SelectCodeTlf(code_phone: string, country_short_name: string) {
        this.sms.code_phone = code_phone;
        this.sms.country_short_name = country_short_name;
        this.ctrl_modal_sms_tlf = false;
        this.isOpen= true;
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

    Close(){
        this.code_1="";
        this.code_2="";
        this.code_3="";
        this.code_4="";
        this.code_5="";

        this.sms.code_phone = null;
        this.sms.telefono = null;
        this.sms.country_short_name = null;
        this.sms.codigo = null;
        this.error = 0; 
        this.ctrl_modal_sms_tlf = false;
        this.fase_modal_sms = 1;
        this.SmsService.toggle()
    }
    
    filtrar(){
        this.locaciones_filtro = [];
        this.locaciones.forEach((arrayItem:any)=> {
            if(arrayItem.country_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                this.locaciones_filtro.push(arrayItem)
            }
            
            if(String(arrayItem.country_phone_code).indexOf(this.filtro)> -1){
                this.locaciones_filtro.push(arrayItem)
            }
        });
    }

}
