import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GithubService } from './servisi/github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'zadaca_02';
  prijava = false;
  github = false;
  admin = false;

  constructor(private router: Router, private githubServis: GithubService) {
    let user = sessionStorage.getItem('user');
    this.prijava = user != null;
  }

  async ngOnInit(): Promise<void> {
    let podaci = await this.githubServis.dohvatiPodatke();
    if (podaci != null) {
      this.github = true;
      sessionStorage.setItem('github', JSON.stringify(podaci));
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.github = sessionStorage.getItem('github') != null;
        if (!this.github) {
          let user = sessionStorage.getItem('user');
          this.prijava = user != null;
          if (this.prijava) {
            this.admin = JSON.parse(user!).admin;
          }
        }
      }
    });
  }
}
