import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { SerijeBazaI } from './SerijeBazaI';

@Injectable({
  providedIn: 'root',
})
export class FavoritiService {
  restServis = environment.restServis;

  constructor(private tokenServis: TokenService) {}

  async ukloniFavorit(id: number) {
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'DELETE',
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });
    let o = (await fetch(
      this.restServis + `baza/favoriti/${id}`,
      parametri
    )) as Response;
    return JSON.parse(await o.text()).opis;
  }

  async dohvatiFavorit(id: string): Promise<SerijeBazaI> {
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'GET',
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });
    let o = (await fetch(
      this.restServis + `baza/favoriti/${id}`,
      parametri
    )) as Response;
    let rez = JSON.parse(await o.text());
    return rez as SerijeBazaI;
  }

  async dodajFavorit(id: number): Promise<string> {
    let zaglavlje = new Headers();
    zaglavlje.set('Content-Type', 'application/json');
    let tijelo = { serijaId: id };
    let parametri = {
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify(tijelo),
      headers: zaglavlje,
      method: 'POST',
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });

    let o = (await fetch(
      this.restServis + `baza/favoriti`,
      parametri
    )) as Response;

    let podaci = await o.text();
    return JSON.parse(podaci).opis;
  }

  async dohvatiFavorite(): Promise<Array<SerijeBazaI>> {
    let favoriti = new Array<SerijeBazaI>();
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'GET',
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });
    let o = (await fetch(
      this.restServis + `baza/favoriti`,
      parametri
    )) as Response;
    if (o.status == 200) {
      let fav = JSON.parse(await o.text());
      for (let f of fav) {
        favoriti.push(f as SerijeBazaI);
      }
    }
    return favoriti;
  }
}
