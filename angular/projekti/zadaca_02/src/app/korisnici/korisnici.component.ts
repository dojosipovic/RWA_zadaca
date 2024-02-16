import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../servisi/korisnik.service';
import { KorisnikI } from '../servisi/KorisnikI';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrl: './korisnici.component.scss',
})
export class KorisniciComponent {
  prijava = false;
  admin = false;
  poruka = '';
  korisnici = new Array<KorisnikI>();

  constructor(private router: Router, private korisnikServis: KorisnikService) {
    let user = sessionStorage.getItem('user');
    this.prijava = user != null;
    if (this.prijava) {
      this.admin = JSON.parse(user!).admin;
      if (!this.admin) {
        this.poruka = 'Nemate ovlasti';
        this.router.navigate(['pocetna']);
      } else {
        this.korisnikServis.dohvatiKorisnike().then((res) => {
          this.korisnici = res;
          console.log(this.korisnici);
        });
      }
    } else {
      this.poruka = 'Niste prijavljeni';
      this.router.navigate(['pocetna']);
    }
  }

  prikaziKorisnike() {
    this.korisnikServis.dohvatiKorisnike().then((res) => {
      this.korisnici = res;
      console.log(this.korisnici);
    });
  }

  obrisiKorisnika(korime: string) {
    this.korisnikServis.obrisiKorisnika(korime).then((rez) => {
      this.poruka = rez;
      this.prikaziKorisnike();
    });
  }
}
