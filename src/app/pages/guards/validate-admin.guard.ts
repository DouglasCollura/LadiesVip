import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateAdminGuard implements CanActivate {
  constructor(
    private AuthServiceService:AuthServiceService
  ){

  }
  canActivate():Observable<boolean>|Promise<boolean>{
    return this.AuthServiceService.ValUser().then(res=>{
      console.log(res)
      return true
    })
    
  }
  
}
