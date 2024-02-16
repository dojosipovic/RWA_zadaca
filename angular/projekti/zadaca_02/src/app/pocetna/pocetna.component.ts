import { Component } from '@angular/core';
import { SerijeI } from '../servisi/SerijeI';
import { SerijeService } from '../servisi/serije.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.scss',
})
export class PocetnaComponent {
  filter: string = '';
  serije = new Array<SerijeI>();
  slikaUrl: string = environment.posteriPutanja;
  btnPrethodno: boolean = false;
  btnTrenutno: boolean = false;
  btnSljedece: boolean = false;
  str = 1;
  ukupno = 1;

  constructor(private serijeServis: SerijeService, private router: Router) {
    let prijava = sessionStorage.getItem('user') != null;
    let github = sessionStorage.getItem('github') != null;
    if (!prijava && !github) this.router.navigate(['prijava']);
  }

  async pretrazi() {
    if (this.filter.length > 2) {
      this.prikaziSerije(1);
      this.str = 1;
    }
  }

  stranici(stranica: number) {
    this.prikaziSerije(stranica);
  }

  async prikaziSerije(stranica: number) {
    await this.serijeServis.dohvatiSerije(stranica, this.filter);
    this.serije = this.serijeServis.dajSerije();
    this.stranicenje(this.serijeServis.dajStranicenje()!);
  }

  private stranicenje({
    page,
    total_pages,
  }: {
    page: number;
    total_pages: number;
  }) {
    this.str = page;
    this.ukupno = total_pages;
    this.btnTrenutno = true;
    this.btnPrethodno = page > 1;
    this.btnSljedece = page < total_pages;
  }
}
