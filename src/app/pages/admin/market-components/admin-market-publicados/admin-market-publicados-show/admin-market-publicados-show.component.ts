import { Component, EventEmitter, OnInit,Output } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-admin-market-publicados-show',
    templateUrl: './admin-market-publicados-show.component.html',
    styleUrls: ['./admin-market-publicados-show.component.css', '../../../main/main.component.css']
})
export class AdminMarketPublicadosShowComponent implements OnInit {

    constructor() { }
    @Output() BoolShow = new EventEmitter<boolean>();

    ctrl_menu:number = 0;

    ngOnInit(): void {
    }


    CerrarShow() {
        this.BoolShow.emit(false);
    }

    nav(event: any, fase: number) {
        this.ctrl_menu = fase;
        $(".active").removeClass("active");
        $("#" + event).addClass("active");
    }

}
