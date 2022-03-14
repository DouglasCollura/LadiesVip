import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private AuthServiceService:AuthServiceService
    ) { }

    loggedIn: boolean = false;

    ngOnInit(): void {

    }


    signOut(): void {
      this.AuthServiceService.logOut()
      .then(()=>{
        sessionStorage.clear()
        this.router.navigate(['/'])
      })
    }

    nav(event: any) {
        $(".menu-nav-active").removeClass("menu-nav-active");
        $("#" + event).addClass("menu-nav-active");
    }

}
