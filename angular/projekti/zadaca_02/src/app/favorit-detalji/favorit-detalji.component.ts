import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SerijeService } from '../servisi/serije.service';
import { FavoritiService } from '../servisi/favoriti.service';
import { SerijeBazaI } from '../servisi/SerijeBazaI';
import { environment } from '../../environments/environment';
import { SerijaGithubI } from '../servisi/SerijaGithubI';

@Component({
  selector: 'app-favorit-detalji',
  templateUrl: './favorit-detalji.component.html',
  styleUrl: './favorit-detalji.component.scss',
})
export class FavoritDetaljiComponent {
  slikaUrl = environment.posteriPutanja;
  prijava = false;
  github = false;
  poruka = '';
  favorit?: SerijeBazaI;
  favoritgithub?: SerijaGithubI;

  constructor(
    private aktivnaRuta: ActivatedRoute,
    private serijeServisi: SerijeService,
    private favoritiServisi: FavoritiService
  ) {
    this.prijava = sessionStorage.getItem('user') != null;
    this.github = sessionStorage.getItem('github') != null;
    if (!this.prijava && !this.github) this.poruka = 'Potrebna prijava';
    else {
      aktivnaRuta.paramMap.subscribe((parametri) => {
        let idSerije = parametri.get('idFavorit');
        console.log(idSerije);
        if (idSerije != null) {
          if (this.prijava) this.dohvatiFavorit(idSerije);
          if (this.github) this.dohvatiGithubFavorit(Number(idSerije));
        }
      });
    }
  }

  async dohvatiFavorit(id: string) {
    await this.favoritiServisi.dohvatiFavorit(id).then((rez) => {
      this.favorit = rez;
      console.log(this.favorit);
    });
  }

  private dohvatiGithubFavorit(idSerije: number) {
    let podaci = sessionStorage.getItem('github');
    let githubuser = JSON.parse(podaci!).login;
    let favoriti = localStorage.getItem(githubuser);
    let serije = new Array<SerijaGithubI>();
    if (favoriti != null) {
      serije = JSON.parse(favoriti);
    }

    const favorit = serije.find((obj) => obj.id === idSerije);
    if (favorit) this.favoritgithub = favorit;
  }
}
