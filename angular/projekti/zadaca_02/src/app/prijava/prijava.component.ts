import { Component } from '@angular/core';
import { AutentikacijaService } from '../servisi/autentikacija.service';
import { Router } from '@angular/router';
import { TokenService } from '../servisi/token.service';
import { environment } from '../../environments/environment';
import { GithubService } from '../servisi/github.service';

declare const grecaptcha: any;

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss',
})
export class PrijavaComponent {
  korime: string = '';
  lozinka: string = '';
  poruka: string = '';
  totp: string = '';
  kljucStranica = environment.recaptcha.siteKey;
  restServis = environment.restServis;

  constructor(
    private autentikacijaServis: AutentikacijaService,
    private tokenServis: TokenService,
    private router: Router,
    private githubServis: GithubService
  ) {
    let user = sessionStorage.getItem('user');
    let github = sessionStorage.getItem('github');
    if (user != null || github != null) {
      this.router.navigate(['pocetna']);
    }
  }

  async onSubmit(event: Event) {
    if (sessionStorage.getItem('github') != null) return;
    event.preventDefault();
    grecaptcha.ready(() => {
      grecaptcha
        .execute(this.kljucStranica, {
          action: 'prijava',
        })
        .then(async (token: string) => {
          console.log(token);
          let prijava = await this.autentikacijaServis.prijavi(
            this.korime,
            this.lozinka,
            this.totp,
            token
          );
          if (!prijava) this.poruka = 'Neuspjela prijava';
          else {
            let JWT = await this.tokenServis.dajToken(this.korime);
            console.log('JWT: ' + JWT);
            let tijelo = this.tokenServis.dajTijelo(JWT!);
            console.log(tijelo);
            this.poruka = 'Uspješna prijava';
            sessionStorage.setItem('user', JSON.stringify(tijelo));
            this.router.navigate(['pocetna']);
          }
        });
    });
  }

  redirekt() {
    window.location.href = this.restServis + 'githublogin';
  }
}
