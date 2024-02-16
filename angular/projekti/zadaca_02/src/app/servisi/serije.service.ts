import { Injectable } from '@angular/core';
import { SerijaTmdbI, SerijeTmdbI } from './SerijeTmdbI';
import { environment } from '../../environments/environment';
import { SerijeI } from './SerijeI';
import { SerijaGithubI } from './SerijaGithubI';

@Injectable({
  providedIn: 'root',
})
export class SerijeService {
  private serijeTMDB?: SerijeTmdbI;
  private serijaTMDB?: SerijaTmdbI;
  private serije = new Array<SerijeI>();
  private restServis = environment.restServis;

  constructor() {}

  async dohvatiSerije(stranica: number, kljucnaRijec: string) {
    let parametriUrl = `?stranica=${stranica}&trazi=${kljucnaRijec}`;
    let o = (await fetch(
      this.restServis + 'api/tmdb/serije' + parametriUrl
    )) as Response;
    if (o.status == 200) {
      let res = JSON.parse(await o.text()) as SerijeTmdbI;
      this.serijeTMDB = res;
    }
  }

  dajSerije(): Array<SerijeI> {
    if (this.serijeTMDB == undefined) return new Array<SerijeI>();
    this.serije = new Array<SerijeI>();
    for (let s of this.serijeTMDB.results) {
      let serija: SerijeI = {
        id: s.id,
        name: s.name,
        overview: s.overview,
        poster_path: s.poster_path,
      };
      this.serije.push(serija);
    }
    return this.serije;
  }

  dajStranicenje() {
    if (this.serijeTMDB == undefined) return null;
    return {
      page: this.serijeTMDB.page,
      total_pages: this.serijeTMDB.total_pages,
    };
  }

  async dohvatiSeriju(id: string): Promise<SerijaTmdbI | null> {
    let parametriUrl = `?id=${id}`;
    let o = (await fetch(
      this.restServis + 'api/tmdb/serija' + parametriUrl
    )) as Response;
    if (o.status == 200) {
      let res = JSON.parse(await o.text());
      console.log(res);
      if (res.success == false) return null;
      return res as SerijaTmdbI;
    }
    return null;
  }

  async dohvatiSerijuGithub(id: number): Promise<SerijaGithubI | null> {
    let parametriUrl = `?id=${id}`;
    let o = (await fetch(
      this.restServis + 'api/tmdb/serija' + parametriUrl
    )) as Response;
    if (o.status == 200) {
      let res = JSON.parse(await o.text());
      console.log(res);
      if (res.success == false) return null;
      return res as SerijaGithubI;
    }
    return null;
  }
}
