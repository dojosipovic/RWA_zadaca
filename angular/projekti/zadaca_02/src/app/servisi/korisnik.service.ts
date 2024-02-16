import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { KorisnikI } from './KorisnikI';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KorisnikService {
  restServis = environment.restServis;

  constructor(private tokenServis: TokenService) {}

  async dohvatiKorisnike(): Promise<Array<KorisnikI>> {
    let korisnici = new Array<KorisnikI>();
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'GET',
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });
    let o = (await fetch(
      this.restServis + `baza/korisnici`,
      parametri
    )) as Response;
    if (o.status == 200) {
      let kor = JSON.parse(await o.text());
      for (let k of kor) {
        korisnici.push(k as KorisnikI);
      }
    }
    return korisnici;
  }

  async obrisiKorisnika(korime: string) {
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'DELETE',
    };
    await this.tokenServis.dodajToken(parametri).then((params) => {
      parametri = params;
    });

    let o = (await fetch(
      this.restServis + `baza/korisnici/${korime}`,
      parametri
    )) as Response;

    let podaci = await o.text();
    return JSON.parse(podaci).opis;
  }
}
