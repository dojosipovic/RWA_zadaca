import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  restServis = environment.restServis;

  constructor() {}

  async dohvatiPodatke() {
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'GET',
    };
    let o = (await fetch(
      this.restServis + `githubPodaci`,
      parametri
    )) as Response;
    let text = await o.text();
    return text == '' ? null : JSON.parse(text);
  }

  async odjavi() {
    let parametri = {
      credentials: 'include' as RequestCredentials,
      method: 'POST',
    };
    let o = (await fetch(
      this.restServis + `githubodjava`,
      parametri
    )) as Response;
  }
}
