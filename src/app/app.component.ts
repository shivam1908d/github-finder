import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  forkJoin, switchMap, map, catchError, of, startWith, debounceTime,
  distinctUntilChanged, filter
} from 'rxjs';
import { GithubService } from './services/github.service';
import { GithubUser, GithubRepo } from './models/github.model';

interface ViewState {
  loading: boolean;
  error: string;
  user: GithubUser | null;
  repos: GithubRepo[];
}

const IDLE: ViewState = { loading: false, error: '', user: null, repos: [] };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  username = signal('');

  state = toSignal(
    toObservable(this.username).pipe(
      debounceTime(500),
      map(u => u.trim()),
      distinctUntilChanged(),
      filter(u => u.length > 0),
      switchMap(u =>
        forkJoin({
          user: this.github.getUser(u),
          repos: this.github.getRepos(u)
        }).pipe(
          map(res => ({ ...IDLE, user: res.user, repos: res.repos })),
          catchError((err: Error) => of({ ...IDLE, error: err.message })),
          startWith({ ...IDLE, loading: true })
        )
      )
    ),
    { initialValue: IDLE }
  );

  constructor(private github: GithubService) {}
}