import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  restServis = environment.restServis;
  constructor() {}

  async dodajToken(parametri: any = {}): Promise<any> {
    let zaglavlje = new Headers();
    if (parametri.headers != null) zaglavlje = parametri.headers;

    let userStr = sessionStorage.getItem('user');
    let user = JSON.parse(userStr!).korime;
    let token = await this.dajToken(user);

    zaglavlje.set('Authorization', token!);
    parametri.headers = zaglavlje;
    return parametri;
  }

  dajTijelo(token: string) {
    let dijelovi = token.split('.');
    let tijelo = atob(dijelovi[1]);
    return JSON.parse(tijelo);
  }

  async dajToken(korime: string) {
    let o = (await fetch(this.restServis + `baza/korisnici/${korime}/prijava`, {
      credentials: 'include' as RequestCredentials,
      method: 'GET',
    })) as Response;
    if (o.status != 201) return '';
    let token = o.headers.get('Authorization');
    return token;
  }
}
