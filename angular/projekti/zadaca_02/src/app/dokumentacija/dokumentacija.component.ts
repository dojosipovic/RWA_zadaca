import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dokumentacija',
  templateUrl: './dokumentacija.component.html',
  styleUrl: './dokumentacija.component.scss',
})
export class DokumentacijaComponent {
  restServis = environment.restServis;
  constructor(private router: Router) {
    let user = sessionStorage.getItem('user');
    let github = sessionStorage.getItem('github');
    if (user == null && github == null) {
      this.router.navigate(['pocetna']);
    }
  }
}
