import { Component, Input } from '@angular/core';
import { SerijeService } from '../servisi/serije.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SerijaTmdbI } from '../servisi/SerijeTmdbI';
import { environment } from '../../environments/environment';
import { FavoritiService } from '../servisi/favoriti.service';
import { SerijaGithubI } from '../servisi/SerijaGithubI';

@Component({
  selector: 'app-detalji-serije',
  templateUrl: './detalji-serije.component.html',
  styleUrl: './detalji-serije.component.scss',
})
export class DetaljiSerijeComponent {
  @Input() serija: SerijaTmdbI | null = null;
  slikaUrl = environment.posteriPutanja;
  poruka = '';
  prijava = false;
  github = false;

  constructor(
    private aktivnaRuta: ActivatedRoute,
    private serijeServisi: SerijeService,
    private favoritiServisi: FavoritiService,
    private router: Router
  ) {
    this.prijava = sessionStorage.getItem('user') != null;
    this.github = sessionStorage.getItem('github') != null;
    if (!this.prijava && !this.github) this.router.navigate(['pocetna']);
    else {
      aktivnaRuta.paramMap.subscribe((parametri) => {
        let idSerije = parametri.get('idSerije');
        serijeServisi.dohvatiSeriju(idSerije!).then((res) => {
          this.serija = res;
          if (this.serija == null) this.poruka = 'Serija nije pronađena!';
        });
      });
    }
  }

  dodajFavorit(id: number) {
    if (this.prijava)
      this.favoritiServisi.dodajFavorit(id).then((res) => (this.poruka = res));
    if (this.github) this.dodajGitHubFavorit(id);
  }

  private async dodajGitHubFavorit(id: number) {
    let podaci = sessionStorage.getItem('github');
    let githubuser = JSON.parse(podaci!).login;
    let favoriti = localStorage.getItem(githubuser);
    let serija = await this.serijeServisi.dohvatiSerijuGithub(id);

    if (favoriti == null) {
      let serije = new Array<any>();
      serije.push(serija);
      localStorage.setItem(githubuser, JSON.stringify(serije));
    } else {
      let serije = JSON.parse(favoriti);
      let imaTuSeriju = serije.some(
        (obj: SerijaGithubI) => obj.id === serija!.id
      );
      if (imaTuSeriju) this.poruka = 'Imate taj favorit';
      else {
        serije.push(serija);
        localStorage.setItem(githubuser, JSON.stringify(serije));
      }
    }
  }
}
