import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    constructor() { }

    ctrl_menu = 1;

    ngOnInit(): void {

    }

    nav(event: any, fase: number) {
        this.ctrl_menu = fase;
        $(".btn-nav-active").removeClass("btn-nav-active");
        $("#" + event).addClass("btn-nav-active");
    }

}
