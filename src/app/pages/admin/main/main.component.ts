import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    constructor(
        private router: Router,
    ) { }

    ctrl_menu = 0;

    ngOnInit(): void {

    }

    nav(event: any, fase: number) {
        this.ctrl_menu = fase;
        $(".btn-nav-active").removeClass("btn-nav-active");
        $("#" + event).addClass("btn-nav-active");
    }

    LogOut(){
        sessionStorage.clear()
        this.router.navigate(['/'])
    }

}
