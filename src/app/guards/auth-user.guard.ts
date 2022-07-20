import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthUserGuard implements CanActivate {

    constructor (

        public router: Router
    ) {}
    
    canActivate(
        next: ActivatedRouteSnapshot,   
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if ( (!sessionStorage.getItem('token') && !sessionStorage.getItem('guest')) && (!localStorage.getItem('token') && !sessionStorage.getItem('guest'))  ) {

            this.router.navigate(['/']);
    
            return false;
    
        }
        return true;
    }

}
