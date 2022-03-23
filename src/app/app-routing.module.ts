import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/admin/main/main.component';
import { ValidateAdminGuard } from './pages/guards/validate-admin.guard';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';

function AuthRoute(){
  return true;
}

const routes: Routes = [
  {
    path:"",
    component:LandingComponent,
    
  },
  {
    path:"land",
    component:LandingComponent
  },
  {
    path:"home",
    component:HomeComponent
  },
  {
    path:"admin/main",
    component:MainComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
