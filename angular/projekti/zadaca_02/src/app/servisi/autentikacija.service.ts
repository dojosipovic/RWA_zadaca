import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutentikacijaService {
  private restServis = environment.restServis;
  constructor() {}

  async prijavi(korime: string, lozinka: string, totp: string, token: string) {
    let tijelo = { lozinka: lozinka, token: token, totp: totp };
    let zaglavlje = new Headers();
    zaglavlje.set('Content-Type', 'application/json');

    let parametri = {
      method: 'POST',
      body: JSON.stringify(tijelo),
      headers: zaglavlje,
      credentials: 'include' as RequestCredentials,
    };
    let o = (await fetch(
      this.restServis + `baza/korisnici/${korime}/prijava`,
      parametri
    )) as Response;
    return o.status == 201;
  }
}
