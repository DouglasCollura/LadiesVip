import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthOutGuard } from './guards/auth-out.guard';
import { AuthUserGuard } from './guards/auth-user.guard';
import { LoginGuard } from './guards/login.guard';
import { MainComponent } from './pages/admin/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PoliticasComponent } from './pages/politicas/politicas.component';
import { TerminosComponent } from './pages/terminos/terminos.component';

function AuthRoute(){
  return true;
}

const routes: Routes = [
  {
    path:"",
    component:LandingComponent,
    canActivate:[LoginGuard]
  },
  {
    path:"land",
    component:LandingComponent
  },
  {
    path:"home",
    component:HomeComponent,
    canActivate: [AuthUserGuard]
  },
  {
    path:"admin/main",
    component:MainComponent,
    canActivate:[AuthAdminGuard]
  },
  {
    path:"terminos",
    component:TerminosComponent,
  },
  {
    path:"politicas",
    component:PoliticasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
