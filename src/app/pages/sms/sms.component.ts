import { Component, OnInit } from '@angular/core';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { SoloNumero } from 'src/assets/script/general';
import { SmsService } from './sms.service';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit {

    constructor(
        private GeoLocationService: GeoLocationService,
        private SmsService:SmsService,
    ) { }
    ngOnInit(): void {
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
    code_phone: string = "";
    country_short_name: string = "";
    telefono: string = "";


    //?CONTROL===================================================================================
    isOpen: boolean = false;
    fase_modal_sms: number = 1;
    ctrl_modal_sms_tlf: boolean = false;




    VerificarCodigoSMS() {
        this.fase_modal_sms = 1;
        this.SmsService.toggle()
    }

    SelectTlf() {
        this.ctrl_modal_sms_tlf = true;
    }

    SelectCodeTlf(code_phone: string, country_short_name: string) {
        this.code_phone = code_phone;
        this.country_short_name = country_short_name;
        this.ctrl_modal_sms_tlf = false;
        this.isOpen= true;
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

    Close(){
        this.SmsService.toggle()
    }


}
