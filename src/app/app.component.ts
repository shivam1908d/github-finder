import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { GithubService } from './services/github.service';
import { GithubUser, GithubRepo } from './models/github.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  username = '';
  user: GithubUser | null = null;
  repos: GithubRepo[] = [];
  loading = false;
  error = '';

  constructor(private github: GithubService) {}

  search() {
    if (!this.username.trim()) return;
    this.loading = true;
    this.error = '';
    this.user = null;

    forkJoin({
      user: this.github.getUser(this.username),
      repos: this.github.getRepos(this.username)
    }).subscribe({
      next: (res) => {
        this.user = res.user;
        this.repos = res.repos;
        this.loading = false;
      },
      error: (err: Error) => {
      this.error = err.message;
       this.loading = false;
      }
    });
  }
}