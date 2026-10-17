import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GithubUser, GithubRepo } from '../models/github.model';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly baseUrl = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  getUser(username: string): Observable<GithubUser> {
    return this.http
      .get<GithubUser>(`${this.baseUrl}/users/${username}`)
      .pipe(catchError(this.handleError));
  }

  getRepos(username: string): Observable<GithubRepo[]> {
    return this.http
      .get<GithubRepo[]>(`${this.baseUrl}/users/${username}/repos`, {
        params: { per_page: 8, sort: 'updated' }
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let message: string;
    switch (err.status) {
      case 0:
        message = 'Network error. Internet connection check karo.';
        break;
      case 404:
        message = 'User not found.';
        break;
      case 403:
      case 429:
        message = 'GitHub API rate limit reached. Thodi der baad try karo.';
        break;
      default:
        message = `Something went wrong (status ${err.status}).`;
    }
    return throwError(() => new Error(message));
  }
}