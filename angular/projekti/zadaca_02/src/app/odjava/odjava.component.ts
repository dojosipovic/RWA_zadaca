import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../servisi/github.service';

@Component({
  selector: 'app-odjava',
  templateUrl: './odjava.component.html',
  styleUrl: './odjava.component.scss',
})
export class OdjavaComponent implements OnInit {
  constructor(private router: Router, private githubServis: GithubService) {}
  async ngOnInit(): Promise<void> {
    await this.githubServis.odjavi();
    sessionStorage.clear();
    this.router.navigate(['pocetna']);
  }
}
