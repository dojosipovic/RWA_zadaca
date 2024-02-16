import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { KorisnikI } from './KorisnikI';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {
  restServis = environment.restServis;

  constructor(private tokenServis: TokenService) {}

  async dohvatiPodatke(korime: string): Promise<KorisnikI | undefined> {
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'GET',
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });
    let o = (await fetch(
      this.restServis + `baza/korisnici/${korime}`,
      parametri
    )) as Response;
    if (o.status != 200) return undefined;
    let rez = JSON.parse(await o.text());
    rez.lozinka = '';
    return rez as KorisnikI;
  }

  async azurirajKorisnika(
    korime: string,
    korisnik: KorisnikI,
    token: string
  ): Promise<string> {
    let zaglavlje = new Headers();
    zaglavlje.set('Content-Type', 'application/json');
    let tijelo = { korisnik: korisnik, token: token };
    let parametri = {
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify(tijelo),
      method: 'PUT',
      headers: zaglavlje,
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });
    let o = (await fetch(
      this.restServis + `baza/korisnici/${korime}`,
      parametri
    )) as Response;

    let rez = JSON.parse(await o.text());
    return rez.opis;
  }

  async registrirajKorisnika(
    korisnik: KorisnikI,
    token: string
  ): Promise<string> {
    let zaglavlje = new Headers();
    zaglavlje.set('Content-Type', 'application/json');
    let tijelo = { korisnik: korisnik, token: token };
    let parametri = {
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify(tijelo),
      method: 'POST',
      headers: zaglavlje,
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });
    let o = (await fetch(
      this.restServis + `baza/korisnici/`,
      parametri
    )) as Response;

    let rez = JSON.parse(await o.text());
    return rez.opis;
  }
}
