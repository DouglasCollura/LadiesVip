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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseApp } from 'src/environments/firebaseConfig';
import { AdminMarketSolicitudesComponent } from './admin/market-components/admin-market-solicitudes/admin-market-solicitudes.component';
import { AdminMarketPublicadosShowComponent } from './admin/market-components/admin-market-publicados/admin-market-publicados-show/admin-market-publicados-show.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SmsComponent } from './sms/sms.component';
import { MarketComponent } from './market/market.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { NotifyComponent } from './notify/notify.component';
import { ProfileComponent } from './profile/profile.component';
import { ConfigComponent } from './profile/config/config.component';
import { AnuncioComponent } from './profile/anuncio/anuncio.component';
import { CuentaAccesoComponent } from './profile/cuenta-acceso/cuenta-acceso.component';
import { InformacionPersonalComponent } from './profile/informacion-personal/informacion-personal.component';
import { NegociosComponent } from './profile/negocios/negocios.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { PlanesComponent } from './profile/planes/planes.component';
import { PacksAnunciosComponent } from './profile/packs-anuncios/packs-anuncios.component';
import { PagoComponent } from './profile/pago/pago.component';
import { FavoritoComponent } from './profile/favorito/favorito.component';
import { ShowComponent } from './profile/favorito/show/show.component';
import { HelpNewComponent } from './help-new/help-new.component';
import { HelpComponent } from './profile/help/help.component';
import { VideoComponent } from './home/video/video.component';
import { CreateMarketComponent } from './admin/market-components/admin-market-publicados/create-market/create-market.component';
import { AhShowVideoComponent } from './admin/home-components/admin-home-anuncios/ah-show-video/ah-show-video.component';
import { LandingPromoComponent } from './landing/landing-promo/landing-promo.component';
import { TerminosComponent } from './terminos/terminos.component';
import { AmBloqueadosComponent } from './admin/market-components/am-bloqueados/am-bloqueados.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    SmsComponent,
    MarketComponent,
    MensajesComponent,
    NotifyComponent,
    ProfileComponent,
    ConfigComponent,
    AnuncioComponent,
    CuentaAccesoComponent,
    InformacionPersonalComponent,
    NegociosComponent,
    PlanesComponent,
    PacksAnunciosComponent,
    PagoComponent,
    FavoritoComponent,
    ShowComponent,
    HelpNewComponent,
    HelpComponent,
    VideoComponent,
    CreateMarketComponent,
    AhShowVideoComponent,
    LandingPromoComponent,
    TerminosComponent,
    AmBloqueadosComponent,
    PoliticasComponent,
    ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AngularFireModule.initializeApp(firebaseApp.firebase),
    AngularFireAuthModule,
    ReactiveFormsModule,
    GoogleMapsModule ,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }) 
  ],
})
export class PagesModule { }
