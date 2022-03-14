import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { RecoverypassComponent } from './recoverypass/recoverypass.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { AdminHomeAnunciosComponent } from './admin/home-components/admin-home-anuncios/admin-home-anuncios.component';
import { AdminMarketComponent } from './admin/admin-market/admin-market.component';
import { AdminSolicitudesComponent } from './admin/admin-solicitudes/admin-solicitudes.component';
import { AdminMarketPublicadosComponent } from './admin/market-components/admin-market-publicados/admin-market-publicados.component';
import { AdminHomeReportesComponent } from './admin/home-components/admin-home-reportes/admin-home-reportes.component';
import { AdminHomeUsuarioComponent } from './admin/home-components/admin-home-usuario/admin-home-usuario.component';
import { MainComponent } from './admin/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseApp } from 'src/environments/firebaseConfig';
import { AdminMarketSolicitudesComponent } from './admin/market-components/admin-market-solicitudes/admin-market-solicitudes.component';
import { AdminMarketPublicadosShowComponent } from './admin/market-components/admin-market-publicados/admin-market-publicados-show/admin-market-publicados-show.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignupComponent,
    RecoverypassComponent,
    LoginComponent,
    LandingComponent,
    HomeComponent,
    AdminMarketComponent,
    AdminSolicitudesComponent,
    AdminMarketPublicadosComponent,
    AdminHomeAnunciosComponent,
    AdminHomeReportesComponent,
    AdminHomeUsuarioComponent,
    MainComponent,
    AdminHomeComponent,
    AdminMarketSolicitudesComponent,
    AdminMarketPublicadosShowComponent,
    
    ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AngularFireModule.initializeApp(firebaseApp.firebase),
    AngularFireAuthModule,
    ReactiveFormsModule
  ],
})
export class PagesModule { }
