import { Component } from '@angular/core';
import { KorisnikI } from '../servisi/KorisnikI';
import { ProfilService } from '../servisi/profil.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

declare const grecaptcha: any;

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss',
})
export class RegistracijaComponent {
  prijava = false;
  admin = false;
  poruka = '';
  korisnik: KorisnikI = {
    ime: '',
    prezime: '',
    admin: 0,
    korime: '',
    email: '',
    lozinka: '',
    drzava: '',
    mjesto: '',
    opis: '',
    twofa: 0,
    tajnikljuc: '',
    prviput: 0,
  };
  kljucStranica = environment.recaptcha.siteKey;

  constructor(private profilServis: ProfilService, private router: Router) {
    let user = sessionStorage.getItem('user');
    this.prijava = user != null;
    if (this.prijava) {
      this.admin = JSON.parse(user!).admin;
      if (!this.admin) {
        this.poruka = 'Nemate ovlasti';
        this.router.navigate(['pocetna']);
      }
    } else {
      this.poruka = 'Niste prijavljeni';
      this.router.navigate(['pocetna']);
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    grecaptcha.ready(() => {
      grecaptcha
        .execute(this.kljucStranica, {
          action: 'registracija',
        })
        .then((token: string) => {
          this.profilServis
            .registrirajKorisnika(this.korisnik, token)
            .then((res) => (this.poruka = res));
        });
    });
    console.log(this.korisnik);
  }

  dohvatiToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {});
  }
}
