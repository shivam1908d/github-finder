import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, NewPost } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl, { params: { _limit: 5 } });
  }

  createPost(post: NewPost): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, post);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/${post.id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}