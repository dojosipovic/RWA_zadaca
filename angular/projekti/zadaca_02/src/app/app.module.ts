import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { FormsModule } from '@angular/forms';
import { DetaljiSerijeComponent } from './detalji-serije/detalji-serije.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { OdjavaComponent } from './odjava/odjava.component';
import { FavoritiComponent } from './favoriti/favoriti.component';
import { FavoritDetaljiComponent } from './favorit-detalji/favorit-detalji.component';
import { ProfilComponent } from './profil/profil.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { QRCodeModule } from 'angularx-qrcode';

const routes: Routes = [
  { path: 'pocetna', component: PocetnaComponent },
  { path: 'detalji/:idSerije', component: DetaljiSerijeComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'dokumentacija', component: DokumentacijaComponent },
  { path: 'odjava', component: OdjavaComponent },
  { path: 'favoriti', component: FavoritiComponent },
  { path: 'favoritdetalji/:idFavorit', component: FavoritDetaljiComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'korisnici', component: KorisniciComponent },
  { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    DetaljiSerijeComponent,
    PrijavaComponent,
    DokumentacijaComponent,
    OdjavaComponent,
    FavoritiComponent,
    FavoritDetaljiComponent,
    ProfilComponent,
    RegistracijaComponent,
    KorisniciComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    RouterModule.forRoot(routes),
    QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
