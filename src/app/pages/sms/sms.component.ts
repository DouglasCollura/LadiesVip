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

    error:number=0;

    //!FUNCIONES=====================================================================

    //?GESTION===================================================================================

    Continuar(){
        this.SmsService.sms = this.sms;
        this.error = 0;
        if(Vacio({code_phone:this.sms.code_phone, telefono:this.sms.telefono})){
            this.error =2;
            return
        }
        if(this.ctrl_tipo == 1){
            this.SmsService.Login()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase_modal_sms = 2;
                }else{
                    this.error = 1;
                }
            })
            .catch(error=>{
                if(error.status == "200"){
                    this.error = 3;
                }
                if(error.status == "429" || error.status == "503"){
                 this.error = 4;
                }
            })
        }else{
            this.SmsService.SignUp()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase_modal_sms = 2;
                }else{
                    this.error = 1;
                }
            })
            .catch(error=>{
               if(error.status == "200"){
                   this.error = 3;
               }
               if(error.status == "429" || error.status == "503"){
                this.error = 4;
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


}
