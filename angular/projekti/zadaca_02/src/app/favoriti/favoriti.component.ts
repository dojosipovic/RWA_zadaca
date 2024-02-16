import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritiService } from '../servisi/favoriti.service';
import { SerijeBazaI } from '../servisi/SerijeBazaI';
import { environment } from '../../environments/environment';
import { SerijaGithubI } from '../servisi/SerijaGithubI';

@Component({
  selector: 'app-favoriti',
  templateUrl: './favoriti.component.html',
  styleUrl: './favoriti.component.scss',
})
export class FavoritiComponent {
  slikaUrl = environment.posteriPutanja;
  poruka = '';
  favoriti = new Array<SerijeBazaI>();
  favoritigithub = new Array<SerijaGithubI>();

  constructor(private router: Router, private favoritiServis: FavoritiService) {
    if (sessionStorage.getItem('github') != null) {
      this.favoritigithub = this.dohvatiFavoriteGithub();
      if (this.favoritigithub.length == 0) this.poruka = 'Nemate favorita';
      console.log(this.favoritigithub);
    } else if (sessionStorage.getItem('user') == null) {
      this.poruka = 'Potrebna je prijava';
      this.router.navigate(['pocetna']);
    } else {
      this.favoritiServis.dohvatiFavorite().then((res) => {
        this.favoriti = res;
        if (this.favoriti.length == 0) this.poruka = 'Nemate favorita';
        console.log(this.favoriti);
      });
    }
  }

  prikaziDetalje(id: number) {
    this.router.navigate([`favoritdetalji/${id}`]);
  }

  async ukloniFavorit(id: number) {
    await this.favoritiServis
      .ukloniFavorit(id)
      .then((res) => (this.poruka = res));
    await this.favoritiServis.dohvatiFavorite().then((res) => {
      this.favoriti = res;
      if (this.favoriti.length == 0) this.poruka = 'Nemate favorita';
      console.log(this.favoriti);
    });
  }

  private dohvatiFavoriteGithub(): SerijaGithubI[] {
    let podaci = sessionStorage.getItem('github');
    let githubuser = JSON.parse(podaci!).login;
    let favoriti = localStorage.getItem(githubuser);
    let serije = new Array<SerijaGithubI>();
    if (favoriti != null) {
      serije = JSON.parse(favoriti);
    }
    return serije;
  }

  ukloniGithubFavorit(id: number) {
    let podaci = sessionStorage.getItem('github');
    let githubuser = JSON.parse(podaci!).login;
    let serije = this.favoritigithub.filter((obj) => obj.id !== id);
    localStorage.setItem(githubuser, JSON.stringify(serije));
    this.favoritigithub = serije;
  }
}
