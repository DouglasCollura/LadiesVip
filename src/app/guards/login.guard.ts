import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { UserService } from '../services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(
        private _location: Location,
        private UserService:UserService
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log(route)
        console.log(state)
        var ua = navigator.userAgent;
        console.log(ua);
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|opera mobile|palmos|webos|Mobile|mobile|googlebot-mobile|CriOS/i.test(ua))
        {
            // alert("Mobile")
            location.href='https://www.m.ladiesvip.es'
            return false;
        }else{
            if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
                // this._location.back();
                
                this.UserService.ValRole(this.UserService.token).then((res: any) => {
                    console.log("ROLE")
                    console.log(res)
                    if (res.length == 0) {
                        location.href = '/home';
                    } else {
                        location.href = '/admin/main';
                    }

                })
                return false;
            } else {
                localStorage.clear();
                sessionStorage.clear();
                return true;
            }
        }   
    }

}
