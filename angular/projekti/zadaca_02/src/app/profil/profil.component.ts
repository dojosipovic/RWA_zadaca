import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilService } from '../servisi/profil.service';
import { KorisnikI } from '../servisi/KorisnikI';
import { environment } from '../../environments/environment';

declare const grecaptcha: any;

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent {
  poruka = '';
  korime = '';
  prijava = false;
  korisnik?: KorisnikI;
  twofa = false;
  kljucStranica = environment.recaptcha.siteKey;

  constructor(private router: Router, private profilServis: ProfilService) {
    let user = sessionStorage.getItem('user');
    if (user == null) {
      this.poruka = 'Potrebna je prijava';
      this.router.navigate(['pocetna']);
    } else {
      this.prijava = true;
      this.korime = JSON.parse(user).korime;
      this.profilServis.dohvatiPodatke(this.korime).then((kor) => {
        this.korisnik = kor;
        this.twofa = this.korisnik?.twofa == 1;
        if (this.korisnik == undefined) this.poruka = 'Neočekivani podaci';
        console.log(this.korisnik);
      });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.korisnik!.twofa = this.twofa ? 1 : 0;
    console.log(this.korisnik);
    grecaptcha.ready(() => {
      grecaptcha
        .execute(this.kljucStranica, {
          action: 'profil',
        })
        .then(async (token: string) => {
          await this.profilServis
            .azurirajKorisnika(this.korime, this.korisnik!, token)
            .then((rez) => (this.poruka = rez));
          let user = sessionStorage.getItem('user');
          this.korime = JSON.parse(user!).korime;
          await this.profilServis.dohvatiPodatke(this.korime).then((kor) => {
            this.korisnik = kor;
            this.twofa = this.korisnik?.twofa == 1;
            if (this.korisnik == undefined) this.poruka = 'Neočekivani podaci';
            console.log(this.korisnik);
          });
        });
    });
  }
}
